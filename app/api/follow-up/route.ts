// Follow-up Question Generation API Route
import { NextRequest, NextResponse } from 'next/server';
import { UpstashRAGSystem } from '@/lib/upstash-rag-system';
import { LocalRAGSystem } from '@/lib/local-rag-system';

// Prevent prerendering - this route needs runtime environment
export const dynamic = 'force-dynamic';

// Try Upstash first, fallback to Local
let ragSystem: UpstashRAGSystem | LocalRAGSystem | null = null;
let ragProvider: 'upstash' | 'local' = 'upstash';

async function getRAGSystem() {
  if (ragSystem) return ragSystem;

  // Try Upstash first
  if (process.env.UPSTASH_VECTOR_REST_URL && process.env.UPSTASH_VECTOR_REST_TOKEN) {
    try {
      const upstashSystem = new UpstashRAGSystem();
      await upstashSystem.initialize();
      ragSystem = upstashSystem;
      ragProvider = 'upstash';
      console.log('[Follow-Up API] Using Upstash RAG system');
      return ragSystem;
    } catch (error) {
      console.error('[Follow-Up API] Upstash initialization failed:', error);
    }
  }

  // Fallback to Local RAG
  try {
    const localSystem = new LocalRAGSystem();
    await localSystem.initialize();
    ragSystem = localSystem;
    ragProvider = 'local';
    console.log('[Follow-Up API] Using Local RAG system');
    return ragSystem;
  } catch (error) {
    console.error('[Follow-Up API] Local RAG initialization failed:', error);
    throw new Error('No RAG system available');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userMessage, 
      conversationHistory = [],
      scenario 
    } = body;

    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json(
        { error: 'userMessage is required and must be a string' },
        { status: 400 }
      );
    }

    console.log(`[Follow-Up API] Generating follow-up for: "${userMessage.substring(0, 50)}..."`);

    const system = await getRAGSystem();
    
    const followUpQuestion = await system.generateFollowUpQuestion(
      userMessage,
      {
        conversationHistory,
        scenario: scenario as any
      }
    );

    return NextResponse.json({
      success: true,
      followUpQuestion,
      provider: ragProvider,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Follow-Up API] Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate follow-up question',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Generate initial follow-up for a topic
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');

    if (!topic) {
      return NextResponse.json(
        { error: 'topic query parameter is required' },
        { status: 400 }
      );
    }

    console.log(`[Follow-Up API] Generating initial follow-up for topic: "${topic}"`);

    const system = await getRAGSystem();
    
    const followUpQuestion = await system.generateInitialFollowUp(topic);

    return NextResponse.json({
      success: true,
      topic,
      followUpQuestion,
      provider: ragProvider,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Follow-Up API] Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate initial follow-up',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
