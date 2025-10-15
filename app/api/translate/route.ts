import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage } = await request.json()

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { success: false, error: 'Text and target language are required' },
        { status: 400 }
      )
    }

    // Determine translation direction and system prompt
    const isFilipinoTarget = targetLanguage.toLowerCase() === 'filipino' || targetLanguage.toLowerCase() === 'tagalog'
    
    const systemPrompt = isFilipinoTarget
      ? `You are Lovely Pearl B. Alan's AI digital twin translator. Translate the following English text to Filipino/Tagalog while maintaining:
- Professional and friendly tone
- First-person perspective (as Lovely)
- Technical accuracy for IT/programming terms
- Natural Filipino conversational style
- Warmth and enthusiasm that reflects Lovely's personality

Only output the translation, nothing else.`
      : `You are Lovely Pearl B. Alan's AI digital twin translator. Translate the following Filipino/Tagalog text to English while maintaining:
- Professional and friendly tone
- First-person perspective (as Lovely)
- Technical accuracy for IT/programming terms
- Natural English conversational style
- Warmth and enthusiasm that reflects Lovely's personality

Only output the translation, nothing else.`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.5, // Lower temperature for more consistent translations
      max_tokens: 1000,
    })

    const translation = completion.choices[0]?.message?.content?.trim()

    if (!translation) {
      return NextResponse.json(
        { success: false, error: 'Translation failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      translation,
    })
  } catch (error) {
    console.error('Translation API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
