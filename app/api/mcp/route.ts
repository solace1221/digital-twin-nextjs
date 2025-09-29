// MCP Server API Route - Simplified Implementation
import { NextRequest, NextResponse } from 'next/server';
import { RAGSystem } from '@/lib/rag-system';

// Global RAG system instance
const ragSystem = new RAGSystem();

// MCP Server implementation
class DigitalTwinMCPServer {
  async handleToolsList() {
    return {
      tools: [
        {
          name: 'query_profile',
          description: 'Query the digital twin professional profile using semantic search',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'The query to search for in the profile'
              },
              topK: {
                type: 'number',
                description: 'Number of top results to return (default: 5)',
                default: 5
              },
              temperature: {
                type: 'number',
                description: 'LLM temperature for response generation (default: 0.7)',
                default: 0.7
              }
            },
            required: ['query']
          }
        },
        {
          name: 'get_system_info',
          description: 'Get information about the RAG system status and usage',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'search_profile',
          description: 'Search the profile without generating a response',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'The search query'
              },
              topK: {
                type: 'number',
                description: 'Number of results to return',
                default: 5
              }
            },
            required: ['query']
          }
        }
      ]
    };
  }

  async handleToolCall(name: string, args: any) {
    try {
      // Initialize RAG system if needed
      if (!ragSystem['isInitialized']) {
        await ragSystem.initialize();
      }

      switch (name) {
        case 'query_profile': {
          const { query, topK = 5, temperature = 0.7 } = args;
          const result = await ragSystem.queryWithResponse(query, {
            topK,
            temperature
          });
          
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  query,
                  response: result.response,
                  searchResults: result.searchResults,
                  usageStats: result.usageStats
                }, null, 2)
              }
            ]
          };
        }

        case 'search_profile': {
          const { query, topK = 5 } = args;
          const results = await ragSystem.search(query, { topK });
          
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  query,
                  results: results.map(r => ({
                    content: r.content,
                    score: r.score,
                    section: r.metadata?.section
                  }))
                }, null, 2)
              }
            ]
          };
        }

        case 'get_system_info': {
          const info = await ragSystem.getSystemInfo();
          
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(info, null, 2)
              }
            ]
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        ],
        isError: true
      };
    }
  }

  async handlePromptsList() {
    return {
      prompts: [
        {
          name: 'professional_summary',
          description: 'Get a comprehensive professional summary',
          arguments: []
        },
        {
          name: 'skills_expertise',
          description: 'Query about skills and technical expertise',
          arguments: [
            {
              name: 'domain',
              description: 'Specific domain or technology to focus on',
              required: false
            }
          ]
        },
        {
          name: 'experience_projects',
          description: 'Query about work experience and projects',
          arguments: [
            {
              name: 'industry',
              description: 'Specific industry or type of project',
              required: false
            }
          ]
        }
      ]
    };
  }

  async handlePromptsGet(name: string, args?: any) {
    const basePrompts: Record<string, string> = {
      professional_summary: 'Please provide a comprehensive professional summary including background, expertise, and career highlights.',
      skills_expertise: args?.domain 
        ? `What are the key skills and expertise in ${args.domain}?`
        : 'What are the main technical skills and areas of expertise?',
      experience_projects: args?.industry
        ? `Describe relevant work experience and projects in ${args.industry}.`
        : 'Describe key work experience and notable projects.'
    };

    const prompt = basePrompts[name];
    if (!prompt) {
      throw new Error(`Unknown prompt: ${name}`);
    }

    return {
      description: `Generated prompt for ${name}`,
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: prompt
          }
        }
      ]
    };
  }

  async handleResourcesList() {
    return {
      resources: [
        {
          uri: 'profile://personal-info',
          name: 'Personal Information',
          description: 'Basic personal and contact information',
          mimeType: 'application/json'
        },
        {
          uri: 'profile://professional-summary',
          name: 'Professional Summary',
          description: 'Professional background and summary',
          mimeType: 'text/plain'
        },
        {
          uri: 'profile://skills',
          name: 'Technical Skills',
          description: 'Technical skills and expertise areas',
          mimeType: 'application/json'
        },
        {
          uri: 'profile://experience',
          name: 'Work Experience',
          description: 'Professional work experience and history',
          mimeType: 'application/json'
        }
      ]
    };
  }

  async handleResourcesRead(uri: string) {
    const resourceQueries: Record<string, string> = {
      'profile://personal-info': 'personal information contact details',
      'profile://professional-summary': 'professional summary background career',
      'profile://skills': 'technical skills programming languages frameworks',
      'profile://experience': 'work experience projects employment history'
    };

    const query = resourceQueries[uri];
    if (!query) {
      throw new Error(`Unknown resource: ${uri}`);
    }

    try {
      if (!ragSystem['isInitialized']) {
        await ragSystem.initialize();
      }

      const results = await ragSystem.search(query, { topK: 10 });
      const content = results.map(r => r.content).join('\n\n');

      return {
        contents: [
          {
            uri,
            mimeType: 'text/plain',
            text: content
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to read resource ${uri}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export the MCP server for use in API routes and standalone execution
export const mcpServer = new DigitalTwinMCPServer();

// API route handlers
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('MCP request received:', body);

    const { method, params } = body;

    let result;
    switch (method) {
      case 'tools/list':
        result = await mcpServer.handleToolsList();
        break;
      case 'tools/call':
        result = await mcpServer.handleToolCall(params.name, params.arguments);
        break;
      case 'prompts/list':
        result = await mcpServer.handlePromptsList();
        break;
      case 'prompts/get':
        result = await mcpServer.handlePromptsGet(params.name, params.arguments);
        break;
      case 'resources/list':
        result = await mcpServer.handleResourcesList();
        break;
      case 'resources/read':
        result = await mcpServer.handleResourcesRead(params.uri);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return NextResponse.json({
      jsonrpc: '2.0',
      id: body.id || null,
      result
    });
  } catch (error) {
    console.error('MCP error:', error);
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'Digital Twin MCP Server',
    version: '1.0.0',
    status: 'active',
    capabilities: ['tools', 'prompts', 'resources'],
    timestamp: new Date().toISOString()
  });
}