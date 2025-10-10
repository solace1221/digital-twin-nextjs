// Health Check API Route
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasGroqKey: !!process.env.GROQ_API_KEY,
      groqKeyLength: process.env.GROQ_API_KEY?.length || 0,
      hasUpstashUrl: !!process.env.UPSTASH_VECTOR_REST_URL,
      hasUpstashToken: !!process.env.UPSTASH_VECTOR_REST_TOKEN,
    },
    services: {
      groq: 'checking...',
      upstash: 'checking...',
    }
  };

  // Test Groq API connection
  try {
    const Groq = (await import('groq-sdk')).default;
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const testResponse = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: 'Hi' }],
      max_tokens: 5,
      temperature: 0.1
    });

    healthCheck.services.groq = testResponse.choices[0]?.message?.content ? 'connected' : 'no response';
  } catch (error: any) {
    healthCheck.services.groq = `error: ${error?.message || 'unknown'}`;
    healthCheck.status = 'degraded';
  }

  // Test Upstash Vector connection
  try {
    const { Index } = await import('@upstash/vector');
    const index = new Index({
      url: process.env.UPSTASH_VECTOR_REST_URL!,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
    });

    const info = await index.info();
    healthCheck.services.upstash = `connected (${info.vectorCount || 0} vectors)`;
  } catch (error: any) {
    healthCheck.services.upstash = `error: ${error?.message || 'unknown'}`;
    healthCheck.status = 'degraded';
  }

  return NextResponse.json(healthCheck, {
    status: healthCheck.status === 'ok' ? 200 : 503
  });
}
