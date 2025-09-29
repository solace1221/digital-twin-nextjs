// Local RAG Query API Route (fallback when Upstash is not available)
import { NextRequest, NextResponse } from 'next/server';
import { LocalRAGSystem } from '@/lib/local-rag-system';

const localRAGSystem = new LocalRAGSystem();

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

    console.log(`Processing Local RAG query: ${query}`);

    // Initialize RAG system if not already done
    if (!localRAGSystem['isInitialized']) {
      await localRAGSystem.initialize();
    }

    // Execute the query
    const result = await localRAGSystem.queryWithResponse(query, options);

    return NextResponse.json({
      success: true,
      query,
      searchResults: result.searchResults,
      response: result.response,
      usageStats: result.usageStats,
      provider: 'local',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Local RAG query error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        provider: 'local',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const info = await localRAGSystem.getSystemInfo();
    
    return NextResponse.json({
      success: true,
      systemInfo: info,
      provider: 'local',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Local RAG system info error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to get system info',
        message: error instanceof Error ? error.message : 'Unknown error',
        provider: 'local',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}