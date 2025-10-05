// Test script for MCP tools with improved error handling

const testMCPTool = async (toolName, args = {}) => {
  const payload = {
    jsonrpc: "2.0",
    id: Math.floor(Math.random() * 1000),
    method: "tools/call",
    params: {
      name: toolName,
      arguments: args
    }
  };

  try {
    console.log(`\n🧪 Testing tool: ${toolName}`);
    console.log(`📤 Request:`, JSON.stringify(payload, null, 2));
    
    const response = await fetch('http://localhost:3002/api/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    console.log(`📥 Response Status: ${response.status}`);
    
    try {
      const data = JSON.parse(responseText);
      console.log(`✅ JSON Response:`, JSON.stringify(data, null, 2));
      return data;
    } catch (parseError) {
      console.log(`❌ JSON Parse Error:`, parseError.message);
      console.log(`📄 Raw Response:`, responseText.substring(0, 500) + '...');
      return null;
    }
  } catch (error) {
    console.log(`🔴 Network Error:`, error.message);
    return null;
  }
};

const runTests = async () => {
  console.log('🚀 Starting MCP Tool Tests...\n');
  
  // Test 1: Get System Info (should work even without Upstash)
  await testMCPTool('get_system_info');
  
  // Test 2: Search Profile (should return graceful error due to Upstash issue)
  await testMCPTool('search_profile', {
    query: 'software engineering experience',
    topK: 3
  });
  
  // Test 3: Query Profile (should return graceful error due to Upstash issue)
  await testMCPTool('query_profile', {
    query: 'Tell me about programming skills',
    topK: 5,
    temperature: 0.7
  });
  
  console.log('\n✨ Test suite completed!');
};

// Run the tests
runTests().catch(console.error);