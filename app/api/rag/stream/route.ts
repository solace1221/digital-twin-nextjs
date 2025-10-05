// RAG Streaming API Route
import { NextRequest, NextResponse } from 'next/server';
import { UpstashRAGSystem } from '@/lib/upstash-rag-system';

const ragSystem = new UpstashRAGSystem();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, options = {} } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    console.log(`Processing streaming RAG query: ${query}`);

    // Initialize RAG system if not already done
    if (!ragSystem['isInitialized']) {
      await ragSystem.initialize();
    }

    // First, get the search results
    const searchResults = await ragSystem.search(query, options);

    // Create a readable stream for the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial metadata
          const metadata = {
            type: 'metadata',
            query,
            searchResultsCount: searchResults.length,
            timestamp: new Date().toISOString()
          };
          controller.enqueue(`data: ${JSON.stringify(metadata)}\n\n`);

          // Send search results
          const resultsData = {
            type: 'searchResults',
            results: searchResults
          };
          controller.enqueue(`data: ${JSON.stringify(resultsData)}\n\n`);

          // Stream the response
          const responseStream = ragSystem.generateStreamingResponse(query, searchResults, options);
          
          for await (const chunk of responseStream) {
            const chunkData = {
              type: 'chunk',
              content: chunk
            };
            controller.enqueue(`data: ${JSON.stringify(chunkData)}\n\n`);
          }

          // Send completion signal
          const completionData = {
            type: 'complete',
            timestamp: new Date().toISOString()
          };
          controller.enqueue(`data: ${JSON.stringify(completionData)}\n\n`);
          
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          const errorData = {
            type: 'error',
            message: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
          };
          controller.enqueue(`data: ${JSON.stringify(errorData)}\n\n`);
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('RAG streaming setup error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}