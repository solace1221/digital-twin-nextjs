# Digital Twin MCP Server Project Instructions

## Project Overview
Build an MCP server using the roll dice pattern to create a digital twin assistant that can answer questions about a person's professional profile using RAG (Retrieval-Augmented Generation).

## Reference Repositories
- **Pattern Reference**: https://github.com/gocallum/rolldice-mcpserver.git
  - Roll dice MCP server - use same technology and pattern for our MCP server
- **Logic Reference**: https://github.com/gocallum/binal_digital-twin_py.git
  - Python code using Upstash Vector for RAG search with Groq and LLaMA for generations

## Core Functionality
- MCP server accepts user questions about the person's professional background
- Create server actions that search Upstash Vector database and return RAG results
- Search logic must match the Python version exactly

## Environment Variables (.env.local)
```
UPSTASH_VECTOR_REST_URL=
UPSTASH_VECTOR_REST_TOKEN=
GROQ_API_KEY=
```

## Technical Requirements
- **Framework**: Next.js 15.5.3+ (use latest available)
- **Package Manager**: Always use pnpm (never npm or yarn)
- **Commands**: Always use Windows PowerShell commands
- **Type Safety**: Enforce strong TypeScript type safety throughout
- **Architecture**: Always use server actions where possible
- **Styling**: Use globals.css instead of inline styling
- **UI Framework**: ShadCN with dark mode theme
- **Focus**: Prioritize MCP functionality over UI - UI is primarily for MCP server configuration

## Setup Commands
```bash
pnpm dlx shadcn@latest init
```
Reference: https://ui.shadcn.com/docs/installation/next

## Upstash Vector Integration

### Key Documentation
- Getting Started: https://upstash.com/docs/vector/overall/getstarted
- Embedding Models: https://upstash.com/docs/vector/features/embeddingmodels
- TypeScript SDK: https://upstash.com/docs/vector/sdks/ts/getting-started

### Example Implementation
```typescript
import { Index } from "@upstash/vector"

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
})

// RAG search example
await index.query({
  data: "What is Upstash?",
  topK: 3,
  includeMetadata: true,
})
```

## MCP Server Architecture

### MCP Protocol Integration
- **Transport**: Use stdio transport for MCP communication
- **Tools**: Implement query_profile, chat_with_digital_twin, get_career_advice
- **Resources**: Serve professional profile data and context
- **Error Handling**: Implement robust error handling for MCP operations

### Server Actions Structure
```typescript
// Example server action pattern
"use server"

import { Index } from "@upstash/vector"
import { Groq } from "groq-sdk"

export async function searchProfile(query: string) {
  const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL!,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
  })
  
  const results = await index.query({
    data: query,
    topK: 3,
    includeMetadata: true,
  })
  
  return results
}
```

## Digital Twin Profile Data Structure

### Profile Data Format
```typescript
interface ProfileChunk {
  id: string
  title: string
  content: string
  type: 'personal' | 'skills' | 'education' | 'experience' | 'projects' | 'goals'
  metadata: {
    category: string
    tags: string[]
  }
}

interface DigitalTwinProfile {
  personal: PersonalInfo
  skills: TechnicalSkills
  education: EducationInfo
  experience: ExperienceInfo[]
  projects: ProjectInfo[]
  career_goals: CareerGoals
  content_chunks: ProfileChunk[]
}
```

### Profile Context for Lovely Pearl B. Alan
- **Name**: Lovely Pearl B. Alan
- **Title**: BSIT Student – Web & App Development | Aspiring Data Analyst
- **University**: St. Paul University Philippines
- **Status**: President's Lister (academic excellence)
- **Leadership**: President of Junior Philippine Computer Society, Executive Secretary of Student Government
- **Technical Skills**: C++ (Cisco certified), JavaScript (Cisco certified), Laravel, HTML, CSS, Database Management
- **Projects**: Good Moral Application and Monitoring System with Decision Support (Laravel/SQL)
- **Career Goals**: Data Analyst or Software Engineer, seeking internship opportunities

## Groq Integration

### API Configuration
```typescript
import { Groq } from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})

// Response generation example
const completion = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
    {
      role: "system",
      content: "You are Lovely Pearl B. Alan's AI digital twin. Answer as if you are Lovely herself, speaking in first person about your background, skills, and experience."
    },
    {
      role: "user",
      content: query
    }
  ],
  temperature: 0.7,
  max_tokens: 500,
})
```

## RAG Implementation Pattern

### Search and Generate Workflow
1. **Query Vector Database**: Search Upstash Vector for relevant profile chunks
2. **Extract Context**: Format retrieved chunks as context for LLM
3. **Generate Response**: Use Groq/LLaMA to generate personalized first-person responses
4. **Return Results**: Provide contextual answers about professional background

### Response Generation System Prompt
```typescript
const systemPrompt = `You are Lovely Pearl B. Alan's AI digital twin. Answer questions as if you are Lovely herself, speaking in first person about your background, skills, and experience.

Key Information:
- BSIT student at St. Paul University Philippines (graduating 2026)
- Major: Web & App Development
- Academic Status: President's Lister
- Leadership: JPCS President, Student Government Executive Secretary
- Technical Skills: C++, JavaScript, Laravel, Database Management
- Career Goal: Data Analyst or Software Engineer

Guidelines:
- Respond in first person as Lovely
- Be professional and enthusiastic
- Highlight relevant qualifications
- Show passion for technology and data analysis
- Mention specific achievements and skills when relevant`
```

## UI Components (Secondary Priority)

### ShadCN Components to Use
- Button, Input, Textarea for basic interactions
- Card, Dialog for configuration panels
- Badge, Alert for status indicators
- Form components for MCP server configuration

### Dark Theme Configuration
```typescript
// tailwind.config.ts
export default {
  darkMode: ["class"],
  // ... ShadCN dark theme configuration
}
```

## Development Workflow

### Package Installation Order
1. Install core dependencies: `pnpm add @upstash/vector groq-sdk`
2. Install MCP SDK: `pnpm add @modelcontextprotocol/sdk`
3. Initialize ShadCN: `pnpm dlx shadcn@latest init`
4. Add required ShadCN components as needed

### File Structure
```
/
├── app/
│   ├── api/
│   │   ├── mcp/
│   │   └── chat/
│   ├── components/
│   │   └── ui/
│   └── globals.css
├── lib/
│   ├── mcp-server.ts
│   ├── vector-search.ts
│   └── groq-client.ts
├── types/
│   └── digital-twin.ts
├── agents.md
├── .env.local
└── README.md
```

## Testing and Validation

### MCP Server Testing
- Test MCP stdio transport communication
- Validate tool execution (query_profile, chat_with_digital_twin)
- Verify RAG search accuracy against Python version
- Test error handling and edge cases

### Integration Testing
- Upstash Vector connection and querying
- Groq API response generation
- End-to-end digital twin conversations
- Performance and response time optimization

## Deployment Considerations

### Vercel Deployment
- Configure environment variables in Vercel dashboard
- Ensure MCP server can run in serverless environment
- Test MCP stdio transport in production

### Performance Optimization
- Cache vector search results when appropriate
- Optimize Groq API usage and token consumption
- Implement request rate limiting

## Additional Resources

### MCP Protocol Documentation
- Official MCP Specification: https://spec.modelcontextprotocol.io/
- MCP TypeScript SDK: https://github.com/modelcontextprotocol/typescript-sdk
- Transport Layer Documentation: stdio, HTTP, WebSocket options

### Next.js Server Actions
- Server Actions Documentation: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
- TypeScript Configuration: https://nextjs.org/docs/app/building-your-application/configuring/typescript

### Vector Database Best Practices
- Embedding Strategy: Use Upstash's built-in embedding models
- Chunk Size Optimization: ~200-500 token chunks for profile data
- Metadata Structure: Include category, tags, and content type
- Query Optimization: Use topK=3-5 for balance of relevance and response time

---

**Note**: This file provides comprehensive context for GitHub Copilot to generate accurate, project-specific code suggestions. The focus is on creating a robust MCP server that can effectively serve as a digital twin assistant. Keep this file updated as requirements evolve and new patterns emerge during development.