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
          } catch (error) {
            console.warn(`Failed to process chunk ${i}:`, error);
          }
        }
      }

      console.log('Profile data loaded and indexed successfully');
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

      // Create the prompt
      const prompt = `Based on the following context about my professional profile, please answer the question.

Context:
${context}

Question: ${query}

Please provide a comprehensive and accurate answer based on the context provided. If the context doesn't contain enough information to fully answer the question, please indicate what additional information might be needed.

Answer:`;

      // Generate response using Groq
      const response = await this.groq.generateResponse([
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
  }> {
    const vectorInfo = await this.vectorClient.getVectorInfo();
    const usageStats = this.groq.getUsageStats();

    return {
      isInitialized: this.isInitialized,
      vectorInfo,
      usageStats
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