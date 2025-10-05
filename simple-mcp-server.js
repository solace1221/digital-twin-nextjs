#!/usr/bin/env node
/**
 * Simple HTTP MCP Server for Digital Twin
 * Provides basic MCP functionality via HTTP for testing with mcp-remote
 */

const http = require('http');
const { readFileSync } = require('fs');
const path = require('path');

// Simple in-memory digital twin data (fallback when vector DB isn't available)
const DIGITAL_TWIN_DATA = {
  personal: {
    name: "Lovely Pearl B. Alan",
    title: "BSIT Student – Web & App Development | Aspiring Data Analyst",
    university: "St. Paul University Philippines",
    status: "President's Lister (academic excellence)",
    email: "lovelyalann@gmail.com",
    location: "Philippines"
  },
  skills: {
    programming: ["C++", "JavaScript", "Laravel", "HTML", "CSS"],
    database: ["SQL", "Database Management", "Database Design"],
    certifications: ["Cisco C++ Certification", "Cisco JavaScript Certification"],
    tools: ["Git", "Visual Studio Code", "Database Management Systems"]
  },
  leadership: {
    current: "President of Junior Philippine Computer Society",
    previous: "Executive Secretary of Student Government",
    achievements: ["Academic Excellence (President's Lister)", "Leadership Experience"]
  },
  projects: [
    {
      name: "Good Moral Application and Monitoring System with Decision Support",
      technology: "Laravel/SQL",
      description: "Full-stack web application with database integration and decision support features"
    }
  ],
  goals: {
    career: "Data Analyst or Software Engineer",
    immediate: "Seeking internship opportunities to gain practical experience",
    learning: "Expanding knowledge in data analysis, machine learning, and advanced programming"
  }
};

class SimpleMCPServer {
  constructor(port = 3000) {
    this.port = port;
    this.server = null;
  }

  // Search digital twin data
  searchProfile(query, topK = 5) {
    const queryLower = query.toLowerCase();
    const results = [];

    // Search through all data sections
    Object.entries(DIGITAL_TWIN_DATA).forEach(([section, data]) => {
      const searchText = JSON.stringify(data).toLowerCase();
      if (searchText.includes(queryLower)) {
        results.push({
          section,
          content: this.formatSectionContent(section, data),
          score: Math.random() * 0.5 + 0.5, // Simple scoring
          metadata: { section, type: 'profile_data' }
        });
      }
    });

    return results.slice(0, topK);
  }

  formatSectionContent(section, data) {
    switch (section) {
      case 'personal':
        return `${data.name} - ${data.title} at ${data.university}. ${data.status}. Contact: ${data.email}`;
      case 'skills':
        return `Programming: ${data.programming.join(', ')}. Database: ${data.database.join(', ')}. Certifications: ${data.certifications.join(', ')}.`;
      case 'leadership':
        return `Currently ${data.current}. Previously ${data.previous}. Achievements: ${data.achievements.join(', ')}.`;
      case 'projects':
        return data.map(p => `${p.name} (${p.technology}): ${p.description}`).join('. ');
      case 'goals':
        return `Career goal: ${data.career}. Currently: ${data.immediate}. Learning: ${data.learning}.`;
      default:
        return JSON.stringify(data);
    }
  }

  // Generate response using simple template
  generateResponse(query, context) {
    const systemPrompt = `You are Lovely Pearl B. Alan, a BSIT student and aspiring data analyst. Answer in first person based on this context:

${context}

Respond professionally and enthusiastically about your qualifications.`;

    // Simple response generation (without LLM)
    const responses = {
      'skills': `I'm skilled in C++ and JavaScript (both Cisco certified), Laravel for web development, and database management. I'm particularly passionate about data analysis and am working towards becoming a Data Analyst or Software Engineer.`,
      'education': `I'm currently a BSIT student majoring in Web & App Development at St. Paul University Philippines. I'm proud to be a President's Lister, which recognizes academic excellence.`,
      'leadership': `I serve as President of the Junior Philippine Computer Society and previously was Executive Secretary of the Student Government. These roles have given me valuable leadership experience.`,
      'projects': `I developed a Good Moral Application and Monitoring System with Decision Support using Laravel and SQL. It's a full-stack application with database integration and decision support features.`,
      'goals': `My career goal is to become a Data Analyst or Software Engineer. I'm actively seeking internship opportunities to gain practical experience and am continuously learning about data analysis and machine learning.`,
      'contact': `You can reach me at lovelyalann@gmail.com. I'm based in the Philippines and always open to discussing opportunities in data analysis or software development.`
    };

    // Find best matching response
    const queryLower = query.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (queryLower.includes(key)) {
        return response;
      }
    }

    // Default response
    return `Hi! I'm Lovely Pearl B. Alan, a BSIT student at St. Paul University Philippines, majoring in Web & App Development. I'm a President's Lister and aspiring Data Analyst with experience in C++, JavaScript, Laravel, and database management. I'd be happy to tell you more about my background, skills, or career goals!`;
  }

  // Handle MCP requests
  handleMCPRequest(body) {
    const { method, params } = body;

    switch (method) {
      case 'initialize':
        return {
          capabilities: {
            tools: {},
            prompts: {},
            resources: {}
          },
          serverInfo: {
            name: 'Digital Twin MCP Server',
            version: '1.0.0'
          }
        };

      case 'tools/list':
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
                  }
                },
                required: ['query']
              }
            },
            {
              name: 'chat_with_digital_twin',
              description: 'Chat with the digital twin about professional background',
              inputSchema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    description: 'Message to send to the digital twin'
                  }
                },
                required: ['message']
              }
            }
          ]
        };

      case 'tools/call':
        return this.handleToolCall(params.name, params.arguments);

      default:
        if (method.startsWith('notifications/')) {
          // Notifications don't require responses
          return null;
        }
        throw new Error(`Unsupported method: ${method}`);
    }
  }

  handleToolCall(name, args) {
    try {
      switch (name) {
        case 'query_profile': {
          const { query, topK = 5 } = args;
          const results = this.searchProfile(query, topK);
          
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

        case 'chat_with_digital_twin': {
          const { message } = args;
          const searchResults = this.searchProfile(message, 3);
          const context = searchResults.map(r => r.content).join('\n\n');
          const response = this.generateResponse(message, context);
          
          return {
            content: [
              {
                type: 'text',
                text: response
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
            text: `Error: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }

  // HTTP request handler
  handleRequest(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // Handle GET request (health check)
    if (req.method === 'GET') {
      const response = {
        name: 'Digital Twin MCP Server',
        version: '1.0.0',
        status: 'active',
        capabilities: ['tools', 'prompts', 'resources'],
        timestamp: new Date().toISOString()
      };
      res.writeHead(200);
      res.end(JSON.stringify(response, null, 2));
      return;
    }

    // Handle POST request (MCP calls)
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          console.log('MCP request:', jsonBody);

          const result = this.handleMCPRequest(jsonBody);
          
          if (result === null) {
            // Notification - no response needed
            res.writeHead(204);
            res.end();
            return;
          }

          const response = {
            jsonrpc: '2.0',
            id: jsonBody.id || null,
            result
          };

          res.writeHead(200);
          res.end(JSON.stringify(response, null, 2));
        } catch (error) {
          console.error('MCP error:', error);
          const errorResponse = {
            jsonrpc: '2.0',
            id: body ? JSON.parse(body).id || null : null,
            error: {
              code: -32603,
              message: error.message
            }
          };
          res.writeHead(500);
          res.end(JSON.stringify(errorResponse, null, 2));
        }
      });
      return;
    }

    // Method not allowed
    res.writeHead(405);
    res.end('Method not allowed');
  }

  // Start the server
  start() {
    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    this.server.listen(this.port, 'localhost', () => {
      console.log(`Digital Twin MCP Server running on http://localhost:${this.port}`);
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('Shutting down server...');
      this.server.close(() => {
        process.exit(0);
      });
    });
  }
}

// Start the server
const server = new SimpleMCPServer(8080);
server.start();