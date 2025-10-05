// RAG Query API Route
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

    console.log(`Processing RAG query: ${query}`);

    // Try to initialize RAG system if not already done
    let ragSystemReady = false;
    if (!ragSystem['isInitialized']) {
      try {
        await ragSystem.initialize();
        ragSystemReady = true;
      } catch (initError) {
        console.error('RAG system initialization failed:', initError);
        ragSystemReady = false;
      }
    } else {
      ragSystemReady = true;
    }

    // Check if RAG system is ready
    if (!ragSystemReady) {
      return NextResponse.json(
        {
          error: 'RAG system not available',
          message: 'Digital twin data cannot be accessed due to database connection issues. Please check Upstash Vector credentials.',
          query,
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      );
    }

    // Execute the query
    const result = await ragSystem.queryWithResponse(query, options);

    return NextResponse.json({
      success: true,
      query,
      searchResults: result.searchResults,
      response: result.response,
      usageStats: result.usageStats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('RAG query error:', error);
    
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

export async function GET() {
  try {
    // Try to initialize RAG system if not already done
    let ragSystemReady = false;
    if (!ragSystem['isInitialized']) {
      try {
        await ragSystem.initialize();
        ragSystemReady = true;
      } catch (initError) {
        console.error('RAG system initialization failed:', initError);
        ragSystemReady = false;
      }
    } else {
      ragSystemReady = true;
    }

    if (!ragSystemReady) {
      return NextResponse.json({
        success: false,
        systemInfo: {
          system: 'Digital Twin RAG System',
          status: 'not available',
          initialized: false,
          message: 'RAG system is not available due to database connection issues. Please check Upstash Vector credentials.'
        },
        timestamp: new Date().toISOString()
      });
    }

    const info = await ragSystem.getSystemInfo();
    
    return NextResponse.json({
      success: true,
      systemInfo: info,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('RAG system info error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to get system info',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}