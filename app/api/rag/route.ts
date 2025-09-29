// RAG Query API Route
import { NextRequest, NextResponse } from 'next/server';
import { RAGSystem } from '@/lib/rag-system';

const ragSystem = new RAGSystem();

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

    // Initialize RAG system if not already done
    if (!ragSystem['isInitialized']) {
      await ragSystem.initialize();
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