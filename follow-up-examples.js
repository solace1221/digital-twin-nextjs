// Follow-Up Question System - Usage Examples
// Copy-paste these examples to test the new follow-up generation feature

/**
 * EXAMPLE 1: Basic RAG Query with Follow-Up Generation
 * 
 * This automatically generates a follow-up question after Pearl's response
 */

async function example1_AutomaticFollowUp() {
  const response = await fetch('http://localhost:3002/api/rag-local', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: "What's your biggest achievement?",
      generateFollowUp: true,  // ✅ Enable automatic follow-up generation
      conversationHistory: []
    })
  });

  const data = await response.json();
  
  console.log('Pearl\'s Answer:');
  console.log(data.response);
  console.log('\nFollow-Up Question (2-3 paragraphs):');
  console.log(data.followUpQuestion);
}

/**
 * EXAMPLE 2: Handle "Tell Me More" Request
 * 
 * When user says "tell me more", system generates deeper follow-up
 */

async function example2_TellMeMore() {
  // Initial conversation
  const conversationHistory = [
    { role: 'assistant', content: 'What are your technical skills?' },
    { role: 'user', content: 'I specialize in Laravel and MySQL database development' },
    { role: 'assistant', content: 'I work with Laravel and MySQL extensively...' }
  ];

  // User wants more details
  const response = await fetch('http://localhost:3002/api/follow-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userMessage: "Tell me more about that project",
      conversationHistory
    })
  });

  const data = await response.json();
  
  console.log('Follow-Up Question:');
  console.log(data.followUpQuestion);
  // Expected: Multi-paragraph question diving deeper into the project
}

/**
 * EXAMPLE 3: Vague Response Detection
 * 
 * When user gives a short/vague answer, system asks for elaboration
 */

async function example3_VagueResponse() {
  const conversationHistory = [
    { role: 'assistant', content: 'Did you enjoy working on that project?' },
    { role: 'user', content: 'yes' }  // ⚠️ Vague, short response
  ];

  const response = await fetch('http://localhost:3002/api/follow-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userMessage: "yes",
      conversationHistory
    })
  });

  const data = await response.json();
  
  console.log('Follow-Up Question:');
  console.log(data.followUpQuestion);
  // Expected: Questions encouraging detailed explanation
}

/**
 * EXAMPLE 4: Interview Scenario - Achievement
 * 
 * Generate achievement-focused follow-up questions
 */

async function example4_AchievementScenario() {
  const response = await fetch('http://localhost:3002/api/follow-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userMessage: "I developed the Good Moral Application system for student records",
      scenario: 'achievement',  // 🎯 Focuses on achievements
      conversationHistory: [
        { role: 'assistant', content: 'Tell me about your biggest achievement' }
      ]
    })
  });

  const data = await response.json();
  
  console.log('Achievement Follow-Up:');
  console.log(data.followUpQuestion);
  // Expected: Questions about skills, challenges overcome, impact
}

/**
 * EXAMPLE 5: Interview Scenario - Leadership
 * 
 * Generate leadership-focused follow-up questions
 */

async function example5_LeadershipScenario() {
  const response = await fetch('http://localhost:3002/api/follow-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userMessage: "I led a team of 15 students as JPCS President",
      scenario: 'leadership',  // 👥 Focuses on leadership
      conversationHistory: []
    })
  });

  const data = await response.json();
  
  console.log('Leadership Follow-Up:');
  console.log(data.followUpQuestion);
  // Expected: Questions about leadership style, team motivation, decisions
}

/**
 * EXAMPLE 6: Interview Scenario - Technical
 * 
 * Generate technical-focused follow-up questions
 */

async function example6_TechnicalScenario() {
  const response = await fetch('http://localhost:3002/api/follow-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userMessage: "I optimized database queries and reduced response time by 60%",
      scenario: 'technical',  // 💻 Focuses on technical details
      conversationHistory: []
    })
  });

  const data = await response.json();
  
  console.log('Technical Follow-Up:');
  console.log(data.followUpQuestion);
  // Expected: Questions about technologies, approach, problem-solving
}

/**
 * EXAMPLE 7: Initial Topic Follow-Up (GET Request)
 * 
 * Generate opening follow-up for a topic
 */

async function example7_InitialFollowUp() {
  const response = await fetch(
    'http://localhost:3002/api/follow-up?topic=career goals'
  );

  const data = await response.json();
  
  console.log('Initial Follow-Up for "career goals":');
  console.log(data.followUpQuestion);
  // Expected: Opening questions to explore career goals topic
}

/**
 * EXAMPLE 8: Full Conversation Flow with Follow-Ups
 * 
 * Complete conversation demonstrating follow-up system
 */

async function example8_FullConversation() {
  let conversationHistory = [];

  // Turn 1: Initial question
  console.log('=== TURN 1 ===');
  const turn1 = await fetch('http://localhost:3002/api/rag-local', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: "What are your leadership experiences?",
      generateFollowUp: true,
      conversationHistory
    })
  });
  
  const data1 = await turn1.json();
  console.log('Pearl:', data1.response);
  console.log('\nFollow-Up:', data1.followUpQuestion);
  
  // Update history
  conversationHistory.push(
    { role: 'user', content: "What are your leadership experiences?" },
    { role: 'assistant', content: data1.response }
  );

  // Turn 2: User responds
  console.log('\n=== TURN 2 ===');
  console.log('User: Can you tell me more about the mentorship program?');
  
  const turn2 = await fetch('http://localhost:3002/api/rag-local', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: "Tell me more about the mentorship program",
      generateFollowUp: true,
      conversationHistory
    })
  });
  
  const data2 = await turn2.json();
  console.log('Pearl:', data2.response);
  console.log('\nFollow-Up:', data2.followUpQuestion);
  
  conversationHistory.push(
    { role: 'user', content: "Tell me more about the mentorship program" },
    { role: 'assistant', content: data2.response }
  );

  // Turn 3: Short user response (triggers vague detection)
  console.log('\n=== TURN 3 ===');
  console.log('User: That sounds great');
  
  const turn3 = await fetch('http://localhost:3002/api/follow-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userMessage: "That sounds great",
      conversationHistory
    })
  });
  
  const data3 = await turn3.json();
  console.log('Follow-Up (vague response detected):', data3.followUpQuestion);
}

/**
 * EXAMPLE 9: Bilingual Support (Tagalog)
 * 
 * Follow-up system works with Tagalog conversations
 */

async function example9_TagalogSupport() {
  const response = await fetch('http://localhost:3002/api/follow-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userMessage: "Ang pinakamalaking achievement ko ay ang Good Moral Application system",
      conversationHistory: [
        { role: 'assistant', content: 'Ano ang pinakamalaking achievement mo?' }
      ]
    })
  });

  const data = await response.json();
  
  console.log('Tagalog Follow-Up:');
  console.log(data.followUpQuestion);
  // Expected: Follow-up in Tagalog
}

/**
 * EXAMPLE 10: Error Handling
 * 
 * System gracefully handles errors
 */

async function example10_ErrorHandling() {
  // Test with invalid data
  const response = await fetch('http://localhost:3002/api/follow-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // Missing userMessage (required field)
      conversationHistory: []
    })
  });

  const data = await response.json();
  
  if (!data.success) {
    console.log('Error (expected):', data.error);
    console.log('Message:', data.message);
  }
}

// ============================================================================
// TESTING COMMANDS
// ============================================================================

console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║              Follow-Up Question System - Usage Examples                   ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

📋 10 Examples Available:

1️⃣  example1_AutomaticFollowUp()      - Basic RAG with follow-up
2️⃣  example2_TellMeMore()             - "Tell me more" detection
3️⃣  example3_VagueResponse()          - Vague/short response handling
4️⃣  example4_AchievementScenario()    - Achievement interview questions
5️⃣  example5_LeadershipScenario()     - Leadership interview questions
6️⃣  example6_TechnicalScenario()      - Technical interview questions
7️⃣  example7_InitialFollowUp()        - Initial topic exploration
8️⃣  example8_FullConversation()       - Complete conversation flow
9️⃣  example9_TagalogSupport()         - Bilingual (Tagalog) support
🔟 example10_ErrorHandling()          - Error handling

🚀 Quick Test:
   Open browser console at http://localhost:3002
   Copy one of the functions above
   Run: await exampleX()

📖 Full Documentation:
   See FOLLOW_UP_SYSTEM_DOCUMENTATION.md

🎯 Key Features:
   ✅ 2-3 paragraph contextual follow-ups
   ✅ Smart "tell me more" detection
   ✅ Vague response prompting
   ✅ Interview scenario support
   ✅ Bilingual (English/Tagalog)
   ✅ Conversation history tracking
`);

// Export for browser console testing
if (typeof window !== 'undefined') {
  window.followUpExamples = {
    example1_AutomaticFollowUp,
    example2_TellMeMore,
    example3_VagueResponse,
    example4_AchievementScenario,
    example5_LeadershipScenario,
    example6_TechnicalScenario,
    example7_InitialFollowUp,
    example8_FullConversation,
    example9_TagalogSupport,
    example10_ErrorHandling
  };
  
  console.log('✅ Examples loaded! Access via window.followUpExamples');
}
