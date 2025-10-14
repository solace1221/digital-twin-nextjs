// OpenAI Agents SDK Research & Analysis Framework
// Copy this prompt to ChatGPT or Claude for detailed implementation guidance

/**
 * PHASE 1: Agents SDK Capabilities Assessment
 * Use this prompt with ChatGPT or Claude for detailed analysis
 */

const agentsSDKResearchPrompt = `
Analyze OpenAI Agents SDK for professional voice AI integration:

## Modern Architecture Context:
- Building on OpenAI's new Agents SDK (@openai/agents)
- Using RealtimeAgent and RealtimeSession classes
- Next.js integration for professional interview preparation
- Target: Create PoC first, then integrate with existing MCP server

## SDK Analysis Requirements:

1. **Agents SDK Capabilities**
   - RealtimeAgent configuration and professional persona setup
   - RealtimeSession management and conversation handling
   - Built-in audio handling vs manual WebSocket management
   - Tool integration patterns for external API connections

2. **Transport Layer Options**
   - OpenAIRealtimeWebRTC (automatic audio handling)
   - OpenAIRealtimeWebSocket (manual audio management)
   - Browser compatibility and user experience implications
   - Professional use case suitability and audio quality

3. **Implementation Approach**
   - Next.js project setup and SDK integration
   - Environment variable configuration and API key management
   - Professional conversation flow design with agents
   - Voice activity detection and interruption handling

4. **MCP Integration Strategy**
   - Tool-based delegation to existing MCP server
   - Conversation history management and context passing
   - Real-time data retrieval during voice conversations
   - Error handling and fallback strategies

Provide implementation roadmap with Next.js PoC first, then MCP integration.
`;

/**
 * PHASE 2: Professional Voice Agent Design
 * Use this prompt to design Pearl's voice personality
 */

const voicePersonaDesignPrompt = `
Design a professional voice AI agent for Lovely Pearl B. Alan's digital twin:

## Professional Context:
- **Name**: Lovely Pearl B. Alan
- **Role**: BSIT Student → Aspiring Data Analyst
- **University**: St. Paul University Philippines (President's Lister)
- **Leadership**: JPCS President, Student Government Executive Secretary
- **Technical Skills**: C++, JavaScript (both Cisco certified), Laravel, SQL
- **Career Goal**: Data Analyst specializing in AI-powered analysis
- **Use Case**: Professional interviews, recruiter conversations, career exploration

## Voice Agent Requirements:

1. **Personality Definition**
   - Identity: What does the voice agent represent?
   - Demeanor: Professional yet personable, enthusiastic but not overly casual
   - Tone: Warm, confident, knowledgeable about Pearl's qualifications
   - Level of Formality: Balanced (professional but approachable)
   - Level of Enthusiasm: Genuinely excited about technology and data
   - Filler Words: Occasional ("let me check", "one moment")
   - Pacing: Natural conversational speed

2. **Conversation Flow Design**
   - Greeting: Professional introduction as Pearl's AI assistant
   - Information Gathering: Ask clarifying questions naturally
   - RAG Search: When to query Pearl's knowledge base
   - Response Delivery: How to present Pearl's qualifications
   - Handoffs: When to suggest connecting with Pearl directly

3. **Voice-Optimized Response Patterns**
   - Concise answers (30-45 seconds max)
   - Conversational prose (no bullet points)
   - Natural language flow
   - Appropriate pauses and emphasis
   - Varied phrasing to avoid repetition

4. **Professional Use Case Scenarios**
   - Recruiter asks about technical skills
   - Hiring manager inquires about projects
   - Interviewer explores leadership experience
   - Company representative checks career goals
   - Follow-up questions and clarifications

Provide a complete agent instruction prompt formatted for OpenAI RealtimeAgent.
`;

/**
 * PHASE 3: RAG Integration Architecture
 * Use this prompt to design tool integration
 */

const ragIntegrationPrompt = `
Design RAG (Retrieval-Augmented Generation) tool integration for voice AI:

## Current RAG System:
- **Vector Database**: Upstash Vector (1955 vectors, 264 Q&A pairs)
- **Embedding Model**: Upstash's built-in embedding
- **Generation Model**: Groq (LLaMA 3.1-8b-instant)
- **Temperature**: 0.7
- **Max Tokens**: 500 (text chat), needs adjustment for voice

## Integration Requirements:

1. **Voice-Specific Tool Design**
   - Function signature for searchPearlProfile tool
   - Input parameters (question, context hints)
   - Output format (voice-optimized responses)
   - Error handling and fallback strategies

2. **Vector Search Optimization**
   - TopK selection (3-5 results optimal?)
   - Query reformulation for voice inputs
   - Metadata filtering if needed
   - Score thresholds for relevance

3. **Response Generation for Voice**
   - System prompt adjustments for conciseness
   - Max tokens reduced (150-200 for voice?)
   - Temperature tuning for natural speech
   - First-person perspective as Pearl
   - Conversational tone markers

4. **Conversation History Context**
   - How to pass conversation history to RAG
   - Context window management
   - Follow-up question handling
   - Topic continuity across turns

5. **Performance Considerations**
   - Latency targets (< 2 seconds for tool execution)
   - Caching strategies for common queries
   - Parallel vs sequential tool calls
   - Graceful degradation if RAG fails

Provide implementation code for the searchPearlProfile tool with Upstash Vector + Groq.
`;

/**
 * PHASE 4: Testing & Validation Framework
 * Use this prompt to create test scenarios
 */

const testingFrameworkPrompt = `
Create comprehensive testing framework for Pearl's voice AI:

## Testing Scope:
- Functional correctness (accurate responses)
- Professional persona consistency
- Audio quality and clarity
- User experience flow
- Error handling robustness

## Test Scenario Categories:

1. **Basic Conversation Flow**
   - Initial greeting and introduction
   - Simple questions (skills, education, goals)
   - Follow-up questions and clarifications
   - Conversation ending and thank you

2. **Professional Interview Scenarios**
   - Technical skills assessment
   - Project deep-dive questions
   - Leadership experience exploration
   - Career motivation and goals
   - Cultural fit and soft skills

3. **Edge Cases & Error Handling**
   - Out-of-scope questions (weather, politics)
   - Ambiguous or unclear questions
   - RAG search returns no results
   - API failures (Upstash or Groq down)
   - Network interruptions mid-conversation

4. **Audio & UX Testing**
   - Microphone permission handling
   - Background noise resilience
   - Interruption mid-response
   - Push-to-talk vs continuous mode
   - Audio clarity and quality

5. **Accuracy Validation**
   - Responses match Pearl's actual background
   - No hallucinations or fabricated information
   - Proper source attribution (RAG context)
   - Consistency across multiple questions

Provide test cases with expected outcomes and validation criteria.
`;

/**
 * PHASE 5: Deployment & Monitoring Strategy
 * Use this prompt for production planning
 */

const deploymentStrategyPrompt = `
Design production deployment strategy for Pearl's voice AI:

## Deployment Context:
- **Platform**: Vercel (Next.js auto-deployment)
- **Current URL**: https://digital-twin-nextjs-rdii.vercel.app/
- **Voice Route**: /voice
- **Existing Infrastructure**: Text chatbot, MCP server

## Deployment Requirements:

1. **Environment Configuration**
   - Production environment variables (Vercel)
   - API key rotation strategy
   - Ephemeral key generation for security
   - CORS and security headers

2. **Performance Optimization**
   - Edge function placement
   - Cold start mitigation
   - Response caching strategies
   - CDN optimization for audio

3. **Monitoring & Analytics**
   - Conversation metrics (duration, turns, topics)
   - Error tracking and alerting
   - RAG search performance
   - API usage and cost monitoring
   - User feedback collection

4. **Scalability Planning**
   - Concurrent conversation limits
   - Rate limiting per user
   - Database connection pooling
   - Graceful degradation under load

5. **Security Hardening**
   - API key best practices
   - Input validation and sanitization
   - Content moderation (guardrails)
   - Abuse prevention
   - Privacy compliance (conversation data)

Provide production deployment checklist and monitoring dashboard design.
`;

// Export all prompts for use with AI assistants
module.exports = {
  agentsSDKResearchPrompt,
  voicePersonaDesignPrompt,
  ragIntegrationPrompt,
  testingFrameworkPrompt,
  deploymentStrategyPrompt,
};

// Usage instructions:
console.log(`
OpenAI Agents SDK Research Framework
=====================================

Use these prompts with ChatGPT or Claude to get detailed implementation guidance:

1. **Agents SDK Analysis**: Copy 'agentsSDKResearchPrompt' to understand SDK capabilities
2. **Voice Persona Design**: Copy 'voicePersonaDesignPrompt' to create Pearl's personality
3. **RAG Integration**: Copy 'ragIntegrationPrompt' to implement tool integration
4. **Testing Framework**: Copy 'testingFrameworkPrompt' to create test scenarios
5. **Deployment Strategy**: Copy 'deploymentStrategyPrompt' for production planning

Each prompt is designed to give you actionable implementation code and detailed guidance.
`);
