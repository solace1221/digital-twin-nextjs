// Embedding Service using Groq's embedding models
import { GroqLLMClient } from './groq-client';

export interface EmbeddingOptions {
  model?: string;
  dimensions?: number;
}

export class EmbeddingService {
  private groq: GroqLLMClient;
  
  constructor() {
    this.groq = new GroqLLMClient();
  }

  /**
   * Generate embeddings using a simple text similarity approach
   * Note: This is a placeholder implementation. In production, you would use
   * a proper embedding model like sentence-transformers or OpenAI embeddings.
   */
  async generateEmbedding(
    text: string, 
    options: EmbeddingOptions = {}
  ): Promise<number[]> {
    try {
      // For now, we'll use a simple hash-based approach
      // In production, replace this with actual embedding models
      return this.simpleTextEmbedding(text, options.dimensions || 384);
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error(`Embedding generation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateBatchEmbeddings(
    texts: string[],
    options: EmbeddingOptions = {}
  ): Promise<number[][]> {
    const embeddings: number[][] = [];
    
    for (const text of texts) {
      const embedding = await this.generateEmbedding(text, options);
      embeddings.push(embedding);
    }
    
    return embeddings;
  }

  private simpleTextEmbedding(text: string, dimensions: number): number[] {
    // Simple embedding based on character frequencies and patterns
    // This is a placeholder - use proper embedding models in production
    const embedding = new Array(dimensions).fill(0);
    
    // Normalize text
    const normalizedText = text.toLowerCase().replace(/[^\w\s]/g, '');
    
    // Character frequency features
    const charFreq: Record<string, number> = {};
    for (const char of normalizedText) {
      charFreq[char] = (charFreq[char] || 0) + 1;
    }
    
    // Word features
    const words = normalizedText.split(/\s+/);
    const wordCount = words.length;
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / wordCount;
    
    // Fill embedding vector with features
    let index = 0;
    
    // Character frequency features (first 26 dimensions for a-z)
    for (let i = 0; i < 26 && index < dimensions; i++) {
      const char = String.fromCharCode(97 + i); // 'a' to 'z'
      embedding[index++] = (charFreq[char] || 0) / normalizedText.length;
    }
    
    // Text statistics features
    if (index < dimensions) {
      embedding[index++] = wordCount / 100; // Normalized word count
    }
    if (index < dimensions) {
      embedding[index++] = avgWordLength / 10; // Normalized avg word length
    }
    if (index < dimensions) {
      embedding[index++] = normalizedText.length / 1000; // Normalized text length
    }
    
    // Hash-based features for remaining dimensions
    for (let i = index; i < dimensions; i++) {
      const hashValue = this.simpleHash(text + i.toString());
      embedding[i] = (hashValue % 1000) / 1000; // Normalize to 0-1
    }
    
    // Normalize the embedding vector
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      for (let i = 0; i < embedding.length; i++) {
        embedding[i] /= magnitude;
      }
    }
    
    return embedding;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Calculate cosine similarity between two embeddings
   */
  static cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Embeddings must have the same dimension');
    }
    
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      magnitudeA += a[i] * a[i];
      magnitudeB += b[i] * b[i];
    }
    
    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);
    
    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }
    
    return dotProduct / (magnitudeA * magnitudeB);
  }
}