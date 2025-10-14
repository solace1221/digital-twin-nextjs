# Voice Agent Architecture Guide

## 📚 Overview

This guide provides a comprehensive understanding of the voice agent patterns, configurations, and architecture in your digital-twin-nextjs project. Use this as a reference when building your professional voice assistant for Lovely Pearl B. Alan's digital twin.

---

## 🗂️ Project Structure

```
app/
├── agentConfigs/                    # All agent configurations
│   ├── chatSupervisor/             # Chat-Supervisor pattern (advanced)
│   │   ├── index.ts                # Main chat agent definition
│   │   ├── supervisorAgent.ts      # Supervisor agent with tools
│   │   └── sampleData.ts           # Mock data for demonstrations
│   ├── customerServiceRetail/      # Sequential Handoff pattern
│   │   ├── index.ts                # Multi-agent setup
│   │   ├── authentication.ts       # Authentication agent
│   │   ├── returns.ts              # Returns specialist
│   │   ├── sales.ts                # Sales specialist
│   │   └── simulatedHuman.ts       # Human handoff simulation
│   ├── simpleHandoff.ts            # Basic handoff example
│   ├── guardrails.ts               # Content moderation
│   ├── types.ts                    # Type definitions
│   ├── index.ts                    # Agent registry
│   └── voiceAgentMetaprompt.txt    # Prompt design guide
├── voice/
│   ├── page.tsx                    # Voice route entry
│   ├── VoiceApp.tsx                # Main voice UI
│   └── layout.tsx                  # Context providers
├── components/voice/               # Voice UI components
│   ├── Transcript.tsx              # Message display
│   ├── Events.tsx                  # Event logs
│   ├── BottomToolbar.tsx           # Controls
│   └── GuardrailChip.tsx           # Moderation display
├── contexts/                       # State management
│   ├── TranscriptContext.tsx       # Message history
│   └── EventContext.tsx            # Event logging
├── hooks/                          # Custom hooks
│   ├── useRealtimeSession.ts       # WebRTC connection
│   ├── useAudioDownload.ts         # Audio recording
│   └── useHandleSessionHistory.ts  # History persistence
└── api/voice-session/              # Backend endpoints
    ├── session/route.ts            # Session creation
    ├── responses/route.ts          # Guardrail API
    └── health/route.ts             # Health check
```

---

## 🎯 Agent Patterns

### 1. Simple Handoff Pattern (`simpleHandoff.ts`)

**Use Case**: Basic agent-to-agent transfers for simple workflows

**How It Works**:
- One agent greets and gathers information
- Hands off to specialist agent when ready
- Specialist completes the task

**Example**: Greeter → Haiku Writer

```typescript
// Greeter agent
const greeterAgent = new RealtimeAgent({
  name: 'greeter',
  voice: 'sage',
  instructions: "Greet the user and ask if they'd like a Haiku. If yes, hand off to 'haiku' agent.",
  handoffs: [haikuWriterAgent],
  tools: [],
  handoffDescription: 'Agent that greets the user',
});

// Specialist agent
const haikuWriterAgent = new RealtimeAgent({
  name: 'haikuWriter',
  voice: 'sage',
  instructions: 'Ask the user for a topic, then reply with a haiku about that topic.',
  handoffs: [],
  tools: [],
  handoffDescription: 'Agent that writes haikus',
});
```

**Key Concepts**:
- `handoffs`: Array of agents this agent can transfer to
- `handoffDescription`: Tells the agent when to transfer
- **Linear flow**: A → B (no back transfers)

---

### 2. Sequential Handoff Pattern (`customerServiceRetail/`)

**Use Case**: Multi-specialist workflows where users may need different services

**How It Works**:
- Multiple specialized agents (Authentication, Returns, Sales, Human)
- Each can hand off to any other agent
- Circular handoffs allow flexible routing

**Example**: Customer Service with Multiple Specialists

```typescript
// All agents can hand off to each other
(authenticationAgent.handoffs as any).push(returnsAgent, salesAgent, simulatedHumanAgent);
(returnsAgent.handoffs as any).push(authenticationAgent, salesAgent, simulatedHumanAgent);
(salesAgent.handoffs as any).push(authenticationAgent, returnsAgent, simulatedHumanAgent);
(simulatedHumanAgent.handoffs as any).push(authenticationAgent, returnsAgent, salesAgent);
```

**Key Concepts**:
- **Multi-directional handoffs**: Any agent can transfer to any other
- **Specialized roles**: Each agent handles specific tasks
- **State machine**: Circular flow allows complex routing
- **Company name**: Used for guardrails (`customerServiceRetailCompanyName`)

**Agent Examples**:
- **Authentication**: Verifies user identity
- **Returns**: Handles return requests
- **Sales**: Upgrades, purchases, product info
- **Simulated Human**: Escalation to human agent

---

### 3. Chat-Supervisor Pattern (`chatSupervisor/`)

**Use Case**: Advanced pattern with junior agent + AI supervisor for complex decision-making

**How It Works**:
- **Junior Agent** (chatAgent): Interacts with user, handles basic tasks
- **Supervisor Agent** (supervisorAgent): Provides intelligent guidance via tool calls
- Junior agent calls `getNextResponseFromSupervisor` for complex queries
- Supervisor analyzes full conversation history and calls tools if needed

**Architecture**:

```
User ←→ Junior Agent (chatAgent)
              ↓ (calls getNextResponseFromSupervisor)
        Supervisor Agent (supervisorAgent)
              ↓ (analyzes history, calls tools)
        Returns intelligent response
              ↓
        Junior Agent reads response to user
```

**Example Flow**:

1. **User**: "Why is my bill so high?"
2. **Junior Agent**: "Let me check." *(filler phrase)*
3. **Junior Agent** → calls `getNextResponseFromSupervisor(relevantContext="User asking about high bill")`
4. **Supervisor Agent**:
   - Reads conversation history
   - Calls `getUserAccountInfo(phone_number="206-135-1246")`
   - Gets account data
   - Generates response: "Your bill is $150, mainly due to $75 in international calls..."
5. **Junior Agent** → reads supervisor's response verbatim to user

**Key Concepts**:
- **Division of Labor**: Junior handles conversation flow, Supervisor handles intelligence
- **Tool Calls**: Supervisor has access to tools (lookupPolicyDocument, getUserAccountInfo, findNearestStore)
- **Filler Phrases**: Junior must say something before calling supervisor ("Just a second", "Let me check")
- **Context Passing**: Junior provides key info from last user message
- **Iterative Tool Calls**: Supervisor can call multiple tools before responding

---

## 🛠️ Core Components

### RealtimeAgent Configuration

```typescript
const agent = new RealtimeAgent({
  name: 'agentName',              // Unique identifier
  voice: 'sage',                  // Voice model (sage, alloy, echo, etc.)
  instructions: 'System prompt',  // Detailed behavior instructions
  handoffs: [otherAgent1, ...],  // Agents this can transfer to
  tools: [tool1, tool2, ...],    // Functions this agent can call
  handoffDescription: 'When to use this agent',  // For other agents
});
```

**Voice Options**: `sage`, `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`

---

### Tools (Function Calling)

Tools allow agents to perform actions or retrieve information:

```typescript
import { tool } from '@openai/agents/realtime';

const myTool = tool({
  name: 'toolName',
  description: 'What this tool does',
  parameters: {
    type: 'object',
    properties: {
      paramName: {
        type: 'string',
        description: 'What this parameter is',
      },
    },
    required: ['paramName'],
  },
  execute: async (input, details) => {
    // Tool logic here
    const { paramName } = input;
    
    // Access conversation history
    const history = details?.context?.history || [];
    
    // Add breadcrumbs for debugging
    const addBreadcrumb = details?.context?.addTranscriptBreadcrumb;
    if (addBreadcrumb) {
      addBreadcrumb('Tool called', { paramName });
    }
    
    // Return result
    return { result: 'tool output' };
  },
});
```

**Example - getNextResponseFromSupervisor**:
```typescript
export const getNextResponseFromSupervisor = tool({
  name: 'getNextResponseFromSupervisor',
  description: 'Get guidance from supervisor agent',
  parameters: {
    type: 'object',
    properties: {
      relevantContextFromLastUserMessage: {
        type: 'string',
        description: 'Key info from user\'s last message',
      },
    },
    required: ['relevantContextFromLastUserMessage'],
  },
  execute: async (input, details) => {
    // Call Responses API with conversation history
    // Supervisor analyzes and returns intelligent response
    return { nextResponse: 'What to tell the user' };
  },
});
```

---

### Instructions Format

Agent instructions should include:

1. **Identity & Role**
   ```
   You are a helpful customer service agent for NewTelco...
   ```

2. **Core Behavior**
   ```
   # Instructions
   - Always greet with "Hi, you've reached NewTelco"
   - Call tools before answering factual questions
   - Never speculate or make assumptions
   ```

3. **Tone & Style**
   ```
   ## Tone
   - Maintain neutral, unexpressive tone
   - Be quick and concise
   - No sing-song or overly friendly language
   ```

4. **Tool Usage**
   ```
   # Tools
   - Use getNextResponseFromSupervisor for all non-trivial queries
   - NEVER call tools directly, only via supervisor
   ```

5. **Allowed Actions**
   ```
   # Allow List
   - Handle greetings
   - Basic chitchat
   - Collect information for tool calls
   ```

6. **Sample Phrases**
   ```
   # Filler Phrases
   - "Just a second."
   - "Let me check."
   - "One moment."
   ```

7. **Examples**
   ```
   # Example
   User: "Hi"
   Assistant: "Hi, you've reached NewTelco, how can I help?"
   ...
   ```

---

## 🎨 Voice Agent Metaprompt

The `voiceAgentMetaprompt.txt` file is a powerful tool for designing agent personalities. It's a ChatGPT prompt template that helps you:

1. **Define Personality**:
   - Identity (who the agent represents)
   - Task (what they do)
   - Demeanor (attitude)
   - Tone (voice style)
   - Level of enthusiasm, formality, emotion
   - Filler words frequency
   - Pacing

2. **Create State Machines**:
   - Define conversation steps
   - Specify transitions between steps
   - Include examples for each step

**Usage**:
1. Paste the entire metaprompt into ChatGPT
2. Add your use case in `<user_input>` section
3. Answer clarifying questions
4. Get a complete agent prompt ready to use

---

## 🔒 Guardrails

Guardrails provide content moderation for voice conversations:

```typescript
import { createModerationGuardrail } from "@/app/agentConfigs/guardrails";

// Create guardrail for company
const guardrail = createModerationGuardrail(companyName);

// Use in session
const session = new Session({
  agents: [myAgent],
  guardrail: guardrail,
});
```

**How It Works**:
- Monitors conversation for inappropriate content
- Calls `/api/voice-session/responses` for classification
- Returns: `NONE`, `OFFENSIVE_GENERAL`, `OFFENSIVE_COMPANY`, `OFF_TOPIC`, `CRITICAL`
- Agent responds based on classification

---

## 🔄 Session Flow

### Connection Lifecycle

1. **Initialize Session**
   ```typescript
   const { connect, disconnect } = useRealtimeSession({
     onConnectionChange: (status) => {},
     onAgentHandoff: (agentName) => {},
   });
   ```

2. **Connect**
   ```typescript
   await connect({
     agents: [agent1, agent2],
     guardrail: guardrail,
     initialAgent: agent1.name,
   });
   ```

3. **User Speaks** → Audio captured → Sent to OpenAI Realtime API

4. **Agent Processes**:
   - Transcribes speech
   - Generates response (may call tools)
   - Converts to speech
   - Streams audio back

5. **Agent Handoff** (if triggered):
   - Agent decides to transfer
   - Calls handoff function
   - New agent takes over conversation

6. **Disconnect**
   ```typescript
   await disconnect();
   ```

---

## 🎯 For Your Professional Use Case

### Recommended Pattern: Chat-Supervisor

**Why?**
- Perfect for professional interviews and Q&A
- Supervisor can search digital twin RAG system
- Junior agent maintains conversational flow
- Supervisor provides intelligent, context-aware responses

### Customization Points

1. **Junior Agent** (Professional Greeter):
   ```typescript
   const professionalGreeterAgent = new RealtimeAgent({
     name: 'professionalGreeter',
     voice: 'sage',
     instructions: `
       You are Lovely Pearl B. Alan's professional assistant.
       
       # Greeting
       - Introduce: "Hi, I'm Pearl's AI assistant. How can I help you today?"
       
       # Allowed Actions
       - Handle greetings
       - Collect questions about Pearl's background
       - Call getProfileResponse for all substantive questions
       
       # Tone
       - Professional but warm
       - Enthusiastic about Pearl's skills
       - Concise and clear
     `,
     tools: [getProfileResponse],
   });
   ```

2. **Supervisor Tool** (RAG Search):
   ```typescript
   const getProfileResponse = tool({
     name: 'getProfileResponse',
     description: 'Search Pearl\'s professional profile and experience',
     parameters: {
       type: 'object',
       properties: {
         question: {
           type: 'string',
           description: 'User\'s question about Pearl',
         },
       },
       required: ['question'],
     },
     execute: async (input, details) => {
       // 1. Query Upstash Vector DB
       const results = await index.query({
         data: input.question,
         topK: 3,
         includeMetadata: true,
       });
       
       // 2. Format context
       const context = results.map(r => r.metadata.text).join('\n');
       
       // 3. Call Groq with context
       const response = await groq.chat.completions.create({
         model: "llama-3.1-8b-instant",
         messages: [
           {
             role: "system",
             content: "You are Pearl's digital twin. Answer in first person..."
           },
           {
             role: "user",
             content: `Context: ${context}\n\nQuestion: ${input.question}`
           }
         ],
       });
       
       return { response: response.choices[0].message.content };
     },
   });
   ```

3. **Agent Registry** (Update `index.ts`):
   ```typescript
   import { professionalDigitalTwinScenario } from './professionalDigitalTwin';
   
   export const allAgentSets: Record<string, RealtimeAgent[]> = {
     simpleHandoff: simpleHandoffScenario,
     customerServiceRetail: customerServiceRetailScenario,
     chatSupervisor: chatSupervisorScenario,
     professionalDigitalTwin: professionalDigitalTwinScenario,  // Add this
   };
   
   export const defaultAgentSetKey = 'professionalDigitalTwin';  // Set as default
   ```

---

## 📝 Key Takeaways

1. **Three Main Patterns**:
   - Simple Handoff: Basic A → B transfers
   - Sequential Handoff: Multi-specialist routing
   - Chat-Supervisor: Junior + AI supervisor (recommended for you)

2. **RealtimeAgent = Configuration Object**:
   - `name`, `voice`, `instructions`, `handoffs`, `tools`

3. **Tools = Functions Agents Can Call**:
   - Define with `tool()` helper
   - Access conversation history via `details.context.history`
   - Return data for agent to use

4. **Instructions = System Prompt**:
   - Define personality, tone, behavior
   - Include examples
   - Specify tool usage rules
   - Add sample phrases

5. **For Professional Digital Twin**:
   - Use Chat-Supervisor pattern
   - Create RAG search tool
   - Connect to Upstash Vector + Groq
   - Maintain Pearl's professional voice

---

## 🚀 Next Steps

1. **Explore Existing Agents**:
   - Read through `chatSupervisor/index.ts` carefully
   - Examine `supervisorAgent.ts` tool implementation
   - Test existing scenarios in `/voice` route

2. **Design Your Agent**:
   - Use `voiceAgentMetaprompt.txt` with ChatGPT
   - Define Pearl's voice personality
   - Create conversation flow

3. **Build RAG Tool**:
   - Copy supervisor pattern
   - Add Upstash Vector search
   - Integrate Groq for responses

4. **Test & Iterate**:
   - Start simple (basic greetings)
   - Add complexity gradually
   - Monitor event logs for debugging

---

**🎤 Ready to build Pearl's voice assistant!** Use this guide as your reference throughout development.
