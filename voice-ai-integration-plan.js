// Voice AI Integration Planning & Architecture
// Complete implementation plan for Pearl's Professional Digital Twin Voice AI

/**
 * PHASE 1: Research & Analysis - Complete Strategic Planning
 * 
 * Use this comprehensive prompt with AI assistants for detailed implementation guidance
 */

const comprehensiveResearchPrompt = `
Analyze and design a voice AI integration strategy for Pearl's professional digital twin:

## Current System Context:
- **Deployed MCP Server**: https://digital-twin-nextjs-rdii.vercel.app/
- **MCP Tools**: query_profile, chat_with_digital_twin, get_career_advice
- **RAG System**: Upstash Vector (1955 vectors) + Groq (LLaMA 3.1-8b-instant)
- **Knowledge Base**: 264 Q&A pairs covering Pearl's background, skills, projects, goals
- **Existing UI**: Text chatbot with bilingual support (English/Tagalog)

## Voice AI Requirements:
1. **OpenAI Realtime API Integration**
   - Real-time voice-to-voice conversation capability
   - Sub-2-second latency for natural conversation flow
   - Professional voice persona (see PROFESSIONAL_VOICE_PERSONA_DESIGN.md)
   - Integration with existing RAG system (Upstash Vector + Groq)

2. **Professional Use Cases** (Priority Order)
   - HR screening call simulations (highest priority)
   - Technical interview practice sessions
   - Behavioral interview scenarios (STAR methodology)
   - Career coaching conversations
   - Salary negotiation practice

3. **Technical Architecture Requirements**
   - WebRTC transport for automatic audio handling
   - Direct RAG integration (Phase 1: bypass MCP, call Upstash + Groq directly)
   - Conversation state management and history tracking
   - Context switching between interview types
   - Fallback and error handling strategies

4. **Quality & Performance Requirements**
   - Professional audio quality (echo cancellation, noise suppression)
   - Natural conversation flow with appropriate pacing
   - Accurate responses based on Pearl's actual background
   - No hallucinations (always use RAG for factual queries)
   - Graceful escalation when questions exceed scope

## Analysis Required:

### 1. Technical Feasibility Assessment
- OpenAI Realtime API compatibility with Next.js 15
- Agents SDK (@openai/agents 0.1.9) integration patterns
- WebRTC browser compatibility and user experience
- RAG tool execution within Realtime API framework
- Conversation history management strategies

### 2. Cost Analysis
- OpenAI Realtime API pricing model (per-minute audio)
- Groq API costs for RAG response generation
- Upstash Vector query pricing
- Projected monthly costs for moderate usage (50-100 conversations/month)
- Cost optimization strategies (caching, response reuse)

### 3. Voice Persona Implementation
- Map PROFESSIONAL_VOICE_PERSONA_DESIGN.md to RealtimeAgent instructions
- STAR methodology response templates
- Filler phrase integration for natural flow
- Escalation trigger conditions and handoff scripts
- Tone consistency across conversation types

### 4. Integration Architecture Options
- **Option A (Recommended)**: Direct RAG integration via tools
  - searchPearlProfile tool calls Upstash Vector + Groq
  - Faster development (no MCP complexity)
  - Same accuracy as text chatbot
  - Easier debugging and testing

- **Option B (Future)**: MCP server delegation
  - Voice tool calls MCP server API endpoints
  - Unified backend for chat + voice
  - More complex error handling
  - Shared conversation history

### 5. Testing & Quality Assurance
- Manual conversation testing scenarios
- Audio quality validation (clarity, pacing, intonation)
- Response accuracy verification (vs Pearl's actual background)
- Edge case handling (unclear audio, out-of-scope questions)
- Performance benchmarking (latency, token usage)

Provide:
1. Detailed technical design document with architecture diagrams
2. Implementation roadmap with time estimates
3. Cost projection with monthly usage scenarios
4. Testing framework and quality checklist
5. Risk assessment and mitigation strategies
`;

/**
 * PHASE 2: Voice AI Architecture Design
 * Complete system architecture with all components
 */

const voiceAIArchitecture = {
  // System Overview
  systemName: 'Pearl Professional Digital Twin Voice AI',
  version: '1.0.0 (PoC)',
  deploymentTarget: 'Vercel (https://digital-twin-nextjs-rdii.vercel.app/)',
  
  // Core Components
  components: {
    // 1. OpenAI Realtime API Integration
    realtimeAPI: {
      provider: 'OpenAI',
      model: 'gpt-4o-realtime-preview-2024-12-17',
      modalities: ['audio', 'text'],
      capabilities: [
        'Voice-to-voice conversation',
        'Function calling (tools)',
        'Conversation history tracking',
        'WebRTC audio streaming',
        'Voice Activity Detection (VAD)',
        'Interruption handling',
      ],
      transport: 'OpenAIRealtimeWebRTC',
      apiKeyManagement: {
        development: 'NEXT_PUBLIC_OPENAI_API_KEY (client-side)',
        production: 'Ephemeral keys via /api/voice-session (server-side)',
      },
    },
    
    // 2. Agents SDK Integration
    agentsSDK: {
      package: '@openai/agents',
      version: '0.1.9',
      classes: {
        RealtimeAgent: {
          purpose: 'Voice agent configuration and persona',
          configuration: {
            name: 'pearlGreeter',
            voice: 'sage', // Professional, clear female voice
            instructions: 'See PROFESSIONAL_VOICE_PERSONA_DESIGN.md templates',
            tools: ['searchPearlProfile'],
            handoffs: [], // Single agent for simplicity
          },
        },
        RealtimeSession: {
          purpose: 'Connection management and orchestration',
          configuration: {
            agents: ['pearlGreeterAgent'],
            initialAgent: 'pearlGreeter',
            guardrail: 'createModerationGuardrail("Pearl Digital Twin")',
          },
        },
      },
    },
    
    // 3. Audio Processing Pipeline
    audioProcessing: {
      input: {
        source: 'Browser microphone (getUserMedia)',
        handling: 'Automatic via WebRTC transport',
        format: 'PCM 24kHz mono',
        features: [
          'Echo cancellation',
          'Noise suppression',
          'Auto gain control',
        ],
      },
      output: {
        destination: 'Browser audio playback',
        handling: 'Automatic via WebRTC transport',
        format: 'PCM 24kHz mono',
        streaming: 'Real-time audio chunks from OpenAI',
      },
      voiceActivityDetection: {
        enabled: true,
        provider: 'OpenAI Realtime API (built-in)',
        turnDetection: {
          threshold: 0.5, // Silence duration to detect turn end
          prefixPadding: 0.3, // Capture speech start
          suffixPadding: 0.3, // Capture speech end
        },
      },
    },
    
    // 4. RAG System Integration
    ragSystem: {
      implementation: 'Direct integration (Phase 1)',
      components: {
        vectorDatabase: {
          provider: 'Upstash Vector',
          endpoint: process.env.UPSTASH_VECTOR_REST_URL,
          token: process.env.UPSTASH_VECTOR_REST_TOKEN,
          data: {
            vectors: 1955,
            qaP pairs: 264,
            embeddingModel: 'Upstash built-in',
          },
          queryParams: {
            topK: 3, // Retrieve top 3 relevant chunks
            includeMetadata: true,
          },
        },
        responseGeneration: {
          provider: 'Groq',
          apiKey: process.env.GROQ_API_KEY,
          model: 'llama-3.1-8b-instant',
          voiceOptimizedParams: {
            temperature: 0.7,
            maxTokens: 150, // Reduced from 500 for voice (concise responses)
            topP: 0.9,
          },
          systemPrompt: `
            You are Lovely Pearl B. Alan's AI digital twin.
            Answer as Pearl in first person.
            
            Professional Profile:
            - BSIT student at St. Paul University Philippines (graduation 2026)
            - Major: Web & App Development
            - President's Lister (top academic performance)
            - President of Junior Philippine Computer Society
            - Executive Secretary of Student Government
            - Technical skills: C++ (Cisco), JavaScript (Cisco), Laravel, SQL
            - Career goal: Data Analyst with AI/data focus
            
            Response Guidelines:
            - Keep responses under 45 seconds when spoken
            - Use conversational prose (no bullet points)
            - Be professional, enthusiastic, and confident
            - Include specific examples and metrics
            - Never fabricate information
            - If unsure, say "I don't have that detail, but I can connect you with Pearl"
          `,
        },
      },
      
      // Tool Implementation
      searchPearlProfileTool: {
        name: 'searchPearlProfile',
        description: "Search Pearl's professional background, skills, projects, and experience",
        parameters: {
          type: 'object',
          properties: {
            question: {
              type: 'string',
              description: "User's question about Pearl's qualifications or experience",
            },
          },
          required: ['question'],
        },
        executionFlow: [
          '1. Receive question from agent',
          '2. Query Upstash Vector DB (topK=3)',
          '3. Extract relevant text from metadata',
          '4. Format context for Groq',
          '5. Generate voice-optimized response (max 150 tokens)',
          '6. Return answer to agent for speech synthesis',
        ],
        estimatedLatency: '1.5-2.0 seconds',
      },
    },
    
    // 5. Next.js Application Structure
    nextJSIntegration: {
      framework: 'Next.js 15.5.5',
      routingStructure: {
        '/voice': {
          component: 'app/voice/page.tsx',
          purpose: 'Main voice AI interface',
          features: [
            'Agent selection (professionalDigitalTwin)',
            'Microphone permission handling',
            'Conversation transcript display',
            'Event logging panel',
            'Connection controls',
          ],
        },
        '/': {
          component: 'components/welcome-to-digital-twin.tsx',
          updates: [
            'Add "Talk with Pearl.AI" button',
            'Link to /voice route',
            'Voice/chat mode toggle',
          ],
        },
      },
      
      agentConfiguration: {
        directory: 'app/agentConfigs/professionalDigitalTwin/',
        files: {
          'index.ts': {
            purpose: 'Main agent definition and tool implementation',
            exports: [
              'pearlGreeterAgent (RealtimeAgent)',
              'professionalDigitalTwinScenario (array)',
              'professionalDigitalTwinCompanyName (string)',
            ],
          },
          'README.md': {
            purpose: 'Documentation for agent configuration',
            contents: 'Persona guidelines, conversation templates, testing scenarios',
          },
        },
        registration: {
          file: 'app/agentConfigs/index.ts',
          updates: [
            'Import professionalDigitalTwinScenario',
            'Add to allAgentSets map',
            'Set as defaultAgentSetKey',
          ],
        },
      },
      
      apiEndpoints: {
        '/api/voice-session': {
          method: 'POST',
          purpose: 'Generate ephemeral API keys (production)',
          response: '{ client_secret: string }',
          implementation: 'Optional for Phase 1 (use client-side key)',
        },
        '/api/voice-session/responses': {
          method: 'POST',
          purpose: 'Guardrail classification endpoint',
          existing: true,
          updates: 'None required (already implemented)',
        },
        '/api/voice-session/health': {
          method: 'GET',
          purpose: 'Health check for voice AI system',
          response: '{ status: "healthy", timestamp: string }',
        },
      },
    },
    
    // 6. UI/UX Components
    userInterface: {
      layout: 'app/voice/layout.tsx',
      contexts: [
        'TranscriptContext (message history)',
        'EventContext (debugging logs)',
      ],
      mainComponent: 'app/voice/VoiceApp.tsx',
      subComponents: {
        'Transcript.tsx': 'Message display with user text input',
        'Events.tsx': 'Technical event log viewer',
        'BottomToolbar.tsx': 'Connection controls, PTT toggle, audio controls',
        'GuardrailChip.tsx': 'Content moderation result display',
      },
      
      userExperience: {
        greeting: 'Auto-greet on connection',
        conversationModes: {
          continuous: 'Always listening (default)',
          pushToTalk: 'Hold button to speak (optional)',
        },
        visualFeedback: [
          'Connection status indicator',
          'Audio waveform visualization',
          'Agent response streaming',
          'Tool call breadcrumbs',
        ],
        errorHandling: [
          'Microphone permission denied → Show instructions',
          'Connection failed → Retry button',
          'RAG search failed → Graceful fallback',
          'Audio quality issues → Suggest refresh',
        ],
      },
    },
    
    // 7. Conversation Management
    conversationManagement: {
      historyTracking: {
        provider: 'RealtimeSession (automatic)',
        access: 'details.context.history in tool execution',
        format: 'Array<RealtimeItem>',
        usage: [
          'Context-aware follow-up questions',
          'Topic continuity across turns',
          'STAR methodology multi-turn responses',
        ],
      },
      
      breadcrumbSystem: {
        purpose: 'Real-time debugging and transparency',
        implementation: 'details.context.addTranscriptBreadcrumb',
        events: [
          '[RAG Search] - Query sent to Upstash',
          '[Vector Results] - Top results retrieved',
          '[Response Generation] - Groq API called',
          '[RAG Response] - Final answer generated',
          '[Tool Error] - Error details if failure',
        ],
      },
      
      stateManagement: {
        interviewType: 'Detected from conversation context',
        topicTracking: 'Skills, education, projects, goals, leadership',
        escalationTriggers: [
          'Unknown information requested',
          'Sensitive topic (salary specifics, personal info)',
          'Complex technical deep-dive beyond scope',
          'Cultural fit assessment requiring human interaction',
        ],
      },
    },
    
    // 8. Security & Compliance
    security: {
      apiKeyManagement: {
        development: {
          approach: 'Client-side key (NEXT_PUBLIC_OPENAI_API_KEY)',
          pros: ['Fast development', 'Simple setup'],
          cons: ['Key visible in browser', 'Rate limiting harder'],
        },
        production: {
          approach: 'Ephemeral keys from /api/voice-session',
          pros: ['Key never exposed', 'Server controls sessions'],
          cons: ['Extra API call', 'Slightly more complex'],
          recommendation: 'Implement before public launch',
        },
      },
      
      contentModeration: {
        system: 'Guardrails with createModerationGuardrail',
        endpoint: '/api/voice-session/responses',
        classifications: ['NONE', 'OFFENSIVE_GENERAL', 'OFFENSIVE_COMPANY', 'OFF_TOPIC', 'CRITICAL'],
        action: 'Agent responds appropriately based on classification',
      },
      
      dataPrivacy: {
        conversationStorage: 'Client-side only (no server persistence)',
        personalInfo: 'Pearl\'s public professional profile only',
        userInput: 'Not stored beyond session',
        compliance: 'GDPR-friendly (no personal data collection)',
      },
    },
    
    // 9. Performance Optimization
    performance: {
      latencyTargets: {
        toolExecution: '< 2 seconds (RAG search + generation)',
        firstResponse: '< 2 seconds (greeting after connection)',
        audioStreaming: 'Real-time (< 200ms chunks)',
        turnDetection: '< 500ms (silence threshold)',
      },
      
      optimizationStrategies: {
        caching: {
          commonQuestions: 'Cache responses for elevator pitch, skills overview',
          implementation: 'Map<string, string> in tool execution',
          expirationStrategy: 'Session-based (clear on disconnect)',
        },
        vectorSearch: {
          topKReduction: 'Use topK=3 (vs topK=5) for faster queries',
          metadataFiltering: 'Filter by category if context known',
        },
        responseGeneration: {
          tokenLimit: 'max_tokens=150 (concise voice responses)',
          streamingDisabled: 'Use non-streaming for simpler logic (Phase 1)',
        },
      },
      
      monitoring: {
        metrics: [
          'Average tool execution time',
          'RAG search success rate',
          'Conversation duration',
          'User satisfaction (implicit via escalation rate)',
        ],
        logging: {
          breadcrumbs: 'Event panel in UI',
          errors: 'Console.error for debugging',
          analytics: 'Optional: Send to Vercel Analytics',
        },
      },
    },
  },
  
  // Professional Voice Persona Mapping
  voicePersona: {
    baseConfiguration: 'See PROFESSIONAL_VOICE_PERSONA_DESIGN.md',
    
    // Core Characteristics
    identity: 'Pearl\'s professional AI assistant speaking in first person',
    tone: 'Professional yet personable, enthusiastic about technology',
    style: 'Conversational but authoritative about experience',
    pace: 'Moderate (120-140 WPM), clear articulation',
    vocabulary: 'Technical accuracy with accessible explanations',
    
    // Conversation Templates by Type
    conversationTypes: {
      hrScreening: {
        greeting: '"Hi, I\'m Pearl! Thanks for reaching out about the [position]. How can I help you today?"',
        elevatorPitch: '30-45 seconds covering: BSIT major, President\'s Lister, leadership roles, technical skills, career goal',
        topics: ['Experience overview', 'Education', 'Skills', 'Career goals', 'Leadership'],
        responseStyle: 'Concise, metric-driven, professional',
      },
      
      technicalInterview: {
        greeting: '"Hi! I\'m looking forward to diving into the technical aspects. Where would you like to start?"',
        methodology: 'STAR (Situation, Task, Action, Result)',
        topics: ['Project deep-dives', 'Problem-solving approach', 'Technical skills', 'System design'],
        responseStyle: 'Detailed examples, technical accuracy, specific metrics',
      },
      
      behavioralInterview: {
        greeting: '"Hi! I\'m excited to share more about my experience and approach. What would you like to discuss?"',
        methodology: 'STAR with emphasis on leadership and teamwork',
        topics: ['Leadership examples', 'Conflict resolution', 'Failures and learnings', 'Team collaboration'],
        responseStyle: 'Story-based, reflective, demonstrates growth mindset',
      },
      
      careerCoaching: {
        greeting: '"Hi! I\'m excited to talk about career development. I\'d love your insights on my path forward."',
        topics: ['Career planning', 'Skill development priorities', 'Personal branding', 'Industry trends'],
        responseStyle: 'Open, curious, seeking guidance',
      },
      
      salaryNegotiation: {
        greeting: '"Thanks for the offer! I\'m really excited about the opportunity. I\'d like to discuss the compensation package."',
        strategies: ['Anchor high but reasonable', 'Ask questions first', 'Express enthusiasm + gentle push'],
        responseStyle: 'Confident, data-driven, collaborative',
      },
    },
    
    // Response Structures
    responseFrameworks: {
      STAR: {
        components: ['Situation', 'Task', 'Action', 'Result'],
        duration: '45-90 seconds',
        example: 'See PROFESSIONAL_VOICE_PERSONA_DESIGN.md leadership question',
      },
      
      PEE: {
        components: ['Point', 'Evidence', 'Explanation'],
        duration: '30-60 seconds',
        example: 'See PROFESSIONAL_VOICE_PERSONA_DESIGN.md database experience question',
      },
      
      Direct: {
        components: ['Answer', 'One supporting detail'],
        duration: '15-25 seconds',
        example: 'Simple factual questions (graduation date, GPA, etc.)',
      },
    },
    
    // Escalation & Fallback Flows
    escalation: {
      triggers: [
        'Complex technical deep-dive beyond scope',
        'Sensitive topics (salary details, personal info)',
        'Unknown information (RAG returns no results)',
        'Strong cultural fit assessment needed',
      ],
      
      responseTemplate: `
        "That's [great question/important topic/interesting area]. 
        I think you'd get the most valuable conversation by speaking 
        directly with Pearl about [specific topic]. Would you like me 
        to help schedule a call?"
      `,
    },
    
    fallback: {
      ragFailure: '"That\'s an interesting question. While I don\'t have specific details on that aspect, I can tell you [related info]. Would you like me to connect you with Pearl for details?"',
      
      outOfScope: '"That question is outside of Pearl\'s professional background, which focuses on [BSIT, web dev, data analysis]. Is there something about her technical skills or projects I can help with?"',
      
      unclearAudio: '"I\'m sorry, I didn\'t quite catch that. Could you rephrase your question?"',
      
      conversationEnd: '"I\'ve enjoyed our conversation! Do you have any other questions, or would you like me to help schedule a follow-up with Pearl?"',
    },
  },
  
  // Conversation Flow Examples
  conversationFlows: {
    // Example 1: HR Screening Call
    hrScreeningFlow: [
      {
        turn: 1,
        speaker: 'Agent',
        message: 'Hi, I\'m Pearl! Thanks for reaching out about the Data Analyst role. How can I help you today?',
        type: 'greeting',
      },
      {
        turn: 2,
        speaker: 'User',
        message: 'Hi Pearl, I\'d like to learn more about your background and qualifications.',
        type: 'request',
      },
      {
        turn: 3,
        speaker: 'Agent',
        action: 'RAG Search',
        tool: 'searchPearlProfile',
        query: 'User wants background overview',
        message: '[Elevator pitch: 30-45 seconds covering BSIT major, President\'s Lister, projects, leadership, career goal]',
        type: 'elevator_pitch',
      },
      {
        turn: 4,
        speaker: 'User',
        message: 'Tell me about your technical skills, specifically with databases.',
        type: 'technical_question',
      },
      {
        turn: 5,
        speaker: 'Agent',
        action: 'RAG Search',
        tool: 'searchPearlProfile',
        query: 'User asking about database skills',
        message: '[PEE response: MySQL proficiency, Good Moral Application project example, optimization achievements]',
        type: 'technical_answer',
      },
    ],
    
    // Example 2: Technical Interview
    technicalInterviewFlow: [
      {
        turn: 1,
        speaker: 'Agent',
        message: 'Hi! I\'m looking forward to diving into the technical aspects. Where would you like to start?',
        type: 'greeting',
      },
      {
        turn: 2,
        speaker: 'User',
        message: 'Can you walk me through a challenging technical project you\'ve worked on?',
        type: 'behavioral_technical',
      },
      {
        turn: 3,
        speaker: 'Agent',
        action: 'RAG Search',
        tool: 'searchPearlProfile',
        query: 'User asking about challenging technical project',
        message: '[STAR response: Good Moral Application database optimization challenge, 45-90 seconds]',
        type: 'star_response',
      },
      {
        turn: 4,
        speaker: 'User',
        message: 'How did you approach testing and quality assurance?',
        type: 'follow_up',
      },
      {
        turn: 5,
        speaker: 'Agent',
        action: 'RAG Search',
        tool: 'searchPearlProfile',
        query: 'User asking about testing approach',
        message: '[Technical explanation: Testing strategy, incremental approach, user feedback loops]',
        type: 'technical_answer',
      },
    ],
  },
};

/**
 * PHASE 3: Implementation Roadmap
 * Detailed step-by-step implementation plan with time estimates
 */

const implementationRoadmap = [
  {
    phase: 'Phase 1: Setup & Configuration',
    duration: '30-60 minutes',
    status: '✅ PARTIALLY COMPLETE',
    tasks: [
      {
        task: 'Install dependencies',
        status: '✅ DONE',
        details: '@openai/agents, uuid, zod, @radix-ui/react-icons',
        verification: 'Check package.json',
      },
      {
        task: 'Configure environment variables',
        status: '✅ DONE',
        details: 'OPENAI_API_KEY, NEXT_PUBLIC_OPENAI_API_KEY, GROQ_API_KEY, UPSTASH credentials',
        verification: 'Check .env.local',
      },
      {
        task: 'Voice UI route setup',
        status: '✅ DONE',
        details: '/voice route with VoiceApp component, context providers',
        verification: 'Visit http://localhost:3000/voice',
      },
      {
        task: 'Add voice button to homepage',
        status: '✅ DONE',
        details: '"Talk with Pearl.AI" button linking to /voice',
        verification: 'Check components/welcome-to-digital-twin.tsx',
      },
    ],
    nextSteps: [
      'Create professional agent configuration',
      'Implement RAG search tool',
    ],
  },
  
  {
    phase: 'Phase 2: Professional Agent Development',
    duration: '3-4 hours',
    status: '⏭️ CURRENT PHASE',
    tasks: [
      {
        task: 'Create agent configuration directory',
        status: '🔲 TODO',
        details: 'mkdir app/agentConfigs/professionalDigitalTwin',
        command: 'mkdir app\\agentConfigs\\professionalDigitalTwin',
        estimatedTime: '1 minute',
      },
      {
        task: 'Implement searchPearlProfile tool',
        status: '🔲 TODO',
        details: 'Upstash Vector query + Groq response generation',
        codeFile: 'app/agentConfigs/professionalDigitalTwin/index.ts',
        estimatedTime: '1.5 hours',
        subTasks: [
          'Import Upstash Vector and Groq SDKs',
          'Create tool with proper schema',
          'Implement vector search (topK=3)',
          'Format context from search results',
          'Call Groq with voice-optimized params (max_tokens=150)',
          'Add breadcrumb logging',
          'Implement error handling',
        ],
      },
      {
        task: 'Define pearlGreeterAgent',
        status: '🔲 TODO',
        details: 'RealtimeAgent with professional persona instructions',
        codeFile: 'app/agentConfigs/professionalDigitalTwin/index.ts',
        estimatedTime: '1.5 hours',
        subTasks: [
          'Copy persona templates from PROFESSIONAL_VOICE_PERSONA_DESIGN.md',
          'Configure agent (name, voice, instructions)',
          'Attach searchPearlProfile tool',
          'Add conversation templates for different scenarios',
          'Include escalation rules',
          'Define filler phrases',
        ],
      },
      {
        task: 'Register professional agent',
        status: '🔲 TODO',
        details: 'Add to allAgentSets and set as default',
        codeFile: 'app/agentConfigs/index.ts',
        estimatedTime: '15 minutes',
        subTasks: [
          'Import professionalDigitalTwinScenario',
          'Add to allAgentSets map',
          'Set defaultAgentSetKey = "professionalDigitalTwin"',
          'Export company name for guardrails',
        ],
      },
      {
        task: 'Update VoiceApp.tsx',
        status: '🔲 TODO',
        details: 'Add professional agent to scenario map',
        codeFile: 'app/voice/VoiceApp.tsx',
        estimatedTime: '15 minutes',
        subTasks: [
          'Import professionalDigitalTwinScenario',
          'Add to sdkScenarioMap',
          'Add company name to guardrail map',
        ],
      },
    ],
    deliverables: [
      'app/agentConfigs/professionalDigitalTwin/index.ts',
      'Updated app/agentConfigs/index.ts',
      'Updated app/voice/VoiceApp.tsx',
    ],
  },
  
  {
    phase: 'Phase 3: Testing & Validation',
    duration: '2-3 hours',
    status: '⏭️ NEXT',
    tasks: [
      {
        task: 'Manual conversation testing',
        status: '🔲 TODO',
        details: 'Test all conversation scenarios',
        estimatedTime: '1.5 hours',
        testCases: [
          'Greeting: "Hi" → Professional intro',
          'Skills: "What are your technical skills?" → RAG search → Accurate response',
          'Education: "Tell me about your education" → RAG search → President\'s Lister mention',
          'Career goal: "What\'s your career goal?" → Data Analyst with AI workshop',
          'Leadership: "What leadership experience?" → JPCS President, Student Gov',
          'Projects: "Tell me about your projects" → Good Moral Application',
          'Interruption test → Agent stops gracefully',
          'Unclear question → Clarification request',
          'Out of scope → Polite redirect',
          'Unknown info → Escalation to human Pearl',
        ],
      },
      {
        task: 'Audio quality validation',
        status: '🔲 TODO',
        details: 'Verify professional audio delivery',
        estimatedTime: '30 minutes',
        checks: [
          'Clear voice output (no distortion)',
          'Appropriate speaking pace (120-140 WPM)',
          'Natural prosody and intonation',
          'Echo cancellation working',
          'Background noise suppressed',
          'Filler phrases sound natural',
        ],
      },
      {
        task: 'Response accuracy verification',
        status: '🔲 TODO',
        details: 'Cross-check responses vs Pearl\'s actual background',
        estimatedTime: '45 minutes',
        validation: [
          'No hallucinations or fabricated information',
          'Metrics match data/digitaltwin.json',
          'Project descriptions accurate',
          'Leadership roles correctly stated',
          'Technical skills properly represented',
          'Career goal correctly positioned (Data Analyst)',
        ],
      },
      {
        task: 'Event log verification',
        status: '🔲 TODO',
        details: 'Monitor Events panel for proper tool execution',
        estimatedTime: '15 minutes',
        expectedEvents: [
          '[RAG Search] breadcrumbs with query',
          '[RAG Response] breadcrumbs with answer',
          'Tool execution time < 2 seconds',
          'No console errors',
        ],
      },
    ],
    successCriteria: {
      functional: [
        '✅ Voice conversation starts without errors',
        '✅ Professional greeting delivered',
        '✅ RAG tool queries Upstash successfully',
        '✅ Responses accurate to Pearl\'s background',
      ],
      quality: [
        '✅ Audio clear and professional',
        '✅ Responses sound natural (not robotic)',
        '✅ Latency under 2 seconds',
        '✅ No hallucinations or inaccuracies',
      ],
    },
  },
  
  {
    phase: 'Phase 4: Production Deployment',
    duration: '1-2 hours',
    status: '⏭️ AFTER TESTING',
    tasks: [
      {
        task: 'Implement ephemeral API keys',
        status: '🔲 TODO (Optional for PoC)',
        details: 'Create /api/voice-session endpoint for secure key generation',
        estimatedTime: '45 minutes',
        priority: 'Medium (can defer to post-PoC)',
      },
      {
        task: 'Add response caching',
        status: '🔲 TODO (Optional)',
        details: 'Cache common queries like elevator pitch',
        estimatedTime: '30 minutes',
        priority: 'Low (optimization)',
      },
      {
        task: 'Commit and push to GitHub',
        status: '🔲 TODO',
        details: 'Git commit with clear message',
        estimatedTime: '5 minutes',
        commands: [
          'git add app/agentConfigs/professionalDigitalTwin/',
          'git commit -m "Add professional digital twin voice agent with RAG integration"',
          'git push origin main',
        ],
      },
      {
        task: 'Verify Vercel deployment',
        status: '🔲 TODO',
        details: 'Test at production URL',
        estimatedTime: '10 minutes',
        url: 'https://digital-twin-nextjs-rdii.vercel.app/voice',
        verification: [
          'Voice UI loads without errors',
          'Can connect and have conversation',
          'RAG tool works in production',
          'Audio quality maintained',
        ],
      },
    ],
    deliverables: [
      'Production-ready voice AI at /voice route',
      'GitHub repository updated',
      'Vercel deployment successful',
    ],
  },
  
  {
    phase: 'Phase 5: Future Enhancements',
    duration: 'Ongoing',
    status: '📋 BACKLOG',
    enhancements: [
      {
        enhancement: 'MCP Server Integration',
        priority: 'Medium',
        description: 'Connect voice AI to existing MCP server instead of direct RAG calls',
        benefits: ['Unified backend', 'Shared conversation history', 'Centralized knowledge management'],
        estimatedEffort: '4-6 hours',
      },
      {
        enhancement: 'Bilingual Support (Tagalog)',
        priority: 'Medium',
        description: 'Add Tagalog language support for voice responses',
        benefits: ['Broader accessibility', 'Local market advantage', 'Cultural authenticity'],
        estimatedEffort: '6-8 hours',
      },
      {
        enhancement: 'Interview Scenario Modes',
        priority: 'High',
        description: 'Dedicated modes for HR screening, technical, behavioral interviews',
        benefits: ['Targeted practice', 'Context-specific responses', 'Better user experience'],
        estimatedEffort: '8-10 hours',
      },
      {
        enhancement: 'Analytics Dashboard',
        priority: 'Low',
        description: 'Track conversation metrics, common questions, escalation rates',
        benefits: ['Performance insights', 'Continuous improvement', 'Usage patterns'],
        estimatedEffort: '6-8 hours',
      },
      {
        enhancement: 'Custom Voice Training',
        priority: 'Low',
        description: 'Fine-tune voice model to sound more like Pearl',
        benefits: ['Personalized experience', 'Brand consistency', 'Unique differentiator'],
        estimatedEffort: '12-16 hours (research + implementation)',
      },
    ],
  },
];

/**
 * PHASE 4: Cost Analysis & Projections
 */

const costAnalysis = {
  // OpenAI Realtime API Pricing
  openAIRealtimeAPI: {
    model: 'gpt-4o-realtime-preview-2024-12-17',
    pricing: {
      audioInput: '$0.06 / minute',
      audioOutput: '$0.24 / minute',
      textInput: '$2.50 / 1M tokens',
      textOutput: '$10.00 / 1M tokens',
    },
    
    estimatedUsage: {
      averageConversationDuration: '5 minutes',
      audioInputPerConversation: 5 * 0.06, // $0.30
      audioOutputPerConversation: 5 * 0.24, // $1.20
      totalPerConversation: 0.30 + 1.20, // $1.50
    },
    
    monthlyProjections: {
      light: {
        conversations: 10,
        cost: 10 * 1.50, // $15.00
      },
      moderate: {
        conversations: 50,
        cost: 50 * 1.50, // $75.00
      },
      heavy: {
        conversations: 100,
        cost: 100 * 1.50, // $150.00
      },
    },
  },
  
  // Groq API Pricing (for RAG response generation)
  groqAPI: {
    model: 'llama-3.1-8b-instant',
    pricing: {
      inputTokens: '$0.05 / 1M tokens',
      outputTokens: '$0.08 / 1M tokens',
    },
    
    estimatedUsage: {
      averageToolCallsPerConversation: 3,
      inputTokensPerCall: 500, // Context from vector search
      outputTokensPerCall: 150, // Voice-optimized response
      totalTokensPerConversation: (500 + 150) * 3, // 1,950 tokens
      costPerConversation: ((500 * 3) / 1_000_000) * 0.05 + ((150 * 3) / 1_000_000) * 0.08, // ~$0.00011
    },
    
    monthlyProjections: {
      light: {
        conversations: 10,
        cost: 10 * 0.00011, // $0.0011 (negligible)
      },
      moderate: {
        conversations: 50,
        cost: 50 * 0.00011, // $0.0055 (negligible)
      },
      heavy: {
        conversations: 100,
        cost: 100 * 0.00011, // $0.011 (negligible)
      },
    },
  },
  
  // Upstash Vector Pricing
  upstashVector: {
    plan: 'Pay as you go',
    pricing: {
      queries: '$0.40 / 100K queries',
      storage: 'Free for <10K vectors',
    },
    
    estimatedUsage: {
      queriesPerConversation: 3, // 3 RAG searches
      costPerQuery: 0.40 / 100_000, // $0.000004
      costPerConversation: 3 * (0.40 / 100_000), // $0.000012
    },
    
    monthlyProjections: {
      light: {
        conversations: 10,
        queries: 30,
        cost: 0.0001, // Negligible
      },
      moderate: {
        conversations: 50,
        queries: 150,
        cost: 0.0006, // Negligible
      },
      heavy: {
        conversations: 100,
        queries: 300,
        cost: 0.0012, // Negligible
      },
    },
  },
  
  // Total Monthly Cost Projections
  totalMonthlyProjections: {
    light: {
      conversations: 10,
      openAI: 15.00,
      groq: 0.001,
      upstash: 0.0001,
      total: 15.00, // Dominated by OpenAI Realtime API
    },
    moderate: {
      conversations: 50,
      openAI: 75.00,
      groq: 0.006,
      upstash: 0.0006,
      total: 75.01,
    },
    heavy: {
      conversations: 100,
      openAI: 150.00,
      groq: 0.011,
      upstash: 0.0012,
      total: 150.01,
    },
  },
  
  // Cost Optimization Strategies
  optimizationStrategies: [
    {
      strategy: 'Response Caching',
      description: 'Cache common queries like elevator pitch, skills overview',
      potentialSavings: '20-30% reduction in tool calls',
      implementation: 'Map<string, string> cache in tool execution',
    },
    {
      strategy: 'Shorter Conversations',
      description: 'Guide users to specific questions vs open-ended chats',
      potentialSavings: '30-40% reduction in conversation duration',
      implementation: 'UI prompts, conversation templates',
    },
    {
      strategy: 'Free Tier Usage',
      description: 'Use Groq and Upstash free tiers fully before paid usage',
      potentialSavings: 'Groq/Upstash costs effectively $0 for moderate usage',
      note: 'Already negligible costs',
    },
  ],
  
  // Conclusion
  costSummary: {
    dominantCost: 'OpenAI Realtime API ($1.50 per 5-minute conversation)',
    negligibleCosts: 'Groq and Upstash are effectively free for this use case',
    recommendation: 'Monitor OpenAI usage, optimize conversation duration',
    acceptableRange: '$15-75/month for typical usage (10-50 conversations)',
  },
};

/**
 * PHASE 5: Testing Framework & Quality Assurance
 */

const testingFramework = {
  // Manual Testing Checklist
  manualTesting: {
    conversationScenarios: [
      {
        scenario: 'Basic Greeting',
        userInput: 'Hi',
        expectedBehavior: 'Professional greeting with offer to help',
        expectedDuration: '10-15 seconds',
        validation: 'Greeting mentions Pearl, is warm and professional',
      },
      {
        scenario: 'Elevator Pitch',
        userInput: 'Tell me about yourself',
        expectedBehavior: 'RAG search → 30-45 second elevator pitch',
        expectedDuration: '35-50 seconds',
        validation: 'Mentions BSIT, President\'s Lister, skills, career goal',
      },
      {
        scenario: 'Technical Skills',
        userInput: 'What are your technical skills?',
        expectedBehavior: 'RAG search → Technical skills overview with specifics',
        expectedDuration: '25-35 seconds',
        validation: 'Mentions C++, JavaScript (Cisco), Laravel, SQL',
      },
      {
        scenario: 'Project Deep-Dive',
        userInput: 'Tell me about the Good Moral Application project',
        expectedBehavior: 'RAG search → STAR or detailed technical explanation',
        expectedDuration: '45-75 seconds',
        validation: 'Laravel, SQL, decision support, metrics mentioned',
      },
      {
        scenario: 'Leadership Experience',
        userInput: 'What leadership experience do you have?',
        expectedBehavior: 'RAG search → STAR response with JPCS and Student Gov',
        expectedDuration: '45-75 seconds',
        validation: 'JPCS President, Student Gov Executive Secretary, mentorship program',
      },
      {
        scenario: 'Career Goal',
        userInput: 'What\'s your career goal?',
        expectedBehavior: 'RAG search → Data Analyst with AI workshop mention',
        expectedDuration: '25-35 seconds',
        validation: 'Data Analyst, AI Data Analyst workshop, combines programming + data',
      },
      {
        scenario: 'Interruption Test',
        userInput: '[Interrupt agent mid-response]',
        expectedBehavior: 'Agent stops speaking, acknowledges interruption',
        expectedDuration: 'Immediate',
        validation: 'Clean stop, no audio artifacts, ready for new input',
      },
      {
        scenario: 'Clarification Request',
        userInput: 'Can you repeat that?',
        expectedBehavior: 'Agent repeats last substantive answer naturally',
        expectedDuration: 'Same as original',
        validation: 'Repeats content without saying "I already said..." (natural variation)',
      },
      {
        scenario: 'Out of Scope',
        userInput: 'What\'s the weather like?',
        expectedBehavior: 'Polite redirect to Pearl-related topics',
        expectedDuration: '10-15 seconds',
        validation: 'Acknowledges question, redirects professionally',
      },
      {
        scenario: 'Unknown Information',
        userInput: 'Tell me about your experience with Kubernetes',
        expectedBehavior: 'RAG search returns no results → Escalation offer',
        expectedDuration: '15-20 seconds',
        validation: 'Admits lack of info, offers to connect with real Pearl',
      },
    ],
    
    audioQualityChecks: [
      {
        check: 'Voice Clarity',
        validation: 'No distortion, static, or artifacts',
        method: 'Listen to full conversation',
      },
      {
        check: 'Speaking Pace',
        validation: '120-140 words per minute (moderate)',
        method: 'Count words in 60-second sample',
      },
      {
        check: 'Prosody & Intonation',
        validation: 'Natural rising/falling tones, emphasis on key points',
        method: 'Listen for robotic vs. conversational delivery',
      },
      {
        check: 'Echo Cancellation',
        validation: 'No echo or feedback loop',
        method: 'Test in various environments (quiet, moderate noise)',
      },
      {
        check: 'Background Noise Suppression',
        validation: 'Agent voice clear even with background sounds',
        method: 'Introduce controlled background noise',
      },
      {
        check: 'Filler Phrase Naturalness',
        validation: 'Fillers like "Let me check..." sound authentic',
        method: 'Listen for awkward pauses or robotic transitions',
      },
    ],
    
    accuracyValidation: [
      {
        aspect: 'Educational Background',
        source: 'data/digitaltwin.json',
        validation: 'BSIT at St. Paul University, Web & App Dev major, President\'s Lister, graduation 2026',
      },
      {
        aspect: 'Technical Skills',
        source: 'data/digitaltwin.json',
        validation: 'C++ (Cisco), JavaScript (Cisco), Laravel, HTML/CSS, SQL, Python (learning)',
      },
      {
        aspect: 'Leadership Roles',
        source: 'data/digitaltwin.json',
        validation: 'JPCS President, Student Gov Executive Secretary',
      },
      {
        aspect: 'Projects',
        source: 'data/digitaltwin.json',
        validation: 'Good Moral Application and Monitoring System (Laravel + SQL)',
      },
      {
        aspect: 'Career Goal',
        source: 'data/digitaltwin.json',
        validation: 'Data Analyst (not "Data Analyst or Software Engineer"), AI Data Analyst workshop',
      },
      {
        aspect: 'Metrics',
        source: 'data/digitaltwin.json',
        validation: '80% mentorship participation, query optimization results, etc.',
      },
    ],
  },
  
  // Event Log Verification
  eventLogVerification: {
    expectedEvents: [
      {
        event: '[RAG Search]',
        trigger: 'When searchPearlProfile tool called',
        data: 'User query',
        validation: 'Query text matches user question',
      },
      {
        event: '[Vector Results]',
        trigger: 'After Upstash Vector search',
        data: 'Number of results, top score',
        validation: 'Results count = topK (3), scores reasonable',
      },
      {
        event: '[Response Generation]',
        trigger: 'Before Groq API call',
        data: 'Context sent to Groq',
        validation: 'Context is relevant to query',
      },
      {
        event: '[RAG Response]',
        trigger: 'After Groq generates answer',
        data: 'Generated answer text',
        validation: 'Answer is concise, accurate, voice-friendly',
      },
      {
        event: '[Tool Error]',
        trigger: 'If RAG tool fails',
        data: 'Error message and details',
        validation: 'Graceful fallback response provided',
      },
    ],
    
    performanceMetrics: [
      {
        metric: 'Tool Execution Time',
        target: '< 2 seconds',
        measurement: 'Time from [RAG Search] to [RAG Response]',
      },
      {
        metric: 'First Response Time',
        target: '< 2 seconds',
        measurement: 'Time from connection to greeting',
      },
      {
        metric: 'Turn Detection Latency',
        target: '< 500ms',
        measurement: 'Time from user stops speaking to agent starts',
      },
    ],
  },
  
  // Success Criteria
  successCriteria: {
    pocReady: {
      functional: [
        '✅ Voice conversation initiates without errors',
        '✅ Professional greeting delivered automatically',
        '✅ RAG tool successfully queries Upstash Vector',
        '✅ Groq generates accurate responses',
        '✅ Responses match Pearl\'s actual background',
      ],
      quality: [
        '✅ Audio quality clear and professional',
        '✅ Responses sound natural (not robotic)',
        '✅ Appropriate pacing and intonation',
        '✅ Latency under 2 seconds for responses',
        '✅ No hallucinations or fabricated information',
      ],
      technical: [
        '✅ No console errors during conversation',
        '✅ Event logs show proper tool execution',
        '✅ Conversation history maintained correctly',
        '✅ Browser permissions handled smoothly',
      ],
    },
    
    productionReady: {
      security: [
        '✅ Ephemeral API keys implemented',
        '✅ API keys not exposed to client',
        '✅ Rate limiting in place',
      ],
      reliability: [
        '✅ Error handling for RAG failures',
        '✅ Fallback responses for edge cases',
        '✅ Graceful degradation if services down',
      ],
      scalability: [
        '✅ Response caching implemented',
        '✅ Vector search optimized',
        '✅ Monitoring and logging in place',
      ],
      userExperience: [
        '✅ User testing completed (5+ people)',
        '✅ Feedback incorporated into persona',
        '✅ Clear escalation paths to human Pearl',
        '✅ Conversation ending feels natural',
      ],
    },
  },
};

/**
 * PHASE 6: Risk Assessment & Mitigation
 */

const riskAssessment = {
  technicalRisks: [
    {
      risk: 'RAG Tool Latency',
      impact: 'High',
      probability: 'Medium',
      description: 'Vector search + Groq generation takes >2 seconds',
      mitigation: [
        'Optimize topK to 3 (faster queries)',
        'Reduce max_tokens to 150 (faster generation)',
        'Implement response caching for common queries',
        'Monitor and alert on slow responses',
      ],
    },
    {
      risk: 'Audio Quality Issues',
      impact: 'High',
      probability: 'Low',
      description: 'Poor audio quality, echo, background noise',
      mitigation: [
        'Use WebRTC with built-in echo cancellation',
        'Enable noise suppression and auto gain control',
        'Test in various environments before launch',
        'Provide troubleshooting guide for users',
      ],
    },
    {
      risk: 'Inaccurate Responses',
      impact: 'Critical',
      probability: 'Low',
      description: 'Agent provides incorrect information about Pearl',
      mitigation: [
        'ALWAYS use RAG for factual questions (never rely on training data)',
        'Cross-validate responses against data/digitaltwin.json',
        'Implement strict "no hallucination" instructions',
        'Regular accuracy audits of conversations',
      ],
    },
    {
      risk: 'API Rate Limiting',
      impact: 'Medium',
      probability: 'Low',
      description: 'OpenAI/Groq/Upstash rate limits exceeded',
      mitigation: [
        'Monitor API usage dashboards',
        'Implement client-side rate limiting',
        'Graceful error messages if limits hit',
        'Upgrade to paid tiers if needed',
      ],
    },
  ],
  
  userExperienceRisks: [
    {
      risk: 'Robotic Delivery',
      impact: 'Medium',
      probability: 'Medium',
      description: 'Voice sounds unnatural or stiff',
      mitigation: [
        'Use conversational instructions (see PROFESSIONAL_VOICE_PERSONA_DESIGN.md)',
        'Add strategic filler phrases',
        'Vary language to avoid repetition',
        'Test with multiple people for feedback',
      ],
    },
    {
      risk: 'User Confusion',
      impact: 'Medium',
      probability: 'Low',
      description: 'Users unsure how to interact or what to ask',
      mitigation: [
        'Clear UI instructions on first use',
        'Agent proactively suggests topics',
        'Example questions displayed',
        'Smooth escalation to human Pearl when needed',
      ],
    },
    {
      risk: 'Microphone Permission Issues',
      impact: 'High',
      probability: 'Medium',
      description: 'Users deny microphone access or have setup problems',
      mitigation: [
        'Clear permission request messaging',
        'Troubleshooting guide for common issues',
        'Fallback to text input if audio unavailable',
        'Test across browsers (Chrome, Firefox, Safari)',
      ],
    },
  ],
  
  businessRisks: [
    {
      risk: 'High Costs',
      impact: 'Medium',
      probability: 'Low',
      description: 'OpenAI Realtime API costs exceed budget',
      mitigation: [
        'Set usage alerts at $50, $100, $150/month',
        'Implement caching to reduce API calls',
        'Monitor cost per conversation',
        'Optimize conversation duration guidance',
      ],
    },
    {
      risk: 'Privacy Concerns',
      impact: 'Low',
      probability: 'Low',
      description: 'Users worry about conversation data storage',
      mitigation: [
        'Clear privacy policy (no conversation storage)',
        'Client-side only conversation history',
        'No personal user data collected',
        'Transparent about AI usage',
      ],
    },
  ],
};

// Export all planning components
module.exports = {
  comprehensiveResearchPrompt,
  voiceAIArchitecture,
  implementationRoadmap,
  costAnalysis,
  testingFramework,
  riskAssessment,
};

// Usage instructions
console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║            VOICE AI INTEGRATION PLANNING & ARCHITECTURE                    ║
║                 Complete Implementation Framework                          ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

📋 This file provides comprehensive planning for Pearl's voice AI integration.

🎯 CURRENT PHASE: Phase 2 - Professional Agent Development
   Estimated time: 3-4 hours

📚 Key Resources:
   1. PROFESSIONAL_VOICE_PERSONA_DESIGN.md - Persona templates and conversation flows
   2. AGENT_ARCHITECTURE_GUIDE.md - Agent patterns and implementation details
   3. VOICE_AI_QUICK_REFERENCE.md - Quick start code templates
   4. OPENAI_AGENTS_SDK_RESEARCH.md - SDK deep dive and best practices

🚀 Next Action:
   Create app/agentConfigs/professionalDigitalTwin/index.ts
   
   Steps:
   1. mkdir app\\agentConfigs\\professionalDigitalTwin
   2. Create index.ts with searchPearlProfile tool
   3. Define pearlGreeterAgent with persona instructions
   4. Register in app/agentConfigs/index.ts
   5. Test at /voice route

💰 Cost Projection:
   Light usage (10 conversations/month): ~$15
   Moderate usage (50 conversations/month): ~$75
   Heavy usage (100 conversations/month): ~$150
   
   Dominated by OpenAI Realtime API ($1.50 per 5-minute conversation)
   Groq and Upstash costs are negligible (<$0.01/month)

✅ Success Criteria (PoC Ready):
   - Voice conversation starts without errors
   - Professional greeting delivered
   - RAG tool queries Upstash successfully
   - Responses accurate to Pearl's background
   - Audio quality clear and professional
   - Latency under 2 seconds

📖 For detailed implementation guidance, copy 'comprehensiveResearchPrompt' 
   to ChatGPT or Claude.

🎤 Ready to build Pearl's professional voice AI!
`);
