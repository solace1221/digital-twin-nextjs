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

    // Try to initialize RAG system if not already done
    let ragSystemReady = false;
    if (!localRAGSystem['isInitialized']) {
      try {
        await localRAGSystem.initialize();
        ragSystemReady = true;
      } catch (initError) {
        console.error('Local RAG system initialization failed:', initError);
        ragSystemReady = false;
      }
    } else {
      ragSystemReady = true;
    }

    // Check if RAG system is ready
    if (!ragSystemReady) {
      return NextResponse.json(
        {
          error: 'Local RAG system not available',
          message: 'Local RAG system failed to initialize. Please check the digital twin data files.',
          query,
          provider: 'local',
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      );
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
    // Try to initialize RAG system if not already done
    let ragSystemReady = false;
    if (!localRAGSystem['isInitialized']) {
      try {
        await localRAGSystem.initialize();
        ragSystemReady = true;
      } catch (initError) {
        console.error('Local RAG system initialization failed:', initError);
        ragSystemReady = false;
      }
    } else {
      ragSystemReady = true;
    }

    if (!ragSystemReady) {
      return NextResponse.json({
        success: false,
        systemInfo: {
          system: 'Local Digital Twin RAG System',
          status: 'not available',
          initialized: false,
          message: 'Local RAG system failed to initialize. Please check the digital twin data files.'
        },
        provider: 'local',
        timestamp: new Date().toISOString()
      });
    }

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