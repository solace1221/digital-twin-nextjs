'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SearchResult {
  content: string;
  score: number;
  metadata?: {
    section?: string;
    type?: string;
    index?: number;
  };
}

interface QueryResponse {
  query: string;
  response: string;
  searchResults: SearchResult[];
  usageStats?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    cost: number;
  };
}

interface StreamEvent {
  type: 'metadata' | 'searchResults' | 'chunk' | 'complete' | 'error';
  query?: string;
  searchResultsCount?: number;
  results?: SearchResult[];
  content?: string;
  message?: string;
  timestamp?: string;
}

export default function DigitalTwinInterface() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [useLocalRAG, setUseLocalRAG] = useState(true); // Default to local RAG

  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (streamingTextRef.current) {
      streamingTextRef.current.scrollTop = streamingTextRef.current.scrollHeight;
    }
  }, [streamingResponse]);

  const loadSystemInfo = async () => {
    try {
      const endpoint = useLocalRAG ? '/api/rag-local' : '/api/rag';
      const res = await fetch(endpoint);
      const data = await res.json();
      if (data.success) {
        setSystemInfo(data.systemInfo);
      }
    } catch (error) {
      console.error('Failed to load system info:', error);
    }
  };

  useEffect(() => {
    loadSystemInfo();
  }, [useLocalRAG]);

  const handleQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const endpoint = useLocalRAG ? '/api/rag-local' : '/api/rag';
      const res = await fetch(endpoint, {
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

      if (!res.ok) {
        // Handle specific error cases more gracefully
        if (res.status === 503) {
          throw new Error(data.message || 'Service temporarily unavailable. Please try using Local RAG mode or check your credentials.');
        }
        throw new Error(data.message || 'Failed to process query');
      }

      // Check if the response indicates an error even with 200 status
      if (data.error || data.success === false) {
        throw new Error(data.message || data.error || 'Query processing failed');
      }

      setResponse(data);
    } catch (error) {
      console.error('Query error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleStreamingQuery = async () => {
    if (!query.trim()) return;

    setStreaming(true);
    setError(null);
    setStreamingResponse('');
    setSearchResults([]);

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const endpoint = useLocalRAG ? '/api/rag-local/stream' : '/api/rag/stream';
      const res = await fetch(endpoint, {
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
        signal: abortControllerRef.current.signal
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to start streaming');
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const eventData: StreamEvent = JSON.parse(line.slice(6));
              
              switch (eventData.type) {
                case 'metadata':
                  console.log('Stream started for query:', eventData.query);
                  break;
                case 'searchResults':
                  if (eventData.results) {
                    setSearchResults(eventData.results);
                  }
                  break;
                case 'chunk':
                  if (eventData.content) {
                    setStreamingResponse(prev => prev + eventData.content);
                  }
                  break;
                case 'complete':
                  console.log('Streaming complete');
                  break;
                case 'error':
                  throw new Error(eventData.message || 'Streaming error');
              }
            } catch (parseError) {
              console.warn('Failed to parse event:', line, parseError);
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Streaming aborted');
      } else {
        console.error('Streaming error:', error);
        setError(error instanceof Error ? error.message : 'An error occurred during streaming');
      }
    } finally {
      setStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (streaming) {
        stopStreaming();
      } else {
        handleQuery();
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Query Input */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Query Digital Twin Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* RAG Provider Toggle */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
            <div>
              <div className="font-semibold text-white">RAG Provider</div>
              <div className="text-sm text-gray-300">
                {useLocalRAG ? 'Local embeddings (works offline)' : 'Upstash Vector (cloud)'}
              </div>
            </div>
            <Button
              onClick={() => setUseLocalRAG(!useLocalRAG)}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {useLocalRAG ? 'Switch to Upstash' : 'Switch to Local'}
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Ask about professional background, skills, experience..."
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-white/5 border-white/20 text-white placeholder-white/60"
              disabled={loading || streaming}
            />
            <Button 
              onClick={handleQuery}
              disabled={loading || streaming || !query.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Processing...' : 'Query'}
            </Button>
            <Button 
              onClick={streaming ? stopStreaming : handleStreamingQuery}
              disabled={loading || !query.trim()}
              variant={streaming ? 'destructive' : 'secondary'}
              className={streaming ? '' : 'bg-green-600 hover:bg-green-700'}
            >
              {streaming ? 'Stop' : 'Stream'}
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response Display */}
      {(response || streamingResponse || searchResults.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Response */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">
                {streaming ? 'Streaming Response' : 'Response'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div 
                  ref={streamingTextRef}
                  className="text-gray-200 whitespace-pre-wrap text-sm leading-relaxed"
                >
                  {streaming ? streamingResponse : response?.response}
                  {streaming && <span className="animate-pulse">▋</span>}
                </div>
              </ScrollArea>
              
              {response?.usageStats && (
                <div className="mt-4 p-3 bg-white/5 rounded text-xs text-gray-300">
                  <div className="grid grid-cols-2 gap-2">
                    <div>Prompt Tokens: {response.usageStats.promptTokens}</div>
                    <div>Completion Tokens: {response.usageStats.completionTokens}</div>
                    <div>Total Tokens: {response.usageStats.totalTokens}</div>
                    <div>Estimated Cost: ${response.usageStats.cost.toFixed(6)}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Search Results */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">
                Search Results ({(response?.searchResults || searchResults).length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {(response?.searchResults || searchResults).map((result, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-white/5 rounded border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          Score: {result.score.toFixed(3)}
                        </Badge>
                        {result.metadata?.section && (
                          <Badge variant="outline" className="text-xs text-gray-300">
                            {result.metadata.section}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-300 line-clamp-4">
                        {result.content}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Information */}
      {systemInfo && (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
              <div className="space-y-2">
                <div className="font-semibold text-white">RAG Provider</div>
                <div>{useLocalRAG ? 'Local' : 'Upstash Vector'} ({systemInfo.provider || 'unknown'})</div>
                <div>Initialized: {systemInfo.isInitialized ? '✅' : '❌'}</div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-white">Vector Database</div>
                {useLocalRAG ? (
                  <>
                    <div>Embeddings: {systemInfo.embeddingsCount || 0}</div>
                    <div>Storage: In-Memory</div>
                  </>
                ) : (
                  <>
                    <div>Dimension: {systemInfo.vectorInfo?.dimension || 'N/A'}</div>
                    <div>Total Vectors: {systemInfo.vectorInfo?.totalVectorCount || 'N/A'}</div>
                  </>
                )}</div>
              <div className="space-y-2">
                <div className="font-semibold text-white">Usage Stats</div>
                <div>Total Tokens: {systemInfo.usageStats?.totalTokens || 0}</div>
                <div>Total Cost: ${(systemInfo.usageStats?.cost || 0).toFixed(6)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}