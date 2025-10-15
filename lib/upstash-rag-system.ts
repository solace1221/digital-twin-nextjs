// Upstash-native RAG System (matches Python implementation)
// Uses Upstash Vector's built-in embeddings instead of custom embedding service
import { GroqLLMClient } from './groq-client';
import { FollowUpQuestionGenerator } from './follow-up-generator';
import { Index } from '@upstash/vector';
import fs from 'fs/promises';
import path from 'path';

export interface RAGOptions {
  topK?: number;
  temperature?: number;
  maxTokens?: number;
  generateFollowUp?: boolean;
  conversationHistory?: Array<{ role: string; content: string }>;
}

export interface SearchResult {
  content: string;
  score: number;
  metadata?: Record<string, any>;
  title?: string;
}

export class UpstashRAGSystem {
  private groq: GroqLLMClient;
  private followUpGenerator: FollowUpQuestionGenerator;
  private vectorIndex: Index | null = null;
  private isInitialized: boolean = false;
  private lastQuestion: string = '';
  private lastResponse: string = '';

  constructor() {
    this.groq = new GroqLLMClient();
    this.followUpGenerator = new FollowUpQuestionGenerator();
  }

  async initialize(): Promise<void> {
    try {
      console.log('[RAG System] Initializing Upstash-native RAG system...');
      
      // Validate environment variables
      if (!process.env.UPSTASH_VECTOR_REST_URL) {
        throw new Error('UPSTASH_VECTOR_REST_URL is not set');
      }
      if (!process.env.UPSTASH_VECTOR_REST_TOKEN) {
        throw new Error('UPSTASH_VECTOR_REST_TOKEN is not set');
      }
      if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is not set');
      }
      
      // Initialize Upstash Vector with environment variables
      console.log('[RAG System] Connecting to Upstash Vector...');
      this.vectorIndex = new Index({
        url: process.env.UPSTASH_VECTOR_REST_URL,
        token: process.env.UPSTASH_VECTOR_REST_TOKEN,
      });

      // Check current vector count
      console.log('[RAG System] Checking vector database...');
      const info = await this.vectorIndex.info();
      const currentCount = info.vectorCount || 0;
      console.log(`[RAG System] Current vectors in database: ${currentCount}`);

      // Load profile data if database is empty
      if (currentCount === 0) {
        console.log('[RAG System] Database empty, loading profile data...');
        await this.loadProfileData();
      }

      this.isInitialized = true;
      console.log('[RAG System] ✅ Initialization complete');
    } catch (error) {
      console.error('[RAG System] ❌ Initialization failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      this.isInitialized = false;
      throw error;
    }
  }

  private async loadProfileData(): Promise<void> {
    try {
      const profilePath = path.join(process.cwd(), 'data', 'digitaltwin.json');
      const profileData = await fs.readFile(profilePath, 'utf-8');
      const profile = JSON.parse(profileData);

      console.log('Processing profile data...');

      // Get content chunks from profile
      const contentChunks = profile.content_chunks || [];
      
      if (contentChunks.length === 0) {
        console.warn('No content chunks found in profile');
        return;
      }

      // Prepare vectors (Upstash will generate embeddings automatically)
      const vectors = contentChunks.map((chunk: any) => {
        const enrichedText = `${chunk.title}: ${chunk.content}`;
        
        return {
          id: chunk.id,
          data: enrichedText,
          metadata: {
            title: chunk.title,
            type: chunk.type,
            content: chunk.content,
            category: chunk.metadata?.category || '',
            tags: (chunk.metadata?.tags || []).join(',')
          }
        };
      });

      // Upload vectors (Upstash generates embeddings using built-in model)
      if (this.vectorIndex) {
        await this.vectorIndex.upsert(vectors);
        console.log(`Successfully uploaded ${vectors.length} content chunks!`);
      }

      // Also load interview Q&A if available
      const interviewQA = profile.interview_qa;
      if (interviewQA && interviewQA.categories) {
        console.log('Loading interview Q&A pairs...');
        let qaCount = 0;
        
        for (const [category, questions] of Object.entries(interviewQA.categories)) {
          const qaArray = questions as any[];
          for (const qa of qaArray) {
            const qaText = `Interview Question: ${qa.question}\n\nAnswer: ${qa.answer}`;
            const qaId = `qa_${category}_${qaCount}`;
            
            if (this.vectorIndex) {
              await this.vectorIndex.upsert([
                {
                  id: qaId,
                  data: qaText,
                  metadata: {
                    type: 'interview_qa',
                    question: qa.question,
                    answer: qa.answer,
                    category: category,
                    title: `Q&A: ${qa.question.substring(0, 50)}`,
                    content: qa.answer,
                    tags: `interview,qa,${category}`
                  }
                }
              ]);
              qaCount++;
            }
          }
        }
        
        console.log(`Successfully uploaded ${qaCount} interview Q&A pairs!`);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      throw error;
    }
  }

  async search(query: string, options: RAGOptions = {}): Promise<SearchResult[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.vectorIndex) {
      throw new Error('Vector index not initialized');
    }

    try {
      console.log(`Searching for: "${query}"`);
      
      // Query using Upstash's built-in embedding (no manual embedding needed!)
      const results = await this.vectorIndex.query({
        data: query,
        topK: options.topK || 3,
        includeMetadata: true
      });

      // Convert to search results
      // Handle both formats: {title, content} and {question, answer}
      const searchResults: SearchResult[] = results.map((result: any) => {
        const metadata = result.metadata || {};
        
        // Q&A format (question/answer)
        if (metadata.question || metadata.answer) {
          return {
            content: metadata.answer || '',
            score: result.score || 0,
            metadata: result.metadata,
            title: metadata.question || 'Q&A'
          };
        }
        
        // Standard format (title/content)
        return {
          content: metadata.content || '',
          score: result.score || 0,
          metadata: result.metadata,
          title: metadata.title || 'Information'
        };
      });

      console.log(`Found ${searchResults.length} relevant results`);
      return searchResults;
    } catch (error) {
      console.error('Error during search:', error);
      throw error;
    }
  }

  async generateResponse(
    query: string, 
    searchResults: SearchResult[], 
    options: RAGOptions = {}
  ): Promise<string> {
    try {
      // Build context from search results
      const context = searchResults
        .map((result) => `${result.title}: ${result.content}`)
        .join('\n\n');

      // Create the prompt with first-person and bilingual instruction
      const prompt = `Based ONLY on the following verified information about you (Lovely Pearl B. Alan), answer the question in FIRST PERSON. 

CRITICAL RULES:
1. You ARE Lovely Pearl Alan. Use "I"/"ako", "my"/"ko", "me"/"akin" throughout your answer
2. DETECT the language of the question - if asked in Tagalog/Filipino, respond in Tagalog. If in English, respond in English
3. ❌ ABSOLUTELY FORBIDDEN - NEVER use the word "profile" in ANY form:
   - ❌ "ayon sa aking profile" / "according to my profile"
   - ❌ "base sa profile ko" / "based on my profile"
   - ❌ "nalaman ko sa profile" / "learned from profile"
   - ❌ "bahagi ng profile" / "part of profile"
   - ❌ "nabanggit sa profile" / "mentioned in profile"
   - ❌ "nakasaad sa profile" / "stated in profile"
   - ❌ ANY sentence containing the word "profile"
   - ✅ Instead: State facts DIRECTLY as YOUR lived experience!
4. ONLY use information provided in the context below - DO NOT make up or invent any achievements, competitions, or experiences
5. If the context doesn't contain information, say "I don't have that information right now" / "Wala akong information tungkol diyan"
6. Your BIGGEST ACHIEVEMENT is the Good Moral Application and Monitoring System - NOT any coding competition
7. NEVER mention ICPC, coding competitions, or any achievements not in the context below

EXAMPLE:
❌ WRONG: "Nalaman ko sa profile na pwede akong magtrabaho abroad"
✅ CORRECT: "Pwede akong magtrabaho abroad"

Verified Information About You:
${context}

Question: ${query}

Answer as Lovely herself in ENGLISH ONLY, stating facts DIRECTLY (NEVER use word "profile"):`;

      // Generate response using Groq - ENGLISH ONLY
      const response = await this.groq.generateResponse([
        { 
          role: 'system', 
          content: 'You are Lovely Pearl B. Alan, a BSIT student at St. Paul University Philippines. ALWAYS respond in ENGLISH ONLY, regardless of what language the question is asked in. Answer all questions in FIRST PERSON as if YOU are Lovely speaking directly about YOUR OWN background, skills, and experience. Always use "I", "my", "me" - NEVER refer to Lovely in third person. NEVER use phrases like "according to my profile", "based on my profile", or "in my knowledge" - these break first-person immersion. Just state facts directly as YOUR OWN experience. CRITICAL: ONLY use information from the provided context. DO NOT invent achievements, competitions (especially ICPC or coding contests), or experiences. If information is not in the context, say you don\'t have that specific detail. Your biggest achievement is the Good Moral Application and Monitoring System with Decision Support - stick to the facts provided. Remember: ENGLISH ONLY responses.'
        },
        { role: 'user', content: prompt }
      ], {
        temperature: options.temperature || 0.7,
        maxTokens: options.maxTokens || 1000
      });

      return response;
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }

  async *generateStreamingResponse(
    query: string,
    searchResults: SearchResult[],
    options: RAGOptions = {}
  ): AsyncGenerator<string, void, unknown> {
    try {
      // Build context from search results
      const context = searchResults
        .map((result) => `${result.title}: ${result.content}`)
        .join('\n\n');

      // Create the prompt with first-person and bilingual instruction
      const prompt = `Based ONLY on the following verified information about you (Lovely Pearl B. Alan), answer the question in FIRST PERSON. 

CRITICAL RULES:
1. You ARE Lovely Pearl Alan. Use "I"/"ako", "my"/"ko", "me"/"akin" throughout your answer
2. DETECT the language of the question - if asked in Tagalog/Filipino, respond in Tagalog. If in English, respond in English
3. ❌ ABSOLUTELY FORBIDDEN - NEVER use the word "profile" in ANY form:
   - ❌ "ayon sa aking profile" / "according to my profile"
   - ❌ "base sa profile ko" / "based on my profile"
   - ❌ "nalaman ko sa profile" / "learned from profile"
   - ❌ "bahagi ng profile" / "part of profile"
   - ❌ "nabanggit sa profile" / "mentioned in profile"
   - ❌ "nakasaad sa profile" / "stated in profile"
   - ❌ ANY sentence containing the word "profile"
   - ✅ Instead: State facts DIRECTLY as YOUR lived experience!
4. ONLY use information provided in the context below - DO NOT make up or invent any achievements, competitions, or experiences
5. If the context doesn't contain information, say "I don't have that information right now" / "Wala akong information tungkol diyan"
6. Your BIGGEST ACHIEVEMENT is the Good Moral Application and Monitoring System - NOT any coding competition
7. NEVER mention ICPC, coding competitions, or any achievements not in the context below

EXAMPLE:
❌ WRONG: "Nalaman ko sa profile na pwede akong magtrabaho abroad"
✅ CORRECT: "Pwede akong magtrabaho abroad"

Verified Information About You:
${context}

Question: ${query}

Answer as Lovely herself in ENGLISH ONLY, using ONLY the information provided above:`;

      // Generate streaming response using Groq - ENGLISH ONLY
      const stream = this.groq.generateStreamingResponse([
        { 
          role: 'system', 
          content: 'You are Lovely Pearl B. Alan, a BSIT student at St. Paul University Philippines. ALWAYS respond in ENGLISH ONLY, regardless of what language the question is asked in. Answer all questions in FIRST PERSON as if YOU are Lovely speaking directly about YOUR OWN background, skills, and experience. Always use "I", "my", "me" - NEVER refer to Lovely in third person. ❌ CRITICAL PROHIBITION: NEVER EVER use the word "profile" in ANY language or form. This word is ABSOLUTELY FORBIDDEN. Instead, state facts DIRECTLY as YOUR lived experience - you ARE Lovely speaking about YOUR life, not reading from a profile. CRITICAL: ONLY use information from the provided context. DO NOT invent achievements, competitions (especially ICPC or coding contests), or experiences. If information is not in the context, say you don\'t have that detail. Your biggest achievement is the Good Moral Application and Monitoring System with Decision Support - stick to the facts provided. Remember: ENGLISH ONLY responses.'
        },
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

  async queryWithResponse(query: string, options: RAGOptions = {}): Promise<{
    searchResults: SearchResult[];
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
        console.log('[RAG System] Generated follow-up question');
      } catch (error) {
        console.error('[RAG System] Failed to generate follow-up:', error);
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
   * This is useful when user says "tell me more" or gives a short answer
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
        // Use scenario-specific follow-up
        return await this.followUpGenerator.generateInterviewFollowUp(
          options.scenario,
          userMessage,
          this.lastQuestion
        );
      } else {
        // Use general follow-up
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
      console.error('[RAG System] Error generating follow-up:', error);
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
    vectorInfo: any;
    usageStats: any;
  }> {
    let vectorInfo = null;
    
    try {
      if (this.vectorIndex) {
        vectorInfo = await this.vectorIndex.info();
      }
    } catch (error) {
      console.warn('Failed to get vector info:', error);
      vectorInfo = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
    
    const usageStats = this.groq.getUsageStats();

    return {
      isInitialized: this.isInitialized,
      vectorInfo,
      usageStats
    };
  }

  async reset(): Promise<void> {
    try {
      if (this.vectorIndex) {
        await this.vectorIndex.reset();
      }
      this.groq.resetUsageStats();
      this.isInitialized = false;
      console.log('RAG system reset successfully');
    } catch (error) {
      console.error('Error resetting RAG system:', error);
      throw error;
    }
  }
}
