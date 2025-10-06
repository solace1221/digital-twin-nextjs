'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: string
  content: string
  sender: 'user' | 'pearl'
  timestamp: Date
  typing?: boolean
}

interface PearlAIInterfaceProps {
  onClose?: () => void
  initialQuestion?: string
}

export default function PearlAIInterface({ onClose, initialQuestion }: PearlAIInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Lovely Pearl B. Alan. I'm here to discuss my background, technical skills, projects, and career aspirations. Feel free to ask me anything about my professional journey.",
      sender: 'pearl',
      timestamp: new Date()
    }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasAutoSent = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isTyping) {
        scrollToBottom()
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [isTyping])

  // Auto-send initial question if provided
  useEffect(() => {
    if (initialQuestion && !hasAutoSent.current) {
      hasAutoSent.current = true
      setTimeout(() => {
        sendMessage(initialQuestion)
      }, 500)
    }
  }, [initialQuestion])

  const quickQuestions = [
    "Tell me about your background",
    "What are your technical skills?",
    "Describe your leadership experience", 
    "What projects have you worked on?",
    "What are your career goals?"
  ]

  const sendMessage = async (messageContent?: string) => {
    const content = messageContent || currentMessage.trim()
    if (!content) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await fetch('/api/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: content })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response || "I'm having trouble accessing my knowledge base right now. Please try again.",
          sender: 'pearl',
          timestamp: new Date()
        }

        setMessages(prev => [...prev, aiMessage])
        setIsTyping(false)
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.error('Error sending message:', error)
      setTimeout(() => {
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: 'I apologize, but I\'m experiencing technical difficulties. Please ensure the development server is running and try again.',
          sender: 'pearl',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
        setIsTyping(false)
        setIsLoading(false)
      }, 1000)
    }
  }

  return (
    <div className="w-full h-full flex flex-col relative">
      {onClose && (
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-[110] text-gray-400 hover:text-white hover:bg-red-500/20 rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0 transition-all duration-300 border border-gray-600/30 hover:border-red-500/50 group bg-black/80 backdrop-blur-sm"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      )}
      
      <Card className="w-full h-full bg-black/95 backdrop-blur-xl border border-purple-500/30 sm:border-2 shadow-2xl shadow-purple-500/30 rounded-2xl sm:rounded-3xl overflow-hidden relative flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-pink-500/10 to-cyan-500/15 rounded-3xl pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse pointer-events-none"></div>
        
        <div className="absolute inset-0 rounded-3xl pointer-events-none">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 animate-pulse"></div>
        </div>
        
        <div className="relative z-20 flex items-center p-3 sm:p-4 md:p-6 border-b border-purple-500/30 bg-black/40 backdrop-blur-sm shrink-0">
          <div className="flex items-center space-x-3 sm:space-x-4 w-full max-w-5xl mx-auto">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-purple-400/60 shadow-xl shadow-purple-500/50 ring-2 ring-purple-500/20 bg-gray-800">
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg">
                  LP
                </div>
              </div>
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-400 rounded-full border-2 border-black flex items-center justify-center">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-200 truncate">Pearl.AI</h2>
              <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm">
                <p className="text-purple-300 truncate">AI Digital Twin</p>
                <span className="text-purple-400 hidden sm:inline">•</span>
                <p className="text-green-400 hidden sm:block truncate">Neural Interface Active</p>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="relative z-10 p-0 flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-6 px-3 sm:px-4 md:px-6 py-3 sm:py-4 min-h-0 max-w-5xl mx-auto w-full">
            
            {/* Quick Questions - Hidden on mobile, shown on larger screens */}
            <div className="hidden lg:flex lg:flex-col lg:w-1/3 space-y-3 sm:space-y-4 shrink-0">
              <div className="flex items-center space-x-2 mb-2 sm:mb-4 md:mb-6">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-cyan-300">Neural Queries</h3>
              </div>
              <div className="space-y-2 sm:space-y-3 flex-1 overflow-y-auto chat-scroll">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    onClick={() => sendMessage(question)}
                    disabled={isLoading}
                    className="w-full text-left justify-start h-auto p-3 sm:p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/20 hover:from-purple-800/40 hover:to-pink-800/30 border border-purple-700/40 hover:border-purple-500/60 text-purple-100 hover:text-white rounded-xl transition-all duration-300 text-xs sm:text-sm"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></div>
                      <span>{question}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-2/3 flex flex-col min-h-0 flex-1">
              <div className="flex-1 mb-3 sm:mb-3 sm:mb-4 min-h-0 border border-purple-500/20 rounded-xl bg-black/20 relative">
                <ScrollArea className="h-full w-full p-2 sm:p-3 md:p-4 chat-scroll">
                  <div className="space-y-3 sm:space-y-4 pr-1 sm:pr-2">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[90%] sm:max-w-[85%] p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg relative ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                              : 'bg-black/70 backdrop-blur-sm border border-purple-500/40 text-purple-100'
                          }`}
                        >
                          {message.sender === 'pearl' && (
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="w-7 h-7 rounded-full overflow-hidden border border-purple-400/50 bg-gray-800">
                                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                                  LP
                                </div>
                              </div>
                              <span className="text-xs text-purple-300 font-semibold">Lovely Pearl AI</span>
                              <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                            </div>
                          )}
                          <div className="text-sm leading-relaxed prose prose-invert prose-purple max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                                li: ({ node, ...props }) => <li className="ml-2" {...props} />,
                                strong: ({ node, ...props }) => <strong className="font-bold text-purple-200" {...props} />,
                                em: ({ node, ...props }) => <em className="italic text-purple-300" {...props} />,
                                code: ({ node, className, children, ...props }) => {
                                  const match = /language-(\w+)/.exec(className || '')
                                  return !match ? (
                                    <code className="bg-purple-900/30 px-1.5 py-0.5 rounded text-purple-200 font-mono text-xs" {...props}>
                                      {children}
                                    </code>
                                  ) : (
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  )
                                },
                                pre: ({ node, ...props }) => (
                                  <pre className="bg-purple-900/30 p-3 rounded-lg overflow-x-auto my-2" {...props} />
                                ),
                                h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2 text-purple-100" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-2 text-purple-200" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-1 text-purple-300" {...props} />,
                                blockquote: ({ node, ...props }) => (
                                  <blockquote className="border-l-4 border-purple-500 pl-3 italic text-purple-300 my-2" {...props} />
                                ),
                                a: ({ node, ...props }) => (
                                  <a className="text-pink-400 hover:text-pink-300 underline" target="_blank" rel="noopener noreferrer" {...props} />
                                ),
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} className="h-4" />
                  </div>
                </ScrollArea>
              </div>
              
              <div className="space-y-3 sm:space-y-4 shrink-0">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className="flex-1 relative">
                    <Input
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          sendMessage()
                        }
                      }}
                      placeholder="Interface with neural consciousness..."
                      className="w-full bg-black/60 border-purple-500/40 text-purple-100 placeholder-purple-400/70 focus:border-pink-500 focus:ring-pink-500/20 rounded-xl backdrop-blur-sm py-3 px-4"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    onClick={() => sendMessage()}
                    disabled={isLoading || !currentMessage.trim()}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 shrink-0"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Send</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </div>
                    )}
                  </Button>
                </div>
                <div className="text-xs text-center text-purple-400/80 flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Neural pathway established</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-300"></div>
                    <span>Quantum encryption active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}