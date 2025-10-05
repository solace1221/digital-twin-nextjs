'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import PearlAIInterface from './pearl-ai-interface'

export default function WelcomeToDigitalTwin() {
  const [showChatbot, setShowChatbot] = useState(false)
  const [imageError, setImageError] = useState(false)

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0f0f0f] text-white">
      {/* MINIMALIST DARK NAVIGATION */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/30">
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">LP</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-semibold text-white">Lovely Pearl Alan</span>
                <span className="text-xs text-gray-400">BSIT Student & Developer</span>
              </div>
            </div>
            
            {/* Desktop Navigation - Minimalist */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                className="text-gray-400 hover:text-white transition-colors duration-200 font-medium text-sm"
                onClick={() => scrollToSection('projects')}
              >
                Work
              </button>
              <button 
                className="text-gray-400 hover:text-white transition-colors duration-200 font-medium text-sm"
                onClick={() => scrollToSection('about')}
              >
                About
              </button>
              <button 
                className="text-gray-400 hover:text-white transition-colors duration-200 font-medium text-sm"
                onClick={() => scrollToSection('contact')}
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO LANDING PAGE - Centered Dark Design */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
        </div>

        <div className="container mx-auto px-8 max-w-5xl pt-32 pb-20 relative z-10">
          <div className="text-center space-y-8">
            {/* Headline with gradient */}
            <h1 className="text-6xl lg:text-8xl font-black leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Unlimited
              </span>
              <br />
              <span className="text-white">Digital Portfolio</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              BSIT Student building intelligent systems with clean code and data-driven insights.
              <br />
              Academic excellence meets hands-on project experience and proven leadership.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-300">1.25 GPA Excellence</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span className="text-gray-300">100+ Members Led</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-300">Available for Opportunities</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-8">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-10 py-6 text-lg font-bold rounded-full shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105"
                onClick={() => setShowChatbot(true)}
              >
                Explore My Digital Twin
              </Button>
            </div>

            {/* Technologies */}
            <div className="pt-16">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-8">Technologies & Skills</p>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
                <span className="text-gray-500 font-semibold text-sm">Laravel</span>
                <span className="text-gray-500 font-semibold text-sm">Next.js</span>
                <span className="text-gray-500 font-semibold text-sm">Python</span>
                <span className="text-gray-500 font-semibold text-sm">SQL</span>
                <span className="text-gray-500 font-semibold text-sm">AI/ML</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 bg-gradient-to-b from-transparent to-white/5">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              About Me
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Text & Stats */}
            <div className="space-y-6">
              <p className="text-lg text-gray-300 leading-relaxed">
                I'm a 4th-year Bachelor of Science in Information Technology student at St. Paul University Philippines, majoring in Web & App Development with a cumulative GPA of 1.25.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                As President of the Junior Philippine Computer Society (JPCS) and Executive Secretary of the Paulinian Student Government, I lead 100+ members and drive initiatives that blend technical excellence with community impact.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">1.25</div>
                  <div className="text-sm text-gray-400">Cumulative GPA</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">100+</div>
                  <div className="text-sm text-gray-400">Members Led</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">5</div>
                  <div className="text-sm text-gray-400">Major Projects</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">2</div>
                  <div className="text-sm text-gray-400">Certifications</div>
                </div>
              </div>
            </div>

            {/* Right: Photo */}
            <div className="relative">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
                <div className="aspect-[4/5] relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl overflow-hidden">
                  {!imageError ? (
                    <Image 
                      src="/images/lovely-pearl.jpg"
                      alt="Lovely Pearl Alan"
                      fill
                      className="object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">👩‍💻</div>
                        <p className="text-gray-400">Lovely Pearl Alan</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="py-24">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Featured Projects
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project 1 */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-105">
              <div className="h-56 bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                <div className="text-8xl">🏛️</div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-3">Good Moral System</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  Comprehensive monitoring system with decision support using Laravel and SQL database management.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-purple-500/20 border border-purple-500/30 text-purple-300">Laravel</Badge>
                  <Badge className="bg-pink-500/20 border border-pink-500/30 text-pink-300">SQL</Badge>
                  <Badge className="bg-purple-500/20 border border-purple-500/30 text-purple-300">PHP</Badge>
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-105">
              <div className="h-56 bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center">
                <div className="text-8xl">🤖</div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-3">Digital Twin AI</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  AI-powered digital twin with RAG system, vector database, and intelligent conversation capabilities.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-purple-500/20 border border-purple-500/30 text-purple-300">Next.js</Badge>
                  <Badge className="bg-pink-500/20 border border-pink-500/30 text-pink-300">AI/ML</Badge>
                  <Badge className="bg-purple-500/20 border border-purple-500/30 text-purple-300">Python</Badge>
                </div>
              </div>
            </div>

            {/* Project 3 */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-105">
              <div className="h-56 bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                <div className="text-8xl">📋</div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-3">Yellow Forms Ticketing</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  Efficient ticketing and management system streamlining organizational workflows and communication.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-purple-500/20 border border-purple-500/30 text-purple-300">Laravel</Badge>
                  <Badge className="bg-pink-500/20 border border-pink-500/30 text-pink-300">MySQL</Badge>
                  <Badge className="bg-purple-500/20 border border-purple-500/30 text-purple-300">Bootstrap</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FOOTER */}
      <footer id="contact" className="py-24 border-t border-white/5">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Let's Connect
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {/* Email */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center hover:border-purple-500/30 transition-all duration-300">
              <div className="text-4xl mb-4">📧</div>
              <h4 className="text-white font-bold mb-2">Email</h4>
              <a href="mailto:lovelyalan692@gmail.com" className="text-gray-400 hover:text-purple-400 transition-colors text-sm break-all">
                lovelyalan692@gmail.com
              </a>
            </div>

            {/* LinkedIn */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center hover:border-purple-500/30 transition-all duration-300">
              <div className="text-4xl mb-4">💼</div>
              <h4 className="text-white font-bold mb-2">LinkedIn</h4>
              <a href="https://www.linkedin.com/in/lovely-pearl-alan-8746062b5" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Connect with me
              </a>
            </div>

            {/* GitHub */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center hover:border-purple-500/30 transition-all duration-300">
              <div className="text-4xl mb-4">💻</div>
              <h4 className="text-white font-bold mb-2">GitHub</h4>
              <a href="https://github.com/solace1221" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                View my code
              </a>
            </div>

            {/* Phone */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center hover:border-purple-500/30 transition-all duration-300">
              <div className="text-4xl mb-4">📱</div>
              <h4 className="text-white font-bold mb-2">Phone</h4>
              <a href="tel:+639386895547" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                +63 938 689 5547
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center border-t border-white/5 pt-8">
            <p className="text-gray-500 text-sm">
              © 2025 Lovely Pearl Alan - Digital Portfolio
            </p>
          </div>
        </div>
      </footer>

      {/* CHATBOT OVERLAY */}
      {showChatbot && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <PearlAIInterface onClose={() => setShowChatbot(false)} />
        </div>
      )}
    </div>
  )
}
