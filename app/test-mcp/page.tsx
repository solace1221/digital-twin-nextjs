'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MCPResponse {
  jsonrpc?: string;
  id?: number | null;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

export default function TestMCPPage() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<MCPResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('What are your technical skills?');

  const testToolsList = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tools/list',
          id: 1
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testToolCall = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: 'query_profile',
            arguments: {
              query: query.trim(),
              topK: 5,
              temperature: 0.7
            }
          },
          id: 2
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testPromptsList = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'prompts/list',
          id: 3
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testResourcesList = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'resources/list',
          id: 4
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testLocalRAG = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/rag-local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          options: {
            topK: 5,
            temperature: 0.7
          }
        }),
      });

      const data = await res.json();
      setResponse({ result: data });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            MCP Server Testing Interface
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Test the Model Context Protocol server endpoints and functionality
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Test Controls */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Test Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Query for Tool Testing
                </label>
                <Input
                  type="text"
                  placeholder="Enter your query..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder-white/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={testToolsList}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-sm"
                >
                  List Tools
                </Button>
                <Button
                  onClick={testToolCall}
                  disabled={loading || !query.trim()}
                  className="bg-green-600 hover:bg-green-700 text-sm"
                >
                  Call Tool
                </Button>
                <Button
                  onClick={testPromptsList}
                  disabled={loading}
                  className="bg-yellow-600 hover:bg-yellow-700 text-sm"
                >
                  List Prompts
                </Button>
                <Button
                  onClick={testResourcesList}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-sm"
                >
                  List Resources
                </Button>
              </div>

              <div className="border-t border-white/20 pt-4">
                <Button
                  onClick={testLocalRAG}
                  disabled={loading || !query.trim()}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  Test Local RAG (Direct)
                </Button>
              </div>

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
                  <strong>Error:</strong> {error}
                </div>
              )}

              {loading && (
                <div className="p-3 bg-blue-500/20 border border-blue-500/50 rounded text-blue-200 text-sm">
                  Testing in progress...
                </div>
              )}
            </CardContent>
          </Card>

          {/* MCP Configuration Info */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">MCP Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-300">
                <h3 className="text-white font-semibold mb-2">VS Code MCP Configuration:</h3>
                <pre className="bg-black/30 p-3 rounded text-xs overflow-auto">
{`{
  "servers": {
    "digital-twin-mcp": {
      "type": "http",
      "url": "http://localhost:3000/api/mcp"
    }
  }
}`}
                </pre>
              </div>

              <div className="text-sm text-gray-300">
                <h3 className="text-white font-semibold mb-2">Available Endpoints:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>GET /api/mcp - Server status</li>
                  <li>POST /api/mcp - MCP protocol handler</li>
                  <li>POST /api/rag-local - Local RAG queries</li>
                  <li>POST /api/rag-local/stream - Streaming responses</li>
                </ul>
              </div>

              <div className="text-sm text-gray-300">
                <h3 className="text-white font-semibold mb-2">MCP Tools:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>query_profile - Query professional profile</li>
                  <li>search_profile - Search without response</li>
                  <li>get_system_info - System information</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Response Display */}
        {response && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-black/30 p-4 rounded text-sm text-gray-200 overflow-auto max-h-96">
                {JSON.stringify(response, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* GitHub Copilot Integration Instructions */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-8">
          <CardHeader>
            <CardTitle className="text-white">GitHub Copilot Integration</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2">Setup Instructions:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Ensure VS Code Insiders is running with GitHub Copilot extension</li>
                <li>The MCP configuration file is already created at <code className="bg-black/30 px-1 rounded">.vscode/mcp.json</code></li>
                <li>Start your development server with <code className="bg-black/30 px-1 rounded">pnpm dev</code></li>
                <li>Open a file in VS Code and ask Copilot: <em>"What are your technical skills?"</em></li>
                <li>Copilot should use the MCP server to query your digital twin profile</li>
              </ol>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Test Queries for Copilot:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>"What is your professional background?"</li>
                <li>"Tell me about your programming skills and experience"</li>
                <li>"What projects have you worked on?"</li>
                <li>"What are your main areas of expertise?"</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}