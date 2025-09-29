// Upstash Vector Database Client
import { Index } from '@upstash/vector';

export interface VectorSearchResult {
  id: string;
  score: number;
  metadata?: Record<string, any>;
  values?: number[];
}

export interface EmbeddingResult {
  embedding: number[];
  text: string;
}

export class UpstashVectorClient {
  private index: Index;
  
  constructor() {
    this.index = new Index({
      url: process.env.UPSTASH_VECTOR_REST_URL!,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
    });
  }

  async upsertVector(
    id: string,
    embedding: number[],
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      await this.index.upsert({
        id,
        vector: embedding,
        metadata
      });
    } catch (error) {
      console.error('Error upserting vector:', error);
      throw new Error(`Upstash upsert error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async batchUpsert(
    vectors: Array<{
      id: string;
      embedding: number[];
      metadata?: Record<string, any>;
    }>
  ): Promise<void> {
    try {
      const upsertData = vectors.map(v => ({
        id: v.id,
        vector: v.embedding,
        metadata: v.metadata
      }));

      await this.index.upsert(upsertData);
    } catch (error) {
      console.error('Error batch upserting vectors:', error);
      throw new Error(`Upstash batch upsert error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async searchSimilar(
    queryEmbedding: number[],
    topK: number = 5,
    includeMetadata: boolean = true
  ): Promise<VectorSearchResult[]> {
    try {
      const results = await this.index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata
      });

      return results.map(result => ({
        id: result.id.toString(),
        score: result.score || 0,
        metadata: result.metadata,
        values: result.vector
      }));
    } catch (error) {
      console.error('Error searching vectors:', error);
      throw new Error(`Upstash search error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteVector(id: string): Promise<void> {
    try {
      await this.index.delete(id);
    } catch (error) {
      console.error('Error deleting vector:', error);
      throw new Error(`Upstash delete error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getVectorInfo(): Promise<any> {
    try {
      return await this.index.info();
    } catch (error) {
      console.error('Error getting vector info:', error);
      throw new Error(`Upstash info error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async reset(): Promise<void> {
    try {
      await this.index.reset();
    } catch (error) {
      console.error('Error resetting index:', error);
      throw new Error(`Upstash reset error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}