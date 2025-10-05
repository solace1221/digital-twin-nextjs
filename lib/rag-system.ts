// RAG System for Digital Twin MCP Server
import { GroqLLMClient } from './groq-client';
import { UpstashVectorClient, VectorSearchResult } from './upstash-vector';
import { EmbeddingService } from './embedding-service';
import fs from 'fs/promises';
import path from 'path';

export interface RAGOptions {
  topK?: number;
  temperature?: number;
  maxTokens?: number;
  similarityThreshold?: number;
}

export interface SearchResult {
  content: string;
  score: number;
  metadata?: Record<string, any>;
}

export class RAGSystem {
  private groq: GroqLLMClient;
  private vectorClient: UpstashVectorClient;
  private embeddingService: EmbeddingService;
  private isInitialized: boolean = false;
  private vectorStorageAvailable: boolean = false;

  constructor() {
    this.groq = new GroqLLMClient();
    this.vectorClient = new UpstashVectorClient();
    this.embeddingService = new EmbeddingService();
  }

  async initialize(): Promise<void> {
    try {
      console.log('Initializing RAG system...');
      await this.loadProfileData();
      this.isInitialized = true;
      console.log('RAG system initialized successfully');
    } catch (error) {
      console.error('Error initializing RAG system:', error);
      throw error;
    }
  }

  private async loadProfileData(): Promise<void> {
    try {
      const profilePath = path.join(process.cwd(), 'data', 'digitaltwin.json');
      const profileData = await fs.readFile(profilePath, 'utf-8');
      const profile = JSON.parse(profileData);

      console.log('Processing profile data for vector storage...');

      // Extract content chunks from the profile
      const contentChunks: string[] = [];
      const metadata: Record<string, any>[] = [];

      // Process different sections of the profile
      this.extractContentFromObject(profile, contentChunks, metadata, 'profile');

      console.log(`Found ${contentChunks.length} content chunks to process`);

      // Generate embeddings and store in vector database
      let vectorStorageSuccessful = false;
      let processedChunks = 0;
      let vectorStorageError = null;

      for (let i = 0; i < contentChunks.length; i++) {
        const chunk = contentChunks[i];
        const meta = metadata[i];

        if (chunk.trim().length > 0) {
          try {
            const embedding = await this.embeddingService.generateEmbedding(chunk);
            await this.vectorClient.upsertVector(`chunk_${i}`, embedding, {
              ...meta,
              content: chunk,
              index: i
            });
            processedChunks++;
            vectorStorageSuccessful = true;
          } catch (error) {
            console.warn(`Failed to process chunk ${i}:`, error);
            
            // Store the first error for later reference
            if (!vectorStorageError) {
              vectorStorageError = error;
            }
            
            // If this is the first chunk and it fails with auth error, stop trying
            if (i === 0 && error instanceof Error && error.message.includes('Unauthorized')) {
              console.warn('Vector storage appears to be unavailable due to authentication issues. RAG system will continue without vector search capabilities.');
              break;
            }
          }
        }
      }

      if (vectorStorageSuccessful) {
        console.log(`Profile data loaded and ${processedChunks} chunks indexed successfully`);
        this.vectorStorageAvailable = true;
      } else {
        console.warn('Profile data loaded but vector storage is not available. Search functionality will be limited.');
        console.warn('Vector storage error:', vectorStorageError);
        this.vectorStorageAvailable = false;
      }
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

  async search(query: string, options: RAGOptions = {}): Promise<SearchResult[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // If vector storage is not available, return empty results
    if (!this.vectorStorageAvailable) {
      console.warn('Vector search unavailable - vector storage was not initialized successfully');
      return [];
    }

    try {
      console.log(`Searching for: "${query}"`);
      
      // Generate query embedding
      const queryEmbedding = await this.embeddingService.generateEmbedding(query);
      
      // Search for similar vectors
      const vectorResults = await this.vectorClient.searchSimilar(
        queryEmbedding,
        options.topK || 5
      );

      // Filter results by similarity threshold
      const threshold = options.similarityThreshold || 0.1;
      const filteredResults = vectorResults.filter(result => result.score >= threshold);

      // Convert to search results
      const searchResults: SearchResult[] = filteredResults.map(result => ({
        content: result.metadata?.content || '',
        score: result.score,
        metadata: result.metadata
      }));

      console.log(`Found ${searchResults.length} relevant results`);
      return searchResults;
    } catch (error) {
      console.error('Error during search:', error);
      
      // If vector search fails due to authentication, return empty results
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        console.warn('Vector search unavailable due to authentication issues. Returning empty results.');
        return [];
      }
      
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
        .map((result, index) => `[Context ${index + 1}]: ${result.content}`)
        .join('\n\n');

      // Create the prompt with first-person instruction
      const prompt = `Based on the following information about you (Lovely Pearl B. Alan), answer the question in FIRST PERSON.

Important: You ARE Lovely. Use "I", "my", "me" throughout your answer. Never refer to yourself in third person.

Your Information:
${context}

Question: ${query}

Answer as Lovely herself:`;

      // Generate response using Groq with system message
      const response = await this.groq.generateResponse([
        { 
          role: 'system', 
          content: 'You are Lovely Pearl B. Alan, a BSIT student at St. Paul University Philippines. Answer all questions in FIRST PERSON as if YOU are Lovely speaking directly about YOUR OWN background, skills, and experience. Always use "I", "my", "me" - NEVER refer to Lovely in third person. Be honest and natural - you\'re a talented student with real achievements, currently pursuing your degree and looking for opportunities to grow.'
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
        .map((result, index) => `[Context ${index + 1}]: ${result.content}`)
        .join('\n\n');

      // Create the prompt with first-person instruction
      const prompt = `Based on the following information about you (Lovely Pearl B. Alan), answer the question in FIRST PERSON.

Important: You ARE Lovely. Use "I", "my", "me" throughout your answer. Never refer to yourself in third person.

Your Information:
${context}

Question: ${query}

Answer as Lovely herself:`;

      // Generate streaming response using Groq with system message
      const stream = this.groq.generateStreamingResponse([
        { 
          role: 'system', 
          content: 'You are Lovely Pearl B. Alan, a BSIT student at St. Paul University Philippines. Answer all questions in FIRST PERSON as if YOU are Lovely speaking directly about YOUR OWN background, skills, and experience. Always use "I", "my", "me" - NEVER refer to Lovely in third person. Be honest and natural - you\'re a talented student with real achievements, currently pursuing your degree and looking for opportunities to grow.'
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
    usageStats?: any;
  }> {
    const searchResults = await this.search(query, options);
    const response = await this.generateResponse(query, searchResults, options);
    const usageStats = this.groq.getUsageStats();

    return {
      searchResults,
      response,
      usageStats
    };
  }

  async getSystemInfo(): Promise<{
    isInitialized: boolean;
    vectorInfo: any;
    usageStats: any;
    vectorStorageAvailable?: boolean;
  }> {
    let vectorInfo = null;
    
    try {
      if (this.vectorStorageAvailable) {
        vectorInfo = await this.vectorClient.getVectorInfo();
      } else {
        vectorInfo = {
          status: 'unavailable',
          reason: 'Vector storage authentication failed',
          recommendation: 'Check Upstash Vector credentials'
        };
      }
    } catch (error) {
      console.warn('Failed to get vector info:', error);
      vectorInfo = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        recommendation: 'Check Upstash Vector credentials and network connectivity'
      };
    }
    
    const usageStats = this.groq.getUsageStats();

    return {
      isInitialized: this.isInitialized,
      vectorInfo,
      usageStats,
      vectorStorageAvailable: this.vectorStorageAvailable
    };
  }

  async reset(): Promise<void> {
    try {
      await this.vectorClient.reset();
      this.groq.resetUsageStats();
      this.isInitialized = false;
      console.log('RAG system reset successfully');
    } catch (error) {
      console.error('Error resetting RAG system:', error);
      throw error;
    }
  }
}