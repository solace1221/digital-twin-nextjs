// Follow-up Question Generator for Pearl's Digital Twin
// Generates contextual, multi-paragraph follow-up questions to encourage detailed responses

import { GroqLLMClient } from './groq-client';

export interface FollowUpOptions {
  conversationHistory?: Array<{ role: string; content: string }>;
  topic?: string;
  depth?: 'shallow' | 'moderate' | 'deep';
  temperature?: number;
}

export interface FollowUpResult {
  followUpQuestion: string;
  suggestedTopics: string[];
  conversationContext: string;
}

export class FollowUpQuestionGenerator {
  private groq: GroqLLMClient;

  constructor() {
    this.groq = new GroqLLMClient();
  }

  /**
   * Generate a contextual follow-up question based on user's response
   * @param userResponse - The user's most recent message
   * @param previousQuestion - The question that was asked before the user's response
   * @param options - Configuration options for follow-up generation
   */
  async generateFollowUp(
    userResponse: string,
    previousQuestion: string,
    options: FollowUpOptions = {}
  ): Promise<FollowUpResult> {
    try {
      // Detect if user wants more elaboration
      const wantsMore = this.detectElaborationRequest(userResponse);
      
      // Detect if response is vague or short
      const isVague = this.isVagueResponse(userResponse);
      
      // Build conversation context
      const conversationContext = this.buildConversationContext(
        options.conversationHistory || []
      );

      // Create system prompt for follow-up generation
      const systemPrompt = this.buildSystemPrompt(wantsMore, isVague, options.depth || 'moderate');

      // Create user prompt with context
      const userPrompt = this.buildUserPrompt(
        previousQuestion,
        userResponse,
        conversationContext,
        wantsMore,
        isVague
      );

      // Generate follow-up question
      const followUpQuestion = await this.groq.generateResponse([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], {
        temperature: options.temperature || 0.8,
        maxTokens: 500
      });

      // Extract suggested topics from the response
      const suggestedTopics = this.extractTopics(userResponse, previousQuestion);

      return {
        followUpQuestion: followUpQuestion.trim(),
        suggestedTopics,
        conversationContext
      };
    } catch (error) {
      console.error('[Follow-Up Generator] Error generating follow-up:', error);
      throw new Error(`Failed to generate follow-up question: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a follow-up for initial greeting/achievement question
   */
  async generateInitialFollowUp(initialTopic: string): Promise<string> {
    const systemPrompt = `You are an empathetic interviewer having a natural conversation. Generate a warm, engaging follow-up question that:
1. Is 2-3 paragraphs long
2. Starts by acknowledging what was just shared
3. Asks deeper, meaningful questions about the topic
4. Encourages detailed, thoughtful responses
5. Feels natural and conversational, not formal or robotic

The follow-up should maintain a neutral, general tone suitable for various topics (achievements, experiences, challenges, hobbies, opinions).`;

    const userPrompt = `The conversation topic is: ${initialTopic}

Generate a thoughtful 2-3 paragraph follow-up question that explores this topic more deeply.`;

    try {
      const response = await this.groq.generateResponse([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], {
        temperature: 0.8,
        maxTokens: 400
      });

      return response.trim();
    } catch (error) {
      console.error('[Follow-Up Generator] Error in initial follow-up:', error);
      // Fallback to generic follow-up
      return this.getGenericFollowUp(initialTopic);
    }
  }

  /**
   * Detect if user is asking for more information
   */
  private detectElaborationRequest(userResponse: string): boolean {
    const elaborationKeywords = [
      'tell me more',
      'elaborate',
      'explain',
      'details',
      'continue',
      'go on',
      'more about',
      'what else',
      'can you share more',
      'i\'d like to know more',
      'sabihin mo pa', // Tagalog
      'kwento mo pa',
      'ano pa',
      'iba pa'
    ];

    const lowerResponse = userResponse.toLowerCase().trim();
    return elaborationKeywords.some(keyword => lowerResponse.includes(keyword));
  }

  /**
   * Detect if response is vague or too short
   */
  private isVagueResponse(userResponse: string): boolean {
    const words = userResponse.trim().split(/\s+/);
    
    // Consider vague if:
    // 1. Less than 10 words
    // 2. Contains mostly generic words
    if (words.length < 10) {
      return true;
    }

    const vaguePatterns = [
      /^(yes|no|maybe|ok|okay|sure|fine|good|great|nice)\b/i,
      /^(oo|hindi|siguro|sige|ayos)\b/i, // Tagalog
      /\b(i don't know|not sure|dunno|walang alam)\b/i
    ];

    return vaguePatterns.some(pattern => pattern.test(userResponse.toLowerCase()));
  }

  /**
   * Build conversation context from history
   */
  private buildConversationContext(history: Array<{ role: string; content: string }>): string {
    if (history.length === 0) {
      return 'This is the beginning of the conversation.';
    }

    // Get last 3 exchanges for context
    const recentHistory = history.slice(-6); // 3 user + 3 assistant messages
    
    return recentHistory
      .map((msg, idx) => `${msg.role === 'user' ? 'User' : 'Pearl'}: ${msg.content}`)
      .join('\n');
  }

  /**
   * Build system prompt for follow-up generation
   */
  private buildSystemPrompt(wantsMore: boolean, isVague: boolean, depth: string): string {
    let basePrompt = `You are Pearl's AI digital twin engaging in a natural, thoughtful conversation. Your role is to generate follow-up questions that:

1. **Acknowledge the user's response** - Start by reflecting on or acknowledging what they just shared
2. **Ask deeper questions** - Move the conversation forward with meaningful, thought-provoking questions
3. **Be 2-3 paragraphs long** - Not short sentences, but well-developed paragraphs with natural transitions
4. **Encourage elaboration** - Ask open-ended questions that invite detailed, thoughtful answers
5. **Match the tone and style** of Pearl's professional yet personable communication
6. **Stay relevant** - Connect directly to what the user just said
7. **Be conversational** - Feel natural, not robotic or overly formal

CRITICAL FORMATTING:
- Write 2-3 coherent paragraphs
- Each paragraph should be 3-5 sentences
- Use natural transitions between ideas
- Avoid yes/no questions - ask "why," "how," "what was it like," "can you describe"
- No bullet points or lists - conversational prose only`;

    if (wantsMore) {
      basePrompt += `\n\nThe user is asking for MORE information on the same topic. Continue exploring this topic with deeper, more specific questions about aspects not yet covered.`;
    }

    if (isVague) {
      basePrompt += `\n\nThe user's response was brief or vague. Ask follow-up questions that help them elaborate, explain their thinking, or share specific examples and details.`;
    }

    if (depth === 'deep') {
      basePrompt += `\n\nGo DEEP - ask about underlying motivations, feelings, lessons learned, impact on their life, or how this connects to their larger goals.`;
    } else if (depth === 'shallow') {
      basePrompt += `\n\nKeep it lighter - ask about surface-level details, specific facts, or concrete examples without getting too philosophical.`;
    }

    return basePrompt;
  }

  /**
   * Build user prompt with full context
   */
  private buildUserPrompt(
    previousQuestion: string,
    userResponse: string,
    conversationContext: string,
    wantsMore: boolean,
    isVague: boolean
  ): string {
    let prompt = `CONVERSATION CONTEXT:
${conversationContext}

PREVIOUS QUESTION:
${previousQuestion}

USER'S RESPONSE:
${userResponse}

ANALYSIS:
- User wants more elaboration: ${wantsMore ? 'YES' : 'NO'}
- Response was vague/short: ${isVague ? 'YES' : 'NO'}

TASK:
Generate a 2-3 paragraph follow-up question that:`;

    if (wantsMore) {
      prompt += `
1. Acknowledges their interest in learning more
2. Dives deeper into the same topic with NEW angles they haven't explored yet
3. Asks about specific aspects, examples, or implications`;
    } else if (isVague) {
      prompt += `
1. Gently acknowledges their response
2. Encourages them to elaborate with specific examples
3. Asks follow-up questions that help them share more details about their experience or perspective`;
    } else {
      prompt += `
1. Reflects on what they just shared
2. Asks deeper questions that explore WHY, HOW, or WHAT IT MEANT
3. Connects to related aspects they might find interesting to discuss`;
    }

    prompt += `\n\nWrite the follow-up question now (2-3 paragraphs, conversational tone):`;

    return prompt;
  }

  /**
   * Extract potential topics from user's response
   */
  private extractTopics(userResponse: string, previousQuestion: string): string[] {
    // Simple keyword extraction (can be enhanced with NLP)
    const topics: string[] = [];
    
    // Common topic keywords
    const topicKeywords = [
      'achievement', 'project', 'challenge', 'experience', 'skill',
      'learning', 'growth', 'teamwork', 'leadership', 'problem-solving',
      'career', 'education', 'goal', 'passion', 'hobby'
    ];

    const combinedText = `${previousQuestion} ${userResponse}`.toLowerCase();
    
    topicKeywords.forEach(keyword => {
      if (combinedText.includes(keyword)) {
        topics.push(keyword);
      }
    });

    return topics.slice(0, 5); // Return top 5 topics
  }

  /**
   * Generic follow-up question fallback
   */
  private getGenericFollowUp(topic: string): string {
    const genericFollowUps = [
      `That's really interesting! I'd love to hear more about ${topic}. What specific aspects of this experience stand out most to you when you reflect on it now? What made it particularly meaningful or challenging?\n\nAs you think back on this, what were some of the key moments that really defined your journey? I'm curious to understand not just what happened, but how it shaped your perspective or approach to similar situations today. What lessons or insights did you take away that you still carry with you?`,
      
      `Thank you for sharing about ${topic}. I'm intrigued by what you've mentioned so far. Can you walk me through more of the details? What was going through your mind during this experience, and how did you approach the different challenges or opportunities that came up?\n\nI'd also be interested to know how this connects to other areas of your life or work. Did this experience influence your goals, values, or the way you approach new situations? What would you say was the most significant impact this had on you, both at the time and in the long run?`,
      
      `I appreciate you opening up about ${topic}. It sounds like there's quite a bit more to explore here. What were some of the specific moments or decisions that really mattered during this experience? How did you navigate through the different phases or challenges?\n\nLooking back now, what stands out most about this journey? Are there particular aspects you're especially proud of, or things you learned that surprised you? I'm curious to understand how this experience has influenced your thinking or shaped who you are today.`
    ];

    // Return a random generic follow-up
    return genericFollowUps[Math.floor(Math.random() * genericFollowUps.length)];
  }

  /**
   * Generate follow-up for specific interview scenarios
   */
  async generateInterviewFollowUp(
    scenario: 'achievement' | 'challenge' | 'leadership' | 'technical' | 'career',
    userResponse: string,
    previousQuestion: string
  ): Promise<string> {
    const scenarioPrompts = {
      achievement: `Generate a follow-up question about achievements that explores:
- The specific skills or strengths they demonstrated
- Challenges they overcame
- What they learned from the experience
- How it relates to their career goals`,

      challenge: `Generate a follow-up question about challenges that explores:
- Their problem-solving approach
- How they handled setbacks or obstacles
- What they learned from the difficulty
- How it helped them grow`,

      leadership: `Generate a follow-up question about leadership that explores:
- Their leadership style and philosophy
- How they motivated or supported their team
- Specific decisions they made and why
- The impact they had on others`,

      technical: `Generate a follow-up question about technical work that explores:
- The technologies and tools they used
- Their approach to solving technical problems
- How they learned new skills
- The complexity and scope of the work`,

      career: `Generate a follow-up question about career that explores:
- Their long-term professional goals
- What motivates and excites them
- How past experiences inform their career path
- Skills they want to develop`
    };

    const systemPrompt = `You are conducting a professional interview. ${scenarioPrompts[scenario]}

Write a 2-3 paragraph follow-up question that:
1. Acknowledges their previous answer
2. Asks deeper, more specific questions
3. Encourages detailed, reflective responses
4. Maintains a professional yet conversational tone`;

    const userPrompt = `Previous question: ${previousQuestion}

User's response: ${userResponse}

Generate a thoughtful follow-up question (2-3 paragraphs):`;

    try {
      const response = await this.groq.generateResponse([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], {
        temperature: 0.8,
        maxTokens: 400
      });

      return response.trim();
    } catch (error) {
      console.error('[Follow-Up Generator] Error in interview follow-up:', error);
      return this.getGenericFollowUp(scenario);
    }
  }
}
