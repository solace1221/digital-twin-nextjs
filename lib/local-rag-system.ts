// Local RAG System (fallback when Upstash is not available)
import { GroqLLMClient } from './groq-client';
import { FollowUpQuestionGenerator } from './follow-up-generator';
import { EmbeddingService, EmbeddingService as ES } from './embedding-service';
import fs from 'fs/promises';
import path from 'path';

export interface LocalSearchResult {
  content: string;
  score: number;
  metadata?: Record<string, any>;
}

export interface LocalRAGOptions {
  topK?: number;
  temperature?: number;
  maxTokens?: number;
  similarityThreshold?: number;
  generateFollowUp?: boolean;
  conversationHistory?: Array<{ role: string; content: string }>;
}

interface StoredEmbedding {
  id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
}

export class LocalRAGSystem {
  private groq: GroqLLMClient;
  private followUpGenerator: FollowUpQuestionGenerator;
  private embeddingService: EmbeddingService;
  private isInitialized: boolean = false;
  private embeddings: StoredEmbedding[] = [];
  private lastQuestion: string = '';
  private lastResponse: string = '';

  constructor() {
    this.groq = new GroqLLMClient();
    this.followUpGenerator = new FollowUpQuestionGenerator();
    this.embeddingService = new EmbeddingService();
  }

  async initialize(): Promise<void> {
    try {
      console.log('Initializing Local RAG system...');
      await this.loadProfileData();
      this.isInitialized = true;
      console.log('Local RAG system initialized successfully');
    } catch (error) {
      console.error('Error initializing Local RAG system:', error);
      throw error;
    }
  }

  private async loadProfileData(): Promise<void> {
    try {
      const profilePath = path.join(process.cwd(), 'data', 'digitaltwin.json');
      const profileData = await fs.readFile(profilePath, 'utf-8');
      const profile = JSON.parse(profileData);

      console.log('Processing profile data for local storage...');

      // Extract content chunks from the profile
      const contentChunks: string[] = [];
      const metadata: Record<string, any>[] = [];

      // Process different sections of the profile
      this.extractContentFromObject(profile, contentChunks, metadata, 'profile');

      console.log(`Found ${contentChunks.length} content chunks to process`);

      // Generate embeddings and store locally
      this.embeddings = [];
      for (let i = 0; i < contentChunks.length; i++) {
        const chunk = contentChunks[i];
        const meta = metadata[i];

        if (chunk.trim().length > 0) {
          try {
            const embedding = await this.embeddingService.generateEmbedding(chunk);
            this.embeddings.push({
              id: `chunk_${i}`,
              content: chunk,
              embedding: embedding,
              metadata: {
                ...meta,
                index: i
              }
            });
          } catch (error) {
            console.warn(`Failed to process chunk ${i}:`, error);
          }
        }
      }

      console.log(`Local storage initialized with ${this.embeddings.length} embeddings`);
    } catch (error) {
      console.error('Error loading profile data:', error);
      throw error;
    }
  }

  private extractContentFromObject(
    obj: any, 
    chunks: string[], 
    metadata: Record<string, any>[], 
    prefix: string
  ): void {
    if (typeof obj === 'string' && obj.trim().length > 0) {
      chunks.push(obj);
      metadata.push({ section: prefix, type: 'text' });
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        if (typeof item === 'string') {
          chunks.push(item);
          metadata.push({ section: prefix, type: 'array_item', index });
        } else if (typeof item === 'object') {
          this.extractContentFromObject(item, chunks, metadata, `${prefix}[${index}]`);
        }
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        this.extractContentFromObject(value, chunks, metadata, `${prefix}.${key}`);
      });
    }
  }

  async search(query: string, options: LocalRAGOptions = {}): Promise<LocalSearchResult[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log(`Searching locally for: "${query}"`);
      
      // Generate query embedding
      const queryEmbedding = await this.embeddingService.generateEmbedding(query);
      
      // Calculate similarities and rank results
      const similarities = this.embeddings.map(item => ({
        ...item,
        score: ES.cosineSimilarity(queryEmbedding, item.embedding)
      }));

      // Filter by similarity threshold and sort by score
      const threshold = options.similarityThreshold || 0.1;
      const filteredResults = similarities
        .filter(result => result.score >= threshold)
        .sort((a, b) => b.score - a.score)
        .slice(0, options.topK || 5);

      // Convert to search results
      const searchResults: LocalSearchResult[] = filteredResults.map(result => ({
        content: result.content,
        score: result.score,
        metadata: result.metadata
      }));

      console.log(`Found ${searchResults.length} relevant results locally`);
      return searchResults;
    } catch (error) {
      console.error('Error during local search:', error);
      throw error;
    }
  }

  async generateResponse(
    query: string, 
    searchResults: LocalSearchResult[], 
    options: LocalRAGOptions = {}
  ): Promise<string> {
    try {
      // Build context from search results
      const context = searchResults
        .map((result, index) => `[Context ${index + 1}]: ${result.content}`)
        .join('\n\n');

      // Create the prompt for first-person responses as Lovely
      const prompt = `You are Lovely Pearl B. Alan, a BSIT student and aspiring Data Analyst. Answer this question in first person, as if you are speaking directly to the person asking.

My Professional Context:
${context}

Question: ${query}

Guidelines for your response:
- Professional tone, no emojis
- 2-3 SHORT sentences or bullet points MAX
- Use first person (I, my, me)
- Focus on key qualifications
- Direct and impressive

Answer professionally as Lovely:`;

      // Generate response using Groq
      const response = await this.groq.generateResponse([
        { 
          role: 'system', 
          content: 'You are Lovely Pearl B. Alan. Provide professional, concise responses. No emojis. Maximum 3-4 sentences or bullet points. Be direct and impressive. Complete your thoughts fully.'
        },
        { role: 'user', content: prompt }
      ], {
        temperature: options.temperature || 0.7,
        maxTokens: options.maxTokens || 150
      });

      return response;
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }

  async *generateStreamingResponse(
    query: string,
    searchResults: LocalSearchResult[],
    options: LocalRAGOptions = {}
  ): AsyncGenerator<string, void, unknown> {
    try {
      // Build context from search results
      const context = searchResults
        .map((result, index) => `[Context ${index + 1}]: ${result.content}`)
        .join('\n\n');

      // Create the prompt
      const prompt = `Based on the following context about my professional profile, please answer the question.

Context:
${context}

Question: ${query}

Please provide a comprehensive and accurate answer based on the context provided. If the context doesn't contain enough information to fully answer the question, please indicate what additional information might be needed.

Answer:`;

      // Generate streaming response using Groq
      const stream = this.groq.generateStreamingResponse([
        { role: 'user', content: prompt }
      ], {
        temperature: options.temperature || 0.7,
        maxTokens: options.maxTokens || 1000
      });

      for await (const chunk of stream) {
        yield chunk;
      }
    } catch (error) {
      console.error('Error generating streaming response:', error);
      throw error;
    }
  }

  async queryWithResponse(query: string, options: LocalRAGOptions = {}): Promise<{
    searchResults: LocalSearchResult[];
    response: string;
    followUpQuestion?: string;
    usageStats?: any;
  }> {
    const searchResults = await this.search(query, options);
    const response = await this.generateResponse(query, searchResults, options);
    
    // Store for follow-up generation
    this.lastQuestion = query;
    this.lastResponse = response;
    
    let followUpQuestion: string | undefined;
    
    // Generate follow-up question if requested
    if (options.generateFollowUp) {
      try {
        const followUpResult = await this.followUpGenerator.generateFollowUp(
          response,
          query,
          {
            conversationHistory: options.conversationHistory,
            depth: 'moderate',
            temperature: 0.8
          }
        );
        followUpQuestion = followUpResult.followUpQuestion;
        console.log('[Local RAG System] Generated follow-up question');
      } catch (error) {
        console.error('[Local RAG System] Failed to generate follow-up:', error);
        // Don't fail the whole request if follow-up generation fails
      }
    }
    
    const usageStats = this.groq.getUsageStats();

    return {
      searchResults,
      response,
      followUpQuestion,
      usageStats
    };
  }

  /**
   * Generate a contextual follow-up question based on user's last response
   */
  async generateFollowUpQuestion(
    userMessage: string,
    options: {
      conversationHistory?: Array<{ role: string; content: string }>;
      scenario?: 'achievement' | 'challenge' | 'leadership' | 'technical' | 'career';
    } = {}
  ): Promise<string> {
    try {
      if (options.scenario) {
        return await this.followUpGenerator.generateInterviewFollowUp(
          options.scenario,
          userMessage,
          this.lastQuestion
        );
      } else {
        const result = await this.followUpGenerator.generateFollowUp(
          userMessage,
          this.lastQuestion,
          {
            conversationHistory: options.conversationHistory,
            depth: 'moderate'
          }
        );
        return result.followUpQuestion;
      }
    } catch (error) {
      console.error('[Local RAG System] Error generating follow-up:', error);
      throw error;
    }
  }

  /**
   * Generate an initial follow-up question for a topic
   */
  async generateInitialFollowUp(topic: string): Promise<string> {
    return await this.followUpGenerator.generateInitialFollowUp(topic);
  }

  async getSystemInfo(): Promise<{
    isInitialized: boolean;
    embeddingsCount: number;
    usageStats: any;
  }> {
    const usageStats = this.groq.getUsageStats();

    return {
      isInitialized: this.isInitialized,
      embeddingsCount: this.embeddings.length,
      usageStats
    };
  }

  async reset(): Promise<void> {
    try {
      this.embeddings = [];
      this.groq.resetUsageStats();
      this.isInitialized = false;
      console.log('Local RAG system reset successfully');
    } catch (error) {
      console.error('Error resetting Local RAG system:', error);
      throw error;
    }
  }
}