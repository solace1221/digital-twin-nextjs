// RAG Query API Route
import { NextRequest, NextResponse } from 'next/server';
import { UpstashRAGSystem } from '@/lib/upstash-rag-system';

const ragSystem = new UpstashRAGSystem();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, options = {}, generateFollowUp = false, conversationHistory = [] } = body;

    if (!query || typeof query !== 'string') {
      console.error('Invalid query parameter:', { query, type: typeof query });
      return NextResponse.json(
        { 
          success: false,
          error: 'Query is required and must be a string',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    console.log(`[RAG API] Processing query: "${query}"`);
    console.log('[RAG API] Options:', { generateFollowUp, historyLength: conversationHistory.length });
    console.log('[RAG API] Environment check:', {
      hasUpstashUrl: !!process.env.UPSTASH_VECTOR_REST_URL,
      hasUpstashToken: !!process.env.UPSTASH_VECTOR_REST_TOKEN,
      hasGroqKey: !!process.env.GROQ_API_KEY
    });

    // Try to initialize RAG system if not already done
    let ragSystemReady = false;
    if (!ragSystem['isInitialized']) {
      try {
        console.log('[RAG API] Initializing RAG system...');
        await ragSystem.initialize();
        ragSystemReady = true;
        console.log('[RAG API] RAG system initialized successfully');
      } catch (initError) {
        console.error('[RAG API] RAG system initialization failed:', {
          error: initError instanceof Error ? initError.message : 'Unknown error',
          stack: initError instanceof Error ? initError.stack : undefined
        });
        ragSystemReady = false;
      }
    } else {
      ragSystemReady = true;
      console.log('[RAG API] RAG system already initialized');
    }

    // Check if RAG system is ready
    if (!ragSystemReady) {
      console.error('[RAG API] RAG system not ready, returning 503');
      return NextResponse.json(
        {
          success: false,
          error: 'RAG system not available',
          message: 'The AI knowledge base is temporarily unavailable. This might be due to database connection issues or missing environment variables. Please try again in a moment.',
          query,
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      );
    }

    // Execute the query
    console.log('[RAG API] Executing query...');
    const queryOptions = {
      ...options,
      generateFollowUp,
      conversationHistory
    };
    const result = await ragSystem.queryWithResponse(query, queryOptions);
    console.log('[RAG API] Query executed successfully:', {
      resultsCount: result.searchResults?.length || 0,
      hasResponse: !!result.response,
      hasFollowUp: !!result.followUpQuestion
    });

    return NextResponse.json({
      success: true,
      query,
      searchResults: result.searchResults,
      response: result.response,
      followUpQuestion: result.followUpQuestion,
      usageStats: result.usageStats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[RAG API] Query error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
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