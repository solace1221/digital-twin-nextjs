// Test Upstash Vector connection directly
import { Index } from '@upstash/vector';

async function testUpstashConnection() {
  console.log('Testing Upstash Vector connection...');
  console.log('URL:', process.env.UPSTASH_VECTOR_REST_URL);
  console.log('Token (first 20 chars):', process.env.UPSTASH_VECTOR_REST_TOKEN?.substring(0, 20) + '...');
  
  const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL!,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
  });

  try {
    // Try to get info about the index
    const info = await index.info();
    console.log('✅ Connection successful! Index info:', info);
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error);
    return false;
  }
}

// Test the connection
testUpstashConnection();