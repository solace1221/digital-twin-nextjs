# Quick Reference: OpenAI Agents SDK for Professional Voice AI

**Last Updated**: October 14, 2025  
**Project**: Pearl's Digital Twin Voice Assistant

---

## 🚀 Quick Start Commands

```bash
# Already installed dependencies
pnpm add @openai/agents uuid zod @radix-ui/react-icons

# Run development server
pnpm dev

# Access voice UI
http://localhost:3000/voice

# Production URL
https://digital-twin-nextjs-rdii.vercel.app/voice
```

---

## 📁 File Structure Reference

```
app/agentConfigs/
├── professionalDigitalTwin/    ← CREATE THIS (your agent)
│   ├── index.ts               ← Main agent definition + RAG tool
│   └── README.md              ← Documentation
├── chatSupervisor/            ← Study this pattern
├── customerServiceRetail/     ← Multi-agent example
├── simpleHandoff.ts           ← Basic example
└── index.ts                   ← Register your agent here
```

---

## 🎯 Implementation Checklist

### Phase 1: PoC (This Week)
- [ ] Create `app/agentConfigs/professionalDigitalTwin/index.ts`
- [ ] Implement `searchPearlProfile` tool (Upstash + Groq)
- [ ] Define `pearlGreeterAgent` with professional instructions
- [ ] Register in `app/agentConfigs/index.ts`
- [ ] Test at `/voice` route
- [ ] Validate RAG accuracy

### Phase 2: Production (Next Week)
- [ ] Switch to ephemeral API keys
- [ ] Add error handling and fallbacks
- [ ] Implement response caching
- [ ] Add conversation analytics
- [ ] Deploy to Vercel
- [ ] User testing and feedback

### Phase 3: Enhancement (Future)
- [ ] MCP server integration
- [ ] Bilingual support (Tagalog)
- [ ] Interview scenario modes
- [ ] Analytics dashboard

---

## 🔑 Key Code Snippets

### Agent Definition Template

```typescript
import { RealtimeAgent, tool } from '@openai/agents/realtime';

const searchPearlProfile = tool({
  name: 'searchPearlProfile',
  description: 'Search Pearl\'s professional background',
  parameters: {
    type: 'object',
    properties: {
      question: { type: 'string', description: 'User question' },
    },
    required: ['question'],
  },
  execute: async (input, details) => {
    // 1. Vector search
    const results = await index.query({
      data: input.question,
      topK: 3,
      includeMetadata: true,
    });
    
    // 2. Generate response
    const context = results.map(r => r.metadata.text).join('\n');
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are Pearl..." },
        { role: "user", content: `Context: ${context}\n\nQ: ${input.question}` }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });
    
    return { answer: completion.choices[0].message.content };
  },
});

export const pearlGreeterAgent = new RealtimeAgent({
  name: 'pearlGreeter',
  voice: 'sage',
  instructions: `
    You are Pearl's professional AI assistant.
    
    # Greeting
    "Hi, I'm Pearl's AI assistant. How can I help you today?"
    
    # Tool Usage
    - For ALL questions about Pearl, call searchPearlProfile
    - Say filler phrase first: "Let me check..."
    - Read response naturally after tool returns
    
    # Tone
    Professional, warm, enthusiastic, concise
  `,
  tools: [searchPearlProfile],
});

export const professionalDigitalTwinScenario = [pearlGreeterAgent];
```

### Register Agent

```typescript
// app/agentConfigs/index.ts
import { professionalDigitalTwinScenario } from './professionalDigitalTwin';

export const allAgentSets = {
  professionalDigitalTwin: professionalDigitalTwinScenario,
  // ... other agents
};

export const defaultAgentSetKey = 'professionalDigitalTwin';
```

---

## 🎤 Voice Optimization Tips

### Instructions Best Practices

✅ **DO**:
- Use conversational prose
- Include sample dialogues
- Specify filler phrases
- Define clear tool usage rules
- Keep responses under 45 seconds

❌ **DON'T**:
- Use bullet points in responses
- Allow hallucinations (always use RAG)
- Make responses too long
- Speak in third person about Pearl

### RAG Response Tuning

```typescript
// Voice-optimized parameters
const completion = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [...],
  temperature: 0.7,      // Natural variation
  max_tokens: 150,       // Concise for voice (vs 500 for text)
  top_p: 0.9,           // Focused responses
});
```

### System Prompt Template

```
You are Pearl's digital twin. Answer in first person.

Key Facts:
- BSIT student, Web & App Dev major
- President's Lister (top grades)
- JPCS President, Student Gov Executive Secretary
- C++, JavaScript (Cisco certified), Laravel, SQL
- Career goal: Data Analyst

Guidelines:
- Professional but warm tone
- 2-3 sentences max per response
- Enthusiastic about tech and data
- Natural speech patterns
```

---

## 🧪 Testing Quick Commands

### Manual Test Scenarios

```bash
# Test 1: Greeting
You: "Hi"
Expected: "Hi, I'm Pearl's AI assistant..."

# Test 2: Skills
You: "What are Pearl's technical skills?"
Expected: [RAG search] → C++, JavaScript, Laravel, SQL response

# Test 3: Education
You: "Tell me about her education"
Expected: [RAG search] → BSIT, St. Paul University, President's Lister

# Test 4: Career Goal
You: "What's her career goal?"
Expected: [RAG search] → Data Analyst, AI Data Analyst workshop

# Test 5: Out of Scope
You: "What's the weather?"
Expected: Redirect to Pearl-related topics
```

### Event Panel Checks

Monitor for:
- ✅ `[RAG Search]` breadcrumb with query
- ✅ `[RAG Response]` breadcrumb with answer
- ✅ Tool execution time < 2 seconds
- ✅ No errors in console

---

## 🔧 Troubleshooting

### Common Issues

**Problem**: Agent not using RAG tool  
**Solution**: Check instructions say "ALWAYS call searchPearlProfile"

**Problem**: Responses too long  
**Solution**: Reduce `max_tokens` to 150, add "2-3 sentences max" to instructions

**Problem**: Voice sounds robotic  
**Solution**: Add more natural language examples, vary phrasing in instructions

**Problem**: RAG search slow  
**Solution**: Reduce `topK` to 3, implement caching

**Problem**: API key errors  
**Solution**: Verify `.env.local` has `NEXT_PUBLIC_OPENAI_API_KEY`

---

## 📚 Documentation Links

**Created Guides**:
- `AGENT_ARCHITECTURE_GUIDE.md` - Comprehensive architecture overview
- `OPENAI_AGENTS_SDK_RESEARCH.md` - Deep dive on SDK and implementation
- `agents-sdk-research.js` - ChatGPT prompts for detailed guidance

**Official Docs**:
- OpenAI Realtime API: https://platform.openai.com/docs/guides/realtime
- Upstash Vector: https://upstash.com/docs/vector
- Groq SDK: https://console.groq.com/docs/quickstart

**Example Code**:
- `app/agentConfigs/chatSupervisor/` - Chat-Supervisor pattern
- `app/agentConfigs/customerServiceRetail/` - Multi-agent pattern
- `app/voice/VoiceApp.tsx` - Voice UI implementation

---

## 🎯 Success Criteria

### PoC Ready ✅

- [ ] Voice conversation starts without errors
- [ ] Professional greeting delivered
- [ ] RAG tool queries Upstash Vector successfully
- [ ] Responses accurate to Pearl's background
- [ ] Audio quality clear and professional
- [ ] Latency under 2 seconds

### Production Ready 🚀

- [ ] Ephemeral API keys implemented
- [ ] Error handling for all failure modes
- [ ] Response caching for performance
- [ ] Analytics tracking implemented
- [ ] User testing completed
- [ ] Deployed to Vercel production

---

## 🚦 Next Action

**Right Now**: Create `app/agentConfigs/professionalDigitalTwin/index.ts`

Copy template from this file, customize instructions for Pearl, test at `/voice`.

**Need Help?**: Use prompts in `agents-sdk-research.js` with ChatGPT for detailed guidance.

---

**You've got everything you need to build Pearl's voice AI! 🎤✨**
