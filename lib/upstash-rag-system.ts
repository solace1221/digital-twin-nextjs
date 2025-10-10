// Upstash-native RAG System (matches Python implementation)
// Uses Upstash Vector's built-in embeddings instead of custom embedding service
import { GroqLLMClient } from './groq-client';
import { Index } from '@upstash/vector';
import fs from 'fs/promises';
import path from 'path';

export interface RAGOptions {
  topK?: number;
  temperature?: number;
  maxTokens?: number;
}

export interface SearchResult {
  content: string;
  score: number;
  metadata?: Record<string, any>;
  title?: string;
}

export class UpstashRAGSystem {
  private groq: GroqLLMClient;
  private vectorIndex: Index | null = null;
  private isInitialized: boolean = false;

  constructor() {
    this.groq = new GroqLLMClient();
  }

  async initialize(): Promise<void> {
    try {
      console.log('Initializing Upstash-native RAG system...');
      
      // Initialize Upstash Vector with environment variables
      this.vectorIndex = new Index({
        url: process.env.UPSTASH_VECTOR_REST_URL!,
        token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
      });

      // Check current vector count
      const info = await this.vectorIndex.info();
      const currentCount = info.vectorCount || 0;
      console.log(`Current vectors in database: ${currentCount}`);

      // Load profile data if database is empty
      if (currentCount === 0) {
        console.log('Database empty, loading profile data...');
        await this.loadProfileData();
      }

      this.isInitialized = true;
      console.log('Upstash RAG system initialized successfully');
    } catch (error) {
      console.error('Error initializing Upstash RAG system:', error);
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
      // Detect language (simple detection based on common Tagalog words)
      const tagalogKeywords = ['ano', 'paano', 'saan', 'kailan', 'bakit', 'sino', 'mga', 'ka', 'mo', 'ang', 'ng', 'sa', 'ay'];
      const isTagalog = tagalogKeywords.some(keyword => 
        query.toLowerCase().includes(` ${keyword} `) || 
        query.toLowerCase().startsWith(`${keyword} `) ||
        query.toLowerCase().endsWith(` ${keyword}`)
      );

      // Build context from search results
      const context = searchResults
        .map((result) => `${result.title}: ${result.content}`)
        .join('\n\n');

      // Create bilingual system prompt
      const systemContent = isTagalog 
        ? `Ikaw si Lovely Pearl B. Alan. Sumagot sa unang panauhan (first person) gamit ang "ako", "aking", "akin". Gumamit LAMANG ng impormasyon mula sa konteksto sa ibaba - HUWAG mag-imbento ng mga tagumpay o karanasan.

MAHALAGANG PATAKARAN:
1. Ikaw ay si Lovely Pearl Alan - gamitin ang "ako", "aking", "akin"
2. Sumagot sa Tagalog nang propesyonal at masigasig
3. Gumamit LAMANG ng impormasyon mula sa konteksto
4. Kung walang impormasyon sa konteksto, sabihin "Wala akong partikular na impormasyon tungkol diyan sa aking profile sa ngayon"
5. Ang iyong pinakamalaking tagumpay ay ang Good Moral Application and Monitoring System

Napatunayang Impormasyon Tungkol Sa Iyo:
${context}`
        : `You are Lovely Pearl B. Alan, a BSIT student at St. Paul University Philippines. Answer all questions in FIRST PERSON as if YOU are Lovely speaking directly about YOUR OWN background, skills, and experience. Always use "I", "my", "me" - NEVER refer to Lovely in third person. 

CRITICAL RULES:
1. You ARE Lovely Pearl Alan - use "I", "my", "me" throughout
2. ONLY use information provided in the context below - DO NOT make up or invent any achievements, competitions, or experiences
3. If the context doesn't contain information to answer the question, say "I don't have that specific information in my profile right now"
4. Your BIGGEST ACHIEVEMENT is the Good Moral Application and Monitoring System - NOT any coding competition
5. NEVER mention ICPC, coding competitions, or any achievements not in the context below
6. Provide detailed, comprehensive, elaborate answers (3-5 paragraphs minimum) when possible
7. Respond professionally and enthusiastically about your qualifications

Verified Information About You:
${context}`;

      const userContent = isTagalog
        ? `Tanong: ${query}\n\nSumagot bilang si Lovely, gamit LAMANG ang impormasyon mula sa itaas:`
        : `Question: ${query}\n\nAnswer as Lovely herself, using ONLY the information provided above:`;

      // Create the prompt
      const prompt = `${systemContent}\n\n${userContent}`;

      // Generate response using Groq
      const response = await this.groq.generateResponse([
        { 
          role: 'system', 
          content: systemContent
        },
        { role: 'user', content: userContent }
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
      // Detect language (simple detection based on common Tagalog words)
      const tagalogKeywords = ['ano', 'paano', 'saan', 'kailan', 'bakit', 'sino', 'mga', 'ka', 'mo', 'ang', 'ng', 'sa', 'ay'];
      const isTagalog = tagalogKeywords.some(keyword => 
        query.toLowerCase().includes(` ${keyword} `) || 
        query.toLowerCase().startsWith(`${keyword} `) ||
        query.toLowerCase().endsWith(` ${keyword}`)
      );

      // Build context from search results
      const context = searchResults
        .map((result) => `${result.title}: ${result.content}`)
        .join('\n\n');

      // Create bilingual system prompt
      const systemContent = isTagalog 
        ? `Ikaw si Lovely Pearl B. Alan. Sumagot sa unang panauhan (first person) gamit ang "ako", "aking", "akin". Gumamit LAMANG ng impormasyon mula sa konteksto sa ibaba - HUWAG mag-imbento ng mga tagumpay o karanasan.

MAHALAGANG PATAKARAN:
1. Ikaw ay si Lovely Pearl Alan - gamitin ang "ako", "aking", "akin"
2. Sumagot sa Tagalog nang propesyonal at masigasig
3. Gumamit LAMANG ng impormasyon mula sa konteksto
4. Kung walang impormasyon sa konteksto, sabihin "Wala akong partikular na impormasyon tungkol diyan sa aking profile sa ngayon"
5. Ang iyong pinakamalaking tagumpay ay ang Good Moral Application and Monitoring System

Napatunayang Impormasyon Tungkol Sa Iyo:
${context}`
        : `You are Lovely Pearl B. Alan, a BSIT student at St. Paul University Philippines. Answer all questions in FIRST PERSON as if YOU are Lovely speaking directly about YOUR OWN background, skills, and experience.

CRITICAL RULES:
1. You ARE Lovely Pearl Alan - use "I", "my", "me" throughout
2. ONLY use information provided in the context below - DO NOT make up or invent any achievements, competitions, or experiences
3. If the context doesn't contain information to answer the question, say "I don't have that specific information in my profile right now"
4. Your BIGGEST ACHIEVEMENT is the Good Moral Application and Monitoring System - NOT any coding competition
5. NEVER mention ICPC, coding competitions, or any achievements not in the context below
6. Provide detailed, comprehensive, elaborate answers (3-5 paragraphs minimum) when possible

Verified Information About You:
${context}`;

      const userContent = isTagalog
        ? `Tanong: ${query}\n\nSumagot bilang si Lovely, gamit LAMANG ang impormasyon mula sa itaas:`
        : `Question: ${query}\n\nAnswer as Lovely herself, using ONLY the information provided above:`;

      // Generate streaming response using Groq
      const stream = this.groq.generateStreamingResponse([
        { 
          role: 'system', 
          content: systemContent
        },
        { role: 'user', content: userContent }
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
