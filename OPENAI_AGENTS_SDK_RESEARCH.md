# OpenAI Agents SDK & Realtime API Research

**Research Date**: October 14, 2025  
**Project**: Digital Twin Professional Voice AI  
**Target**: Lovely Pearl B. Alan's Voice Interview Assistant

---

## 📚 Executive Summary

This document provides comprehensive research on OpenAI's modern Agents SDK and Realtime API for building professional voice AI applications. The research focuses on Next.js integration, professional persona design, and strategic MCP server connection.

---

## 🎯 Research Objectives

1. ✅ Understand OpenAI Agents SDK architecture and capabilities
2. ✅ Analyze Realtime API transport mechanisms (WebRTC vs WebSocket)
3. ✅ Evaluate RealtimeAgent and RealtimeSession classes for professional use
4. ✅ Plan tool integration patterns for MCP server connection
5. ✅ Design Next.js implementation roadmap (PoC → Production)

---

## 🏗️ OpenAI Agents SDK Architecture

### Overview

The **OpenAI Agents SDK** (`@openai/agents`) is a high-level abstraction layer built on top of the OpenAI Realtime API. It simplifies voice agent development by providing:

- **RealtimeAgent**: Configuration objects for voice agents with personalities
- **RealtimeSession**: Connection management and conversation orchestration
- **Built-in Tool System**: Function calling for external integrations
- **Agent Handoffs**: Seamless transfers between specialized agents
- **Automatic Audio Handling**: WebRTC-based audio streaming (optional)

### Key Components

#### 1. RealtimeAgent Class

```typescript
import { RealtimeAgent } from '@openai/agents/realtime';

const professionalAgent = new RealtimeAgent({
  name: 'professionalInterviewer',           // Unique agent identifier
  voice: 'sage',                              // Voice model selection
  instructions: 'System prompt defining...',  // Detailed agent behavior
  handoffs: [specialistAgent1, ...],         // Agent transfer capabilities
  tools: [ragSearchTool, ...],               // Function calling tools
  handoffDescription: 'When to use agent',   // Transfer decision guidance
});
```

**Configuration Properties**:

- **`name`**: Unique identifier for agent routing and handoffs
- **`voice`**: OpenAI voice model (`sage`, `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`)
- **`instructions`**: Comprehensive system prompt (personality, tone, behavior, examples)
- **`handoffs`**: Array of RealtimeAgent objects this agent can transfer to
- **`tools`**: Array of executable functions the agent can call
- **`handoffDescription`**: Tells other agents when to transfer to this one

#### 2. RealtimeSession Class

```typescript
import { RealtimeSession } from '@openai/agents/realtime';

const session = new RealtimeSession({
  agents: [agent1, agent2, agent3],
  initialAgent: 'agent1',
  guardrail: moderationGuardrail,
  
  onAgentChange: (agentName) => {
    console.log(`Switched to agent: ${agentName}`);
  },
  
  onTranscriptUpdate: (transcript) => {
    console.log('User said:', transcript);
  },
});

// Connect to OpenAI Realtime API
await session.connect();

// Send text input
await session.sendText('Hello, how are you?');

// Disconnect
await session.disconnect();
```

**Session Management**:

- **Multi-agent orchestration**: Manages multiple agents in single session
- **Automatic handoffs**: Routes between agents based on conversation flow
- **Event handling**: Callbacks for agent changes, transcripts, errors
- **Audio streaming**: Handles bidirectional audio via WebRTC or WebSocket
- **Conversation history**: Maintains full conversation context for agents

#### 3. Tool System (Function Calling)

```typescript
import { tool } from '@openai/agents/realtime';

const ragSearchTool = tool({
  name: 'searchProfessionalProfile',
  description: 'Search Pearl\'s background, skills, and experience',
  
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'User\'s question about Pearl',
      },
    },
    required: ['query'],
  },
  
  execute: async (input, details) => {
    // Access conversation history
    const history: RealtimeItem[] = details?.context?.history || [];
    
    // Add debugging breadcrumbs
    const addBreadcrumb = details?.context?.addTranscriptBreadcrumb;
    if (addBreadcrumb) {
      addBreadcrumb('[RAG Search]', { query: input.query });
    }
    
    // 1. Query Upstash Vector DB
    const vectorResults = await index.query({
      data: input.query,
      topK: 3,
      includeMetadata: true,
    });
    
    // 2. Format context from RAG results
    const context = vectorResults
      .map(r => r.metadata.text)
      .join('\n\n');
    
    // 3. Generate response with Groq
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are Lovely Pearl B. Alan's digital twin. 
          Answer as Pearl in first person. Be professional, enthusiastic, 
          and highlight relevant qualifications.`
        },
        {
          role: "user",
          content: `Context from Pearl's profile:\n${context}\n\nQuestion: ${input.query}`
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });
    
    const answer = completion.choices[0].message.content;
    
    if (addBreadcrumb) {
      addBreadcrumb('[RAG Response]', { answer });
    }
    
    return { answer };
  },
});
```

**Tool Integration Patterns**:

- **External API calls**: Query databases, call MCP servers, fetch data
- **Conversation context access**: Read full history via `details.context.history`
- **Debugging support**: Add breadcrumbs for event logging
- **Return structured data**: Agent uses tool output in response
- **Async execution**: Supports promises and async/await

---

## 🔌 Realtime API Transport Mechanisms

### WebRTC vs WebSocket Comparison

| Feature | **WebRTC** (Recommended) | **WebSocket** |
|---------|--------------------------|---------------|
| **Audio Handling** | Automatic browser capture/playback | Manual getUserMedia + audio processing |
| **Complexity** | High-level, SDK manages everything | Low-level, developer manages audio |
| **Browser Support** | Excellent (modern browsers) | Universal |
| **Latency** | Lower (optimized for real-time) | Slightly higher |
| **Use Case** | Production voice apps | Custom audio pipelines |
| **Implementation** | `OpenAIRealtimeWebRTC` | `OpenAIRealtimeWebSocket` |

### WebRTC Implementation (Recommended)

```typescript
import { OpenAIRealtimeWebRTC } from '@openai/agents/realtime';

const transport = new OpenAIRealtimeWebRTC({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  
  // Optional: customize audio constraints
  audioConstraints: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
});

const session = new RealtimeSession({
  agents: [professionalAgent],
  transport: transport,
});

await session.connect();
```

**Advantages for Professional Use**:
- ✅ Zero audio management code required
- ✅ Browser handles microphone permissions automatically
- ✅ Optimized for voice quality and low latency
- ✅ Built-in echo cancellation and noise suppression
- ✅ Works seamlessly in Chrome, Firefox, Safari, Edge

### WebSocket Implementation (Advanced)

```typescript
import { OpenAIRealtimeWebSocket } from '@openai/agents/realtime';

const transport = new OpenAIRealtimeWebSocket({
  apiKey: process.env.OPENAI_API_KEY!,
  
  // Manual audio handling required
  onAudioDelta: (audioDelta) => {
    // Process incoming audio chunks
    audioBuffer.push(audioDelta);
    playAudio(audioBuffer);
  },
});

// Developer must handle:
// 1. getUserMedia() for microphone access
// 2. Audio encoding (PCM16, 24kHz)
// 3. Chunking and streaming to WebSocket
// 4. Decoding incoming audio
// 5. Audio playback management
```

**Use Cases**:
- Custom audio processing pipelines
- Non-browser environments (Node.js bots)
- Advanced audio effects or filtering
- Integration with telephony systems

### Recommendation for Digital Twin

**Use WebRTC** for the following reasons:

1. **Faster development**: No audio code needed
2. **Better UX**: Automatic browser permission handling
3. **Production-ready**: Tested and optimized by OpenAI
4. **Professional quality**: High-fidelity audio out of the box
5. **Maintenance**: SDK updates handle audio improvements

---

## 🎭 RealtimeAgent Configuration for Professional Persona

### Pearl's Professional Voice Agent Design

```typescript
import { RealtimeAgent, tool } from '@openai/agents/realtime';

// Tool for RAG search
const searchPearlProfile = tool({
  name: 'searchPearlProfile',
  description: 'Search Pearl\'s professional background, skills, projects, and experience',
  parameters: {
    type: 'object',
    properties: {
      question: {
        type: 'string',
        description: 'Question about Pearl\'s qualifications, experience, or skills',
      },
    },
    required: ['question'],
  },
  execute: async (input, details) => {
    // RAG search implementation (Upstash Vector + Groq)
    // ... (see Tool System section above)
  },
});

// Professional greeter agent (Chat-Supervisor pattern - Junior)
const pearlGreeterAgent = new RealtimeAgent({
  name: 'pearlGreeter',
  voice: 'sage',
  
  instructions: `
# Identity
You are Lovely Pearl B. Alan's professional AI assistant, representing Pearl in voice conversations with recruiters, hiring managers, and potential employers.

# Core Behavior
- Greet professionally: "Hi, I'm Pearl's AI assistant. How can I help you learn about Pearl's qualifications today?"
- Maintain warm, enthusiastic, professional tone
- For greetings and chitchat, respond naturally
- For ALL questions about Pearl's background, ALWAYS call searchPearlProfile tool

# Personality & Tone
- **Professional yet personable**: Balance formality with approachability
- **Enthusiastic**: Show genuine excitement about Pearl's skills and achievements
- **Concise**: Keep responses brief and voice-friendly (avoid lists, use prose)
- **Confident**: Speak with certainty about Pearl's qualifications
- **Humble-confident balance**: Highlight achievements without boasting

# Tool Usage Rules
- ALWAYS call searchPearlProfile before answering ANY question about:
  - Pearl's education, skills, or certifications
  - Work experience or projects
  - Career goals or aspirations
  - Leadership roles or achievements
  - Technical capabilities or tools
- Say a brief filler phrase before calling tool: "Let me pull up that information..."
- After tool returns, read the response naturally (paraphrase if needed)

# Filler Phrases (before tool calls)
- "Let me check Pearl's profile for that..."
- "One moment, I'll pull up those details..."
- "Let me get that information for you..."
- "Great question, let me look that up..."

# Sample Conversation Flow

User: "Hi there"
Assistant: "Hi, I'm Pearl's AI assistant. How can I help you learn about Pearl's qualifications today?"

User: "What are Pearl's main technical skills?"
Assistant: "Let me pull up that information..." [calls searchPearlProfile]
searchPearlProfile returns: "Pearl's core technical skills include C++ (Cisco certified), JavaScript (Cisco certified), Laravel framework, HTML/CSS, and database management with SQL. She's particularly strong in full-stack development."
Assistant: "Pearl's core technical skills include C++ and JavaScript, both Cisco certified. She's proficient in the Laravel framework, HTML, CSS, and database management with SQL. Her strength is in full-stack development."

User: "Tell me about her education"
Assistant: "Great question, let me check..." [calls searchPearlProfile]
searchPearlProfile returns: "Pearl is a BSIT student at St. Paul University Philippines, majoring in Web & App Development. She's a President's Lister, indicating top academic performance. Expected graduation is 2026."
Assistant: "Pearl is currently a BSIT student at St. Paul University Philippines, majoring in Web and App Development. She's a President's Lister, which recognizes her outstanding academic performance. She's expected to graduate in 2026."

User: "What's her career goal?"
Assistant: "One moment..." [calls searchPearlProfile]
searchPearlProfile returns: "Pearl's career goal is to become a Data Analyst, where she can apply her learnings from the AI Data Analyst workshop and combine her technical skills with data-driven decision making."
Assistant: "Pearl's goal is to become a Data Analyst. She's particularly interested in applying what she learned from the AI Data Analyst workshop, combining her technical background with data-driven insights."

# Important Guidelines
- NEVER fabricate or assume information about Pearl
- ALWAYS rely on searchPearlProfile tool for factual answers
- If tool returns "no information found", say: "I don't have that specific information, but I'd be happy to connect you with Pearl directly."
- Keep audio responses concise (30-45 seconds max)
- Avoid bullet points in speech - use natural prose
- Vary your phrasing to avoid sounding robotic
`,
  
  tools: [searchPearlProfile],
  handoffs: [],
  handoffDescription: 'Professional assistant for Pearl\'s digital twin voice interviews',
});

export const professionalDigitalTwinScenario = [pearlGreeterAgent];
```

### Key Design Principles

1. **First Impressions Matter**
   - Professional greeting sets tone
   - Clear purpose ("learn about Pearl's qualifications")
   - Warm but not overly casual

2. **Tool-Driven Accuracy**
   - ALWAYS call RAG search for factual questions
   - Never rely on agent's training data
   - Ensures up-to-date, accurate information

3. **Voice-Optimized Responses**
   - No bullet points (hard to listen to)
   - Conversational prose
   - 30-45 second response target
   - Natural phrasing and varied language

4. **Professional Persona**
   - Enthusiastic but not salesy
   - Confident but humble
   - Knowledgeable but accessible
   - Represents Pearl's brand

---

## 🔗 MCP Integration Strategy

### Two-Phase Implementation Approach

#### **Phase 1: Standalone PoC (Recommended First Step)**

Build voice AI directly in Next.js with RAG integration:

```typescript
// app/api/voice-session/route.ts
export async function POST(request: Request) {
  const { query } = await request.json();
  
  // 1. Search Upstash Vector
  const vectorResults = await index.query({
    data: query,
    topK: 3,
    includeMetadata: true,
  });
  
  // 2. Generate response with Groq
  const context = vectorResults.map(r => r.metadata.text).join('\n');
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are Pearl's digital twin..." },
      { role: "user", content: `Context: ${context}\n\nQ: ${query}` }
    ],
  });
  
  return Response.json({ answer: response.choices[0].message.content });
}

// Voice agent tool
const searchPearlProfile = tool({
  name: 'searchPearlProfile',
  description: 'Search Pearl\'s profile',
  execute: async (input) => {
    const res = await fetch('/api/voice-session', {
      method: 'POST',
      body: JSON.stringify({ query: input.question }),
    });
    const { answer } = await res.json();
    return { answer };
  },
});
```

**Advantages**:
- ✅ Faster development (no MCP complexity)
- ✅ Easier debugging
- ✅ Prove voice AI concept first
- ✅ Same RAG system as existing chatbot

#### **Phase 2: MCP Server Integration (Future Enhancement)**

Connect voice AI to existing MCP server:

```typescript
// app/api/mcp-bridge/route.ts
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export async function POST(request: Request) {
  const { tool, params } = await request.json();
  
  // 1. Connect to MCP server
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['mcp/src/index.js'],
  });
  
  const client = new Client({
    name: 'voice-ai-client',
    version: '1.0.0',
  }, {
    capabilities: {},
  });
  
  await client.connect(transport);
  
  // 2. Call MCP tool
  const result = await client.callTool({
    name: tool,
    arguments: params,
  });
  
  await client.close();
  
  return Response.json(result);
}

// Voice agent MCP tool
const callMCPServer = tool({
  name: 'queryDigitalTwin',
  description: 'Query Pearl\'s digital twin via MCP',
  execute: async (input) => {
    const res = await fetch('/api/mcp-bridge', {
      method: 'POST',
      body: JSON.stringify({
        tool: 'query_profile',
        params: { query: input.question },
      }),
    });
    return await res.json();
  },
});
```

**Advantages**:
- ✅ Reuses existing MCP infrastructure
- ✅ Consistent with chatbot implementation
- ✅ Future-proof architecture
- ✅ Centralized knowledge management

**Trade-offs**:
- ⚠️ More complex debugging
- ⚠️ MCP server startup overhead
- ⚠️ Additional layer of abstraction

### Recommended Path

**Start with Phase 1 (Standalone PoC)**:
1. Implement voice AI with direct RAG calls
2. Test and validate professional persona
3. Gather user feedback
4. Optimize conversation flow

**Then migrate to Phase 2 (MCP Integration)** when:
- Voice AI proven effective
- Need centralized knowledge updates
- Want to unify chatbot + voice backend
- Scaling to multiple voice agents

---

## 🚀 Next.js Implementation Roadmap

### Step-by-Step Development Plan

#### **Step 1: Environment Setup** ✅ (Already Complete)

```bash
# Dependencies installed
pnpm add @openai/agents uuid zod @radix-ui/react-icons

# Environment variables configured
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-...
GROQ_API_KEY=gsk_...
UPSTASH_VECTOR_REST_URL=https://...
UPSTASH_VECTOR_REST_TOKEN=...
```

#### **Step 2: Create Professional Agent Configuration**

```typescript
// app/agentConfigs/professionalDigitalTwin/index.ts
import { RealtimeAgent, tool } from '@openai/agents/realtime';
import { Index } from '@upstash/vector';
import { Groq } from 'groq-sdk';

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

const searchPearlProfile = tool({
  name: 'searchPearlProfile',
  description: 'Search Pearl\'s professional background',
  parameters: {
    type: 'object',
    properties: {
      question: { type: 'string' },
    },
    required: ['question'],
  },
  execute: async (input, details) => {
    const addBreadcrumb = details?.context?.addTranscriptBreadcrumb;
    
    if (addBreadcrumb) {
      addBreadcrumb('[RAG Search]', { query: input.question });
    }
    
    // 1. Vector search
    const results = await index.query({
      data: input.question,
      topK: 3,
      includeMetadata: true,
    });
    
    // 2. Format context
    const context = results
      .map(r => r.metadata?.text || r.data)
      .filter(Boolean)
      .join('\n\n');
    
    // 3. Generate response
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are Lovely Pearl B. Alan's AI digital twin. 
          
          Answer as Pearl in first person. Be professional, enthusiastic about technology, 
          and highlight relevant qualifications naturally. Keep responses concise for voice 
          (2-3 sentences max).
          
          Key facts:
          - BSIT student at St. Paul University Philippines (graduation 2026)
          - Major: Web & App Development
          - President's Lister (top academic performance)
          - President of Junior Philippine Computer Society
          - Executive Secretary of Student Government
          - Technical skills: C++ (Cisco certified), JavaScript (Cisco certified), Laravel, SQL
          - Career goal: Data Analyst with AI/data focus
          - Recent: AI Data Analyst workshop participant`
        },
        {
          role: "user",
          content: `Context from Pearl's profile:\n\n${context}\n\nQuestion: ${input.question}\n\nProvide a concise, natural voice response as Pearl.`
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });
    
    const answer = completion.choices[0].message.content || 
      "I'd be happy to discuss that further. Could you rephrase the question?";
    
    if (addBreadcrumb) {
      addBreadcrumb('[RAG Response]', { answer });
    }
    
    return { answer };
  },
});

export const pearlGreeterAgent = new RealtimeAgent({
  name: 'pearlGreeter',
  voice: 'sage',
  instructions: `[See detailed instructions in Pearl's Professional Voice Agent Design section above]`,
  tools: [searchPearlProfile],
  handoffs: [],
});

export const professionalDigitalTwinScenario = [pearlGreeterAgent];
export const professionalDigitalTwinCompanyName = 'Pearl Digital Twin';
```

#### **Step 3: Register New Agent**

```typescript
// app/agentConfigs/index.ts
import { professionalDigitalTwinScenario } from './professionalDigitalTwin';

export const allAgentSets: Record<string, RealtimeAgent[]> = {
  simpleHandoff: simpleHandoffScenario,
  customerServiceRetail: customerServiceRetailScenario,
  chatSupervisor: chatSupervisorScenario,
  professionalDigitalTwin: professionalDigitalTwinScenario,  // Add this
};

export const defaultAgentSetKey = 'professionalDigitalTwin';  // Set as default
```

#### **Step 4: Update Voice UI**

```typescript
// app/voice/VoiceApp.tsx
import { professionalDigitalTwinScenario } from "@/app/agentConfigs/professionalDigitalTwin";
import { professionalDigitalTwinCompanyName } from "@/app/agentConfigs/professionalDigitalTwin";

const sdkScenarioMap: Record<string, RealtimeAgent[]> = {
  simpleHandoff: simpleHandoffScenario,
  customerServiceRetail: customerServiceRetailScenario,
  chatSupervisor: chatSupervisorScenario,
  professionalDigitalTwin: professionalDigitalTwinScenario,  // Add this
};

// Update guardrail company name mapping
const companyNameMap: Record<string, string> = {
  simpleHandoff: 'Demo Company',
  customerServiceRetail: customerServiceRetailCompanyName,
  chatSupervisor: chatSupervisorCompanyName,
  professionalDigitalTwin: professionalDigitalTwinCompanyName,  // Add this
};
```

#### **Step 5: Test & Iterate**

```bash
# Run development server
pnpm dev

# Navigate to voice UI
# http://localhost:3000/voice

# Test conversation flows:
# 1. "Hi" → Professional greeting
# 2. "What are Pearl's technical skills?" → RAG search
# 3. "Tell me about her education" → RAG search
# 4. "What's her career goal?" → RAG search
# 5. Monitor Events panel for tool calls and responses
```

#### **Step 6: Deploy to Production**

```bash
# Commit changes
git add app/agentConfigs/professionalDigitalTwin/
git commit -m "Add professional digital twin voice agent with RAG integration"
git push origin main

# Vercel auto-deploys
# Test at: https://digital-twin-nextjs-rdii.vercel.app/voice
```

---

## 📊 Conversation Management & History

### RealtimeSession History Tracking

```typescript
// Conversation history available in tool execution
const myTool = tool({
  execute: async (input, details) => {
    // Access full conversation history
    const history: RealtimeItem[] = details?.context?.history || [];
    
    // Filter to messages only
    const messages = history.filter(item => item.type === 'message');
    
    // Analyze conversation context
    const userMessages = messages.filter(m => m.role === 'user');
    const assistantMessages = messages.filter(m => m.role === 'assistant');
    
    console.log(`Conversation has ${userMessages.length} user turns`);
    
    // Use history for context-aware responses
    const previousTopics = userMessages
      .map(m => m.content?.[0]?.text)
      .filter(Boolean);
    
    return { previousTopics };
  },
});
```

### Breadcrumb System for Debugging

```typescript
const searchTool = tool({
  execute: async (input, details) => {
    const addBreadcrumb = details?.context?.addTranscriptBreadcrumb;
    
    // Log tool invocation
    if (addBreadcrumb) {
      addBreadcrumb('[Tool Started]', { 
        tool: 'searchPearlProfile',
        query: input.question 
      });
    }
    
    // Perform search
    const results = await performSearch(input.question);
    
    // Log search results
    if (addBreadcrumb) {
      addBreadcrumb('[Search Results]', { 
        count: results.length,
        topScore: results[0]?.score 
      });
    }
    
    // Generate response
    const answer = await generateResponse(results);
    
    // Log final answer
    if (addBreadcrumb) {
      addBreadcrumb('[Response Generated]', { 
        length: answer.length 
      });
    }
    
    return { answer };
  },
});
```

**Breadcrumbs appear in Events panel** for real-time debugging during conversations.

---

## 🎤 Voice Activity Detection & Interruptions

### Built-in VAD (Voice Activity Detection)

OpenAI Realtime API includes automatic VAD:

- **Turn Detection**: Automatically detects when user stops speaking
- **Threshold Settings**: Configurable silence duration (default: 0.5s)
- **Prefix Padding**: Captures speech start accurately
- **Suffix Padding**: Captures speech end completely

### Interruption Handling

```typescript
const { interrupt } = useRealtimeSession({
  onConnectionChange: (status) => {},
  onAgentHandoff: (agent) => {},
});

// User can interrupt agent mid-response
// Press button or use PTT mode
await interrupt();
```

**Use Cases**:
- User realizes agent misunderstood
- User wants to correct or clarify
- User needs to stop lengthy response

### Push-to-Talk (PTT) Mode

```typescript
// Enable PTT for controlled conversations
const [isPTTMode, setIsPTTMode] = useState(false);

// User holds button to speak, releases to send
<button
  onMouseDown={() => startRecording()}
  onMouseUp={() => stopRecordingAndSend()}
>
  Hold to Speak
</button>
```

**Professional Interview Benefits**:
- ✅ Reduces accidental interruptions
- ✅ Clearer turn-taking
- ✅ Better for noisy environments
- ✅ Professional feel (like phone systems)

---

## 🔐 Security & API Key Management

### Environment Variables Best Practices

```bash
# .env.local (Never commit to Git)

# Server-side only (API routes, server components)
OPENAI_API_KEY=sk-proj-...
GROQ_API_KEY=gsk_...
UPSTASH_VECTOR_REST_URL=https://...
UPSTASH_VECTOR_REST_TOKEN=...

# Client-side (exposed to browser)
NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-...
```

### Client vs Server Key Usage

**Option 1: Client-Side Key (WebRTC - Current Implementation)**

```typescript
// Browser makes direct connection to OpenAI
const transport = new OpenAIRealtimeWebRTC({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
});
```

**Pros**:
- ✅ Lower latency (direct connection)
- ✅ Simpler architecture
- ✅ No server proxy needed

**Cons**:
- ⚠️ API key exposed in browser
- ⚠️ Rate limiting per user harder to implement
- ⚠️ Billing visibility to users

**Option 2: Server-Side Ephemeral Keys (Recommended for Production)**

```typescript
// app/api/voice-session/route.ts
export async function POST() {
  const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-realtime-preview-2024-12-17',
      voice: 'sage',
    }),
  });
  
  const data = await response.json();
  
  return Response.json({
    client_secret: data.client_secret.value,
  });
}

// Client uses ephemeral key
const res = await fetch('/api/voice-session');
const { client_secret } = await res.json();

const transport = new OpenAIRealtimeWebRTC({
  ephemeralKey: client_secret,
});
```

**Pros**:
- ✅ API key never exposed to client
- ✅ Server controls session creation
- ✅ Can implement rate limiting
- ✅ Better security posture

**Cons**:
- ⚠️ Extra API call overhead
- ⚠️ Slightly more complex

### Recommendation

**For PoC**: Use client-side key (faster development)  
**For Production**: Switch to ephemeral keys (better security)

---

## 📈 Performance Optimization

### Latency Reduction Strategies

1. **Use WebRTC Transport**
   - Lowest latency option
   - Direct peer connection to OpenAI

2. **Optimize RAG Search**
   ```typescript
   // Limit vector search results
   const results = await index.query({
     data: query,
     topK: 3,  // Don't fetch more than needed
     includeMetadata: true,
   });
   ```

3. **Stream Groq Responses** (Future Enhancement)
   ```typescript
   const stream = await groq.chat.completions.create({
     model: "llama-3.1-8b-instant",
     messages: [...],
     stream: true,  // Enable streaming
   });
   
   let answer = '';
   for await (const chunk of stream) {
     answer += chunk.choices[0]?.delta?.content || '';
   }
   ```

4. **Cache Common Queries**
   ```typescript
   const cache = new Map<string, string>();
   
   const searchWithCache = async (query: string) => {
     if (cache.has(query)) {
       return cache.get(query);
     }
     
     const result = await performSearch(query);
     cache.set(query, result);
     return result;
   };
   ```

### Audio Quality Settings

```typescript
const transport = new OpenAIRealtimeWebRTC({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  audioConstraints: {
    echoCancellation: true,     // Reduce echo
    noiseSuppression: true,     // Filter background noise
    autoGainControl: true,      // Normalize volume
    sampleRate: 24000,          // 24kHz (Realtime API requirement)
    channelCount: 1,            // Mono audio
  },
});
```

---

## 🧪 Testing Strategy

### Manual Testing Checklist

- [ ] **Basic Greeting**: "Hi" → Professional greeting response
- [ ] **Skills Question**: "What are Pearl's technical skills?" → RAG search → Accurate response
- [ ] **Education Query**: "Tell me about her education" → RAG search → Correct info
- [ ] **Career Goals**: "What's her career goal?" → Data Analyst mention
- [ ] **Leadership**: "What leadership experience does Pearl have?" → JPCS President, Student Gov
- [ ] **Projects**: "What projects has she worked on?" → Good Moral Application mention
- [ ] **Interruption Test**: Interrupt mid-response → Agent stops gracefully
- [ ] **Clarification**: "Can you repeat that?" → Agent repeats naturally
- [ ] **Out of Scope**: "What's the weather?" → Polite redirect to Pearl topics

### Event Logging Verification

Monitor Events panel for:
- ✅ `[RAG Search]` breadcrumbs with query
- ✅ `[RAG Response]` breadcrumbs with answer
- ✅ Tool call invocations
- ✅ Agent handoff events (if applicable)
- ✅ Connection status changes

### Audio Quality Testing

- [ ] Clear voice output (no distortion)
- [ ] Appropriate speaking pace
- [ ] Natural prosody and intonation
- [ ] Echo cancellation working
- [ ] Background noise suppressed

---

## 🎯 Success Metrics

### PoC Success Criteria

1. **Functional**:
   - ✅ Voice conversation initiates without errors
   - ✅ RAG tool successfully queries Upstash Vector
   - ✅ Groq generates Pearl's responses
   - ✅ Responses are accurate and relevant

2. **User Experience**:
   - ✅ Professional greeting sets appropriate tone
   - ✅ Responses sound natural (not robotic)
   - ✅ Audio quality is clear and professional
   - ✅ Latency under 2 seconds for responses

3. **Technical**:
   - ✅ No console errors during conversation
   - ✅ Event logs show proper tool execution
   - ✅ Conversation history maintained correctly
   - ✅ Browser permissions handled smoothly

### Production Readiness Criteria

1. **Security**:
   - ✅ Ephemeral keys implemented
   - ✅ API keys not exposed to client
   - ✅ Rate limiting in place

2. **Reliability**:
   - ✅ Error handling for RAG failures
   - ✅ Fallback responses for edge cases
   - ✅ Graceful degradation if services down

3. **Scalability**:
   - ✅ Response caching implemented
   - ✅ Vector search optimized
   - ✅ Monitoring and logging in place

---

## 📚 Additional Resources

### Official Documentation

- **OpenAI Agents SDK**: https://github.com/openai/openai-agents-node (reference repo)
- **Realtime API Docs**: https://platform.openai.com/docs/guides/realtime
- **Realtime API Reference**: https://platform.openai.com/docs/api-reference/realtime
- **Voice Models**: https://platform.openai.com/docs/guides/text-to-speech

### Related Technologies

- **Upstash Vector**: https://upstash.com/docs/vector
- **Groq SDK**: https://console.groq.com/docs/quickstart
- **Next.js Server Actions**: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
- **WebRTC API**: https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API

### Learning Resources

- **OpenAI Realtime Agents Example**: `openai-realtime-agents` repo (already cloned)
- **Agent Configuration Examples**: `app/agentConfigs/` (existing patterns)
- **Voice Agent Metaprompt**: `app/agentConfigs/voiceAgentMetaprompt.txt` (design template)

---

## 🎬 Next Steps

### Immediate Actions (Today)

1. ✅ **Review Architecture Guide** (`AGENT_ARCHITECTURE_GUIDE.md`)
2. ✅ **Understand Agents SDK Research** (this document)
3. ⏭️ **Design Pearl's Voice Personality** (use metaprompt with ChatGPT)
4. ⏭️ **Implement Professional Agent** (create `professionalDigitalTwin/` config)
5. ⏭️ **Test RAG Integration** (verify Upstash + Groq in voice context)

### Short-Term (This Week)

6. ⏭️ **Optimize Instructions** (refine based on testing)
7. ⏭️ **Add Error Handling** (fallbacks for RAG/API failures)
8. ⏭️ **Enhance Persona** (add more personality details)
9. ⏭️ **Deploy & Share** (get feedback from recruiters/friends)

### Long-Term (Future Enhancements)

10. ⏭️ **MCP Integration** (connect to existing MCP server)
11. ⏭️ **Bilingual Support** (Tagalog voice responses)
12. ⏭️ **Interview Scenarios** (role-play practice modes)
13. ⏭️ **Analytics Dashboard** (track conversation metrics)

---

**🎤 You're ready to build Pearl's professional voice AI!** This research provides the foundation for a production-quality voice assistant that represents Pearl's qualifications with accuracy and professionalism.
