// Groq LLM Client with streaming support and error handling
import Groq from 'groq-sdk';

export interface StreamingOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stream?: boolean;
}

export interface UsageStats {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
}

export class GroqLLMClient {
  private groq: Groq;
  private model: string;
  private usageStats: UsageStats = {
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
    cost: 0
  };

  constructor(apiKey?: string, model: string = 'llama-3.1-8b-instant') {
    const key = apiKey || process.env.GROQ_API_KEY;
    if (!key) {
      throw new Error('GROQ_API_KEY is required but not provided');
    }
    this.groq = new Groq({
      apiKey: key
    });
    this.model = model;
    console.log('[Groq Client] Initialized with model:', model);
  }

  async generateResponse(
    messages: Array<{ role: string; content: string }>,
    options: StreamingOptions = {}
  ): Promise<string> {
    try {
      console.log('[Groq Client] Generating response with model:', this.model);
      const response = await this.groq.chat.completions.create({
        messages: messages as any,
        model: this.model,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000,
        top_p: options.topP || 0.9,
        stream: false
      });

      // Update usage stats
      if (response.usage) {
        this.usageStats.promptTokens += response.usage.prompt_tokens;
        this.usageStats.completionTokens += response.usage.completion_tokens;
        this.usageStats.totalTokens += response.usage.total_tokens;
        this.usageStats.cost += this.calculateCost(response.usage);
        console.log('[Groq Client] Response generated, tokens used:', response.usage.total_tokens);
      }

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content returned from Groq API');
      }

      return content;
    } catch (error: any) {
      console.error('[Groq Client] Error details:', {
        message: error?.message,
        status: error?.status,
        code: error?.code,
        type: error?.type
      });
      
      // Provide more specific error messages
      if (error?.status === 401) {
        throw new Error('Groq API authentication failed. Please check your API key.');
      } else if (error?.status === 429) {
        throw new Error('Groq API rate limit exceeded. Please try again in a moment.');
      } else if (error?.status === 503) {
        throw new Error('Groq API is temporarily unavailable. Please try again later.');
      }
      
      throw new Error(`Groq API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async *generateStreamingResponse(
    messages: Array<{ role: string; content: string }>,
    options: StreamingOptions = {}
  ): AsyncGenerator<string, void, unknown> {
    try {
      const stream = await this.groq.chat.completions.create({
        messages: messages as any,
        model: this.model,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000,
        top_p: options.topP || 0.9,
        stream: true
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('Error generating streaming response:', error);
      throw new Error(`Groq Streaming API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private calculateCost(usage: any): number {
    // Groq pricing (approximate)
    const inputCostPer1K = 0.00059;  // $0.59 per 1K input tokens
    const outputCostPer1K = 0.00079; // $0.79 per 1K output tokens
    
    const inputCost = (usage.prompt_tokens / 1000) * inputCostPer1K;
    const outputCost = (usage.completion_tokens / 1000) * outputCostPer1K;
    
    return inputCost + outputCost;
  }

  getUsageStats(): UsageStats {
    return { ...this.usageStats };
  }

  resetUsageStats(): void {
    this.usageStats = {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      cost: 0
    };
  }
}