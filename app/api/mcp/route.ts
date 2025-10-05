import { NextRequest, NextResponse } from 'next/server';
import { RAGSystem } from '@/lib/rag-system';
import { LocalRAGSystem } from '@/lib/local-rag-system';
import fs from 'fs';
import path from 'path';

// Initialize RAG system
let ragSystem: RAGSystem | LocalRAGSystem;
let ragInitialized = false;

async function initializeRAG() {
  if (!ragInitialized) {
    try {
      // Try Upstash first
      ragSystem = new RAGSystem();
      await ragSystem.initialize();
      console.log('MCP: RAG system initialized with Upstash');
    } catch (error) {
      console.warn('MCP: Upstash failed, using local RAG', error);
      ragSystem = new LocalRAGSystem();
      await ragSystem.initialize();
    }
    ragInitialized = true;
  }
  return ragSystem;
}

// MCP Protocol Handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle JSON-RPC 2.0 protocol
    const { jsonrpc, id, method, params } = body;

    if (jsonrpc !== '2.0') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id: id || null,
        error: {
          code: -32600,
          message: 'Invalid Request: jsonrpc must be "2.0"'
        }
      }, { status: 400 });
    }

    // Handle different MCP methods
    switch (method) {
      case 'initialize': {
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {
                listChanged: false
              },
              resources: {
                subscribe: false,
                listChanged: false
              }
            },
            serverInfo: {
              name: 'digital-twin-mcp',
              version: '1.0.0'
            }
          }
        });
      }

      case 'notifications/initialized': {
        // Client confirms initialization is complete
        // No response needed for notifications
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: null
        });
      }

      case 'tools/list': {
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            tools: [
              {
                name: 'query_profile',
                description: 'Search Lovely Pearl Alan\'s professional profile using semantic search. Returns relevant information about her background, skills, education, experience, and career goals.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    query: {
                      type: 'string',
                      description: 'The question or topic to search for in the profile (e.g., "What are her technical skills?", "Tell me about her education", "What projects has she worked on?")'
                    },
                    topK: {
                      type: 'number',
                      description: 'Number of top results to return (default: 5)',
                      default: 5
                    }
                  },
                  required: ['query']
                }
              },
              {
                name: 'chat_with_digital_twin',
                description: 'Have a conversation with Lovely Pearl Alan\'s AI digital twin. Get personalized responses as if speaking directly with Lovely about her background, skills, and career aspirations.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      description: 'Your message or question to Lovely Pearl Alan'
                    }
                  },
                  required: ['message']
                }
              },
              {
                name: 'get_system_info',
                description: 'Get information about the digital twin system status, including RAG system details and available data.',
                inputSchema: {
                  type: 'object',
                  properties: {},
                  required: []
                }
              }
            ]
          }
        });
      }

      case 'tools/call': {
        const { name: toolName, arguments: toolArgs } = params || {};
        
        if (!toolName) {
          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            error: {
              code: -32602,
              message: 'Invalid params: tool name is required'
            }
          }, { status: 400 });
        }

        // Initialize RAG system
        const rag = await initializeRAG();

        switch (toolName) {
          case 'query_profile': {
            const { query, topK = 5 } = toolArgs || {};
            if (!query) {
              return NextResponse.json({
                jsonrpc: '2.0',
                id,
                error: {
                  code: -32602,
                  message: 'Invalid params: query is required'
                }
              }, { status: 400 });
            }

            const results = await rag.search(query, topK);
            
            return NextResponse.json({
              jsonrpc: '2.0',
              id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify(results, null, 2)
                  }
                ]
              }
            });
          }

          case 'chat_with_digital_twin': {
            const { message } = toolArgs || {};
            if (!message) {
              return NextResponse.json({
                jsonrpc: '2.0',
                id,
                error: {
                  code: -32602,
                  message: 'Invalid params: message is required'
                }
              }, { status: 400 });
            }

            const response = await rag.queryWithResponse(message);
            
            return NextResponse.json({
              jsonrpc: '2.0',
              id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: response.response
                  }
                ]
              }
            });
          }

          case 'get_system_info': {
            const info = {
              system: 'Digital Twin RAG System',
              subject: 'Lovely Pearl B. Alan',
              status: 'operational',
              ragInitialized,
              ragType: ragSystem instanceof RAGSystem ? 'Upstash Vector' : 'Local',
              timestamp: new Date().toISOString()
            };
            
            return NextResponse.json({
              jsonrpc: '2.0',
              id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify(info, null, 2)
                  }
                ]
              }
            });
          }

          default:
            return NextResponse.json({
              jsonrpc: '2.0',
              id,
              error: {
                code: -32601,
                message: `Method not found: ${toolName}`
              }
            }, { status: 404 });
        }
      }

      case 'resources/list': {
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            resources: [
              {
                uri: 'digitaltwin://profile',
                name: 'Lovely Pearl Alan Professional Profile',
                description: 'Complete professional profile including education, skills, experience, projects, and career goals',
                mimeType: 'application/json'
              }
            ]
          }
        });
      }

      case 'resources/read': {
        const { uri } = params || {};
        
        if (uri === 'digitaltwin://profile') {
          // Read the profile data
          const profilePath = path.join(process.cwd(), 'data', 'digitaltwin.json');
          const profileData = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
          
          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            result: {
              contents: [
                {
                  uri: 'digitaltwin://profile',
                  mimeType: 'application/json',
                  text: JSON.stringify(profileData, null, 2)
                }
              ]
            }
          });
        }

        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          error: {
            code: -32602,
            message: `Invalid params: resource not found: ${uri}`
          }
        }, { status: 404 });
      }

      default:
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          error: {
            code: -32601,
            message: `Method not found: ${method}`
          }
        }, { status: 404 });
    }
  } catch (error) {
    console.error('MCP API Error:', error);
    return NextResponse.json({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32603,
        message: 'Internal error',
        data: error instanceof Error ? error.message : String(error)
      }
    }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    service: 'Digital Twin MCP Server',
    status: 'operational',
    version: '1.0.0',
    endpoints: {
      initialize: 'POST with method: initialize',
      tools: 'POST with method: tools/list or tools/call',
      resources: 'POST with method: resources/list or resources/read'
    },
    timestamp: new Date().toISOString()
  });
}
