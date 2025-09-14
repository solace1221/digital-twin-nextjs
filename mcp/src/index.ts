#!/usr/bin/env node
/**
 * Digital Twin MCP Server
 * Provides AI-powered digital twin functionality via Model Context Protocol
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { Groq } from 'groq-sdk';
import { Index } from '@upstash/vector';
import { config } from 'dotenv';

// Load environment variables
config();

// Initialize clients
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const vector = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

class DigitalTwinMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'digital-twin-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'chat_with_digital_twin',
            description: 'Chat with Lovely\'s AI digital twin about her professional background',
            inputSchema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Message to send to the digital twin',
                },
                context: {
                  type: 'string',
                  description: 'Optional context for the conversation',
                },
              },
              required: ['message'],
            },
          },
          {
            name: 'query_professional_profile',
            description: 'Query specific information from professional profile',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'What to search for in the professional profile',
                },
                category: {
                  type: 'string',
                  enum: ['skills', 'experience', 'education', 'projects', 'goals'],
                  description: 'Category to focus the search on',
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'get_career_advice',
            description: 'Get personalized career advice based on profile',
            inputSchema: {
              type: 'object',
              properties: {
                topic: {
                  type: 'string',
                  description: 'Career topic to get advice about',
                },
                role: {
                  type: 'string',
                  description: 'Target role or career path',
                },
              },
              required: ['topic'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'chat_with_digital_twin':
            return await this.handleChatWithDigitalTwin(request.params.arguments);

          case 'query_professional_profile':
            return await this.handleQueryProfile(request.params.arguments);

          case 'get_career_advice':
            return await this.handleCareerAdvice(request.params.arguments);

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing tool: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });
  }

  private async handleChatWithDigitalTwin(args: any) {
    const { message, context } = args;

    // Search for relevant profile information
    const searchResults = await this.searchProfile(message);
    
    // Generate response with context
    const systemPrompt = `You are Lovely Pearl B. Alan's AI digital twin. Answer as if you are Lovely herself, speaking in first person about your background, skills, and experience.

Context from profile:
${searchResults}

Respond professionally and enthusiastically about your qualifications as a BSIT student and aspiring data analyst.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return {
      content: [
        {
          type: 'text',
          text: completion.choices[0].message.content || 'I apologize, I could not generate a response.',
        },
      ],
    };
  }

  private async handleQueryProfile(args: any) {
    const { query, category } = args;

    try {
      const results = await this.searchProfile(query, category);
      
      return {
        content: [
          {
            type: 'text',
            text: results || 'No relevant information found in the profile.',
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error searching profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
      };
    }
  }

  private async handleCareerAdvice(args: any) {
    const { topic, role } = args;

    const systemPrompt = `You are Lovely Pearl B. Alan, a BSIT student and aspiring data analyst. Provide personalized career advice based on your background and goals.

Your background:
- BSIT student majoring in Web & App Development
- President's Lister with strong academic record
- Leadership experience as JPCS President and Student Government Executive Secretary
- Technical skills: C++, JavaScript, Laravel, Database Management
- Career goal: Become a Data Analyst or Software Engineer

Provide specific, actionable advice based on your experience and aspirations.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Give me career advice about: ${topic}${role ? ` for a ${role} role` : ''}` },
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    return {
      content: [
        {
          type: 'text',
          text: completion.choices[0].message.content || 'I apologize, I could not provide advice at this time.',
        },
      ],
    };
  }

  private async searchProfile(query: string, category?: string): Promise<string> {
    try {
      // Search vector database for relevant information
      const results = await vector.query({
        data: query,
        topK: 3,
        includeMetadata: true,
      });

      if (!results || results.length === 0) {
        return 'No relevant information found.';
      }

      // Format results
      const context = results
        .map((result: any) => {
          const metadata = result.metadata || {};
          const title = metadata.title || 'Information';
          const content = metadata.content || '';
          return `${title}: ${content}`;
        })
        .join('\n\n');

      return context;
    } catch (error) {
      console.error('Vector search error:', error);
      return 'Error accessing profile information.';
    }
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Digital Twin MCP Server running on stdio');
  }
}

// Start the server
const server = new DigitalTwinMCPServer();
server.start().catch(console.error);