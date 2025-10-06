'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import PearlAIInterface from './pearl-ai-interface'

export default function WelcomeToDigitalTwin() {
  const [showChatbot, setShowChatbot] = useState(false)

  if (showChatbot) {
    return <PearlAIInterface />
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-30"></div>
      
      {/* Animated Particles */}
      <div className="absolute inset-0">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      
      {/* Holographic Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Navigation - DIGI-EARL Style */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="text-xl font-bold text-cyan-400">
              PearlAI
            </div>
            
            {/* Chat Button */}
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowChatbot(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 flex items-center space-x-2"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Chat</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
        
        {/* Hero Section - DIGI-EARL Style */}
        <div className="relative z-10 text-center mb-24 pt-20">
          {/* Status Badge */}
          <div className="flex justify-center mb-12">
            <div className="bg-purple-600/20 border border-purple-500/30 rounded-full px-6 py-3 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-purple-300 text-sm font-medium">Enhanced Memory System Active</span>
              </div>
            </div>
          </div>
          
          {/* Main Title */}
          <div className="space-y-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8">
              Hi, I'm <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">PearlAI</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
              AI Digital Twin with Enhanced Memory
            </p>
            
            {/* Feature Tags */}
            <div className="flex flex-wrap justify-center gap-4 mb-12 text-sm">
              <span className="text-cyan-400 font-medium">Persistent Memory</span>
              <span className="text-gray-500">•</span>
              <span className="text-purple-400 font-medium">Global Awareness</span>
              <span className="text-gray-500">•</span>
              <span className="text-pink-400 font-medium">Fresh UI Experience</span>
            </div>
            
            <div className="max-w-4xl mx-auto text-gray-300 text-lg leading-relaxed mb-12">
              <p>Powered by advanced RAG technology, professional expertise extraction, and cross-conversation memory.</p>
              <p className="mt-2">Experience fresh conversations with continuous context awareness.</p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
              <Button
                onClick={() => setShowChatbot(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-full font-semibold transition-all duration-300 hover:scale-105"
              >
                Start Conversation →
              </Button>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 px-8 py-4 text-lg rounded-full font-medium transition-all duration-300"
              >
                ⓘ Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Intelligence Section - DIGI-EARL Style */}
        <div id="features" className="mb-32">
          <div className="text-center mb-16">
            <div className="bg-purple-600/20 border border-purple-500/30 rounded-full px-4 py-2 inline-block mb-6">
              <span className="text-purple-300 text-sm font-medium">🧠 Memory Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Enhanced Intelligence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1: Persistent Memory */}
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-700/20 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300 group">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zm2 2V5h1v1h-1z" clipRule="evenodd" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4">Persistent Memory</h3>
              
              <p className="text-gray-400 leading-relaxed text-sm">
                Advanced RAG-based session storage with 24-hour TTL. Remembers conversations, user information, and context across page reloads while maintaining fresh UI experience.
              </p>
            </div>

            {/* Feature 2: Global Awareness */}
            <div className="bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 border border-cyan-700/20 rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-300 group">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4">Global Awareness</h3>
              
              <p className="text-gray-400 leading-relaxed text-sm">
                Cross-session conversation awareness enables natural references to previous interactions. Automatically generates summaries and maintains global context across all conversations.
              </p>
            </div>

            {/* Feature 3: Smart Extraction */}
            <div className="bg-gradient-to-br from-pink-900/20 to-pink-800/10 border border-pink-700/20 rounded-2xl p-8 hover:border-pink-500/30 transition-all duration-300 group">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4">Smart Extraction</h3>
              
              <p className="text-gray-400 leading-relaxed text-sm">
                Advanced regex-based user information extraction automatically identifies and stores names, companies, roles, and context for personalized, intelligent responses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - DIGI-EARL Style */}
      <footer className="border-t border-gray-800/50 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-bold text-cyan-400 mb-4">PearlAI</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your intelligent digital twin with enhanced memory capabilities. Bridging the gap between AI and human-like conversation.
            </p>
            <div className="text-gray-500 italic">
              "Where Memory Meets Intelligence"
            </div>
            <div className="text-sm text-gray-500 mt-4">
              Powered by Advanced AI • Built with ❤️ in the Philippines
            </div>
          </div>
          
          {/* Get in Touch */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
              <span>📧</span>
              <span>Get in Touch</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-400">
                <span>📞</span>
                <div>
                  <div className="text-sm">+63 917 234 5678</div>
                  <div className="text-xs text-gray-500">Primary</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <span>📞</span>
                <div>
                  <div className="text-sm">+63 926 789 1234</div>
                  <div className="text-xs text-gray-500">Business</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <span>@</span>
                <div>
                  <div className="text-sm">pearl@digiearl.ai</div>
                  <div className="text-xs text-gray-500">Official</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Connect With Me */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
              <span>🌟</span>
              <span>Connect With Me</span>
            </h3>
            <div className="flex space-x-4 mb-6">
              <a 
                href="https://github.com/lovelypearl" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white transition-colors"
              >
                🐈
              </a>
              <a 
                href="https://facebook.com/lovelypearl" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center text-white transition-colors"
              >
                f
              </a>
              <a 
                href="https://linkedin.com/in/lovelypearl" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-700 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-colors"
              >
                in
              </a>
              <a 
                href="mailto:pearl@digiearl.ai" 
                className="w-10 h-10 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors"
              >
                @
              </a>
            </div>
            
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <span>🌍</span>
                <span>Manila, Philippines</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>⚡</span>
                <span>Available 24/7 via AI</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🚀</span>
                <span>Always innovating</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 mt-12 pt-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div>
              © 2024 PearlAI. Crafted with passion and code.
            </div>
            <div className="mt-4 md:mt-0">
              Enhanced Memory System • Next.js 15 • Powered by Upstash & Groq
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}