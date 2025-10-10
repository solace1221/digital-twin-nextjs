'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Sparkles, Trophy, Rocket, Code, Target, Users, ChevronLeft, ChevronRight, Play, Pause, Search, Brain, Database, Zap, Code2, FileCode, Shield, Bot, ClipboardList, FileSpreadsheet, Mail, MessageSquare, Linkedin, Github, Phone, MapPin, Menu, X } from 'lucide-react'
import PearlAIInterface from './pearl-ai-interface'
import SkillsCarousel from './skills-carousel'

export default function WelcomeToDigitalTwin() {
  const [showChatbot, setShowChatbot] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [initialQuestion, setInitialQuestion] = useState<string | undefined>(undefined)
  const [imageError, setImageError] = useState(false)
  const [currentTechSlide, setCurrentTechSlide] = useState(0)
  const [isTechAutoPlaying, setIsTechAutoPlaying] = useState(true)
  const [currentJourneySlide, setCurrentJourneySlide] = useState(0)
  const [isJourneyAutoPlaying, setIsJourneyAutoPlaying] = useState(true)
  const [activeGalleryImage, setActiveGalleryImage] = useState<{[key: number]: number}>({})
  const [currentProjectSlide, setCurrentProjectSlide] = useState(0)

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  const openChatbotWithQuestion = (question: string) => {
    setInitialQuestion(question)
    setShowChatbot(true)
  }

  // Projects data
  const projects = [
    {
      title: "Good Moral System",
      icon: Shield,
      subtitle: "Laravel • SQL • Decision Support",
      description: "Comprehensive monitoring system with decision support using Laravel and SQL database management for student conduct tracking.",
      metrics: [
        { value: "500+", label: "Students" },
        { value: "95%", label: "Efficiency" }
      ],
      features: [
        "Automated decision-making system",
        "Real-time monitoring dashboard",
        "Comprehensive reporting tools"
      ],
      tags: ["Laravel", "SQL", "PHP"],
      color: "purple"
    },
    {
      title: "Pearl.AI Digital Twin",
      icon: Bot,
      subtitle: "Next.js 15 • RAG • LLaMA 3.1",
      description: "AI-powered digital twin with RAG system, vector database, and intelligent conversation capabilities powered by Groq and Upstash.",
      metrics: [
        { value: "594", label: "Vectors" },
        { value: "135+", label: "Q&A Pairs" }
      ],
      features: [
        "Semantic search with RAG",
        "MCP server integration",
        "Real-time AI responses"
      ],
      tags: ["Next.js", "AI/ML", "Upstash"],
      color: "pink"
    },
    {
      title: "Yellow Forms Ticketing",
      icon: ClipboardList,
      subtitle: "NetBeans • MySQL • Bootstrap",
      description: "Efficient ticketing and management system streamlining organizational workflows and communication for campus operations.",
      metrics: [
        { value: "80%", label: "Faster" },
        { value: "300+", label: "Tickets/mo" }
      ],
      features: [
        "Streamlined workflow automation",
        "Priority-based ticket routing",
        "Analytics and reporting"
      ],
      tags: ["NetBeans", "MySQL", "Bootstrap"],
      color: "purple"
    },
    {
      title: "Tuguegarao City Website",
      icon: Code,
      subtitle: "HTML • CSS • JavaScript • Bootstrap",
      description: "Official city website showcasing local government services, tourism information, and community resources with responsive design.",
      metrics: [
        { value: "100%", label: "Responsive" },
        { value: "10+", label: "Pages" }
      ],
      features: [
        "Responsive web design",
        "Interactive user interface",
        "Bootstrap framework integration"
      ],
      tags: ["HTML", "CSS", "JavaScript"],
      color: "pink"
    },
    {
      title: "Student Monitoring System",
      icon: Users,
      subtitle: "Laravel • Attendance Tracking",
      description: "Comprehensive attendance monitoring system for tracking student presence, generating reports, and managing academic attendance records.",
      metrics: [
        { value: "1000+", label: "Students" },
        { value: "Daily", label: "Updates" }
      ],
      features: [
        "Real-time attendance tracking",
        "Automated report generation",
        "Parent notification system"
      ],
      tags: ["Laravel", "PHP", "MySQL"],
      color: "purple"
    },
    {
      title: "Priceless Service",
      icon: Sparkles,
      subtitle: "Photoshop • Adobe Premiere",
      description: "Video documentary showcasing 'A Life of a Paulinian Student-Servant Leader' - capturing the journey, dedication, and impact of student leadership.",
      metrics: [
        { value: "15min", label: "Duration" },
        { value: "HD", label: "Quality" }
      ],
      features: [
        "Professional video editing",
        "Motion graphics design",
        "Compelling storytelling"
      ],
      tags: ["Photoshop", "Premiere", "Design"],
      color: "pink"
    }
  ]

  const projectsPerSlide = 3
  const totalProjectSlides = Math.ceil(projects.length / projectsPerSlide)

  const techStack = [
    { name: "RAG System", icon: Search, description: "Retrieval-Augmented Generation for context-aware responses using semantic search", color: "purple" as const },
    { name: "LLaMA 3.1", icon: Brain, description: "Meta's advanced language model powering intelligent conversational responses", color: "pink" as const },
    { name: "Upstash Vector", icon: Database, description: "Serverless vector database for storing and retrieving 135+ knowledge embeddings", color: "purple" as const },
    { name: "Groq API", icon: Zap, description: "Ultra-fast LPU inference engine delivering sub-second AI response times", color: "pink" as const },
    { name: "Next.js 15", icon: Code2, description: "React framework with server-side rendering and optimized performance", color: "purple" as const },
    { name: "TypeScript", icon: FileCode, description: "Type-safe development ensuring code reliability and maintainability", color: "cyan" as const }
  ]

  const techItemsPerSlide = 3
  const totalTechSlides = Math.ceil(techStack.length / techItemsPerSlide)

  const getTechColorClasses = (color: 'purple' | 'pink' | 'cyan') => {
    const colors = {
      purple: { gradient: 'from-blue-500 via-blue-600 to-cyan-500', border: 'border-blue-500/40', text: 'text-blue-300', glow: 'group-hover:shadow-blue-500/30', bg: 'bg-blue-500/10' },
      pink: { gradient: 'from-coral-500 via-coral-600 to-blue-500', border: 'border-coral-500/40', text: 'text-coral-300', glow: 'group-hover:shadow-coral-500/30', bg: 'bg-coral-500/10' },
      cyan: { gradient: 'from-blue-500 via-blue-600 to-cyan-500', border: 'border-blue-500/40', text: 'text-blue-300', glow: 'group-hover:shadow-blue-500/30', bg: 'bg-blue-500/10' }
    }
    return colors[color]
  }

  useEffect(() => {
    if (!isTechAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentTechSlide((prev) => (prev + 1) % totalTechSlides)
    }, 6000)
    return () => clearInterval(interval)
  }, [isTechAutoPlaying, totalTechSlides])

  // Journey carousel data
  const journeyMilestones = [
    { 
      title: "JPCS President", 
      badge: "Leadership Excellence",
      description: "Appointed as President of the Junior Philippine Computer Society, leading over 100 members in tech initiatives, workshops, innovation programs, and fostering a vibrant community of student developers.",
      image: "/images/college-1.jpg",
      galleryImages: ["/images/college-1.jpg", "/images/college-2.jpg", "/images/college-3.jpg"]
    },
    { 
      title: "PSG Executive Secretary", 
      badge: "Student Government",
      description: "Elected as Uniwide Executive Secretary of the Paulinian Student Government, coordinating campus-wide initiatives, student affairs, and representing the voice of the student body.",
      image: "/images/college-2.jpg",
      galleryImages: ["/images/college-2.jpg", "/images/college-3.jpg", "/images/college-4.jpg"]
    },
    { 
      title: "2nd Runner Up Best Booth", 
      badge: "Campus Achievement",
      description: "Recognized for exceptional creativity and teamwork, securing 2nd Runner Up for Best Booth at a major university event, showcasing innovative design and collaborative spirit.",
      image: "/images/college-3.jpg",
      galleryImages: ["/images/college-3.jpg", "/images/college-4.jpg", "/images/college-5.jpg"]
    },
    { 
      title: "Capstone Project Leader", 
      badge: "Academic Leadership",
      description: "Led the development of the Good Moral Application and Monitoring System with Decision Support, demonstrating technical expertise in Laravel, SQL database management, and team leadership.",
      image: "/images/college-4.jpg",
      galleryImages: ["/images/college-4.jpg", "/images/college-5.jpg", "/images/college-6.jpg"]
    },
    { 
      title: "International Cultural Exchange", 
      badge: "Global Engagement",
      description: "Served as Organizer and Facilitator for the International Language and Culture Immersion program with Japanese students, promoting cross-cultural understanding and global collaboration.",
      image: "/images/college-5.jpg",
      galleryImages: ["/images/college-5.jpg", "/images/college-6.jpg", "/images/college-7.jpg"]
    },
    { 
      title: "COIL TechFusion", 
      badge: "International Collaboration",
      description: "Collaborative Online International Learning - TechFusion: Global Project Management for EdTech Revolution. Served as one of the leaders in the project, where we created an online learning platform for underprivileged students and translated it into local languages - Ibanag, Ilokano, Itawes, English, Tagalog, and Portuguese.",
      image: "/images/college-6.jpg",
      galleryImages: ["/images/college-6.jpg", "/images/college-7.jpg", "/images/college-8.jpg"]
    },
    { 
      title: "Youth Leadership Summit", 
      badge: "Civic Engagement - 2025",
      description: "Participated in the Tuguegarao City Youth Leadership Convergence 2025, engaging with future leaders, sharing insights on technology and governance, and building networks for social impact.",
      image: "/images/college-7.jpg",
      galleryImages: ["/images/college-7.jpg", "/images/college-8.jpg", "/images/college-9.jpg"]
    },
    { 
      title: "Primary Health Care Advocate", 
      badge: "Community Service",
      description: "Facilitator of the 2025 Primary Health Care Project Convention in Luna, Apayao, supporting health initiatives and demonstrating commitment to community welfare and public service.",
      image: "/images/college-8.jpg",
      galleryImages: ["/images/college-8.jpg", "/images/college-9.jpg", "/images/college-10.jpg"]
    },
    { 
      title: "Paskuhan Organizer", 
      badge: "Cultural Tradition",
      description: "Core organizer of the annual Paskuhan celebration, bringing together the university community for festivities, cultural performances, and cherished year-end traditions.",
      image: "/images/college-9.jpg",
      galleryImages: ["/images/college-9.jpg", "/images/college-10.jpg", "/images/college-11.jpg"]
    },
    { 
      title: "UNESCO Youth Assembly", 
      badge: "International Recognition",
      description: "Delegate to the International Assembly of Youth for UNESCO, representing the Paulinian Student Government during its successful re-accreditation as an official UNESCO-affiliated organization.",
      image: "/images/college-10.jpg",
      galleryImages: ["/images/college-10.jpg", "/images/college-11.jpg", "/images/college-12.jpg"]
    },
    { 
      title: "HackTheNorth TCON 6", 
      badge: "Tech Seminar/Workshop",
      description: "Participated in HackTheNorth TCON 6, a premier technology conference and seminar, collaborating with talented developers, learning cutting-edge technologies, and expanding technical expertise through hands-on workshops and knowledge-sharing sessions.",
      image: "/images/college-11.jpg",
      galleryImages: ["/images/college-11.jpg", "/images/college-12.jpg", "/images/college-1.jpg"]
    },
    { 
      title: "Ready for the Future", 
      badge: "Looking Ahead",
      description: "With a strong foundation in technology, proven leadership experience, and a passion for innovation and community impact, I'm ready to bring my skills and enthusiasm to new opportunities as a Data Analyst or Software Engineer.",
      image: "/images/college-12.jpg",
      galleryImages: ["/images/college-12.jpg", "/images/college-1.jpg", "/images/college-2.jpg"]
    }
  ]

  useEffect(() => {
    if (!isJourneyAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentJourneySlide((prev) => (prev + 1) % journeyMilestones.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [isJourneyAutoPlaying, journeyMilestones.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0f0f0f] text-white">
      {/* MINIMALIST DARK NAVIGATION */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Logo Section */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-blue-500/30">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-white font-bold text-base sm:text-lg">LP</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-semibold text-white">Lovely Pearl Alan</span>
                <span className="text-xs text-gray-400 hidden sm:block">BSIT Student & Developer</span>
              </div>
            </div>
            
            {/* Desktop Navigation - Minimalist */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <button 
                className="text-gray-400 hover:text-white transition-colors duration-200 font-medium text-sm"
                onClick={() => scrollToSection('about')}
              >
                About
              </button>
              <button 
                className="text-gray-400 hover:text-white transition-colors duration-200 font-medium text-sm"
                onClick={() => scrollToSection('skills')}
              >
                Skills
              </button>
              <button 
                className="text-gray-400 hover:text-white transition-colors duration-200 font-medium text-sm"
                onClick={() => scrollToSection('projects')}
              >
                Projects
              </button>
              <button 
                className="text-gray-400 hover:text-white transition-colors duration-200 font-medium text-sm"
                onClick={() => scrollToSection('contact')}
              >
                Contact
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-400 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/5 py-4">
              <div className="container mx-auto px-4 flex flex-col space-y-3">
                <button 
                  className="text-gray-400 hover:text-white transition-colors duration-200 font-medium text-sm text-left py-2"
                  onClick={() => { scrollToSection('about'); setMobileMenuOpen(false) }}
                >
                  About
                </button>
                <button 
                  className="text-gray-400 hover:text-white transition-colors duration-200 font-medium text-sm text-left py-2"
                  onClick={() => { scrollToSection('skills'); setMobileMenuOpen(false) }}
                >
                  Skills
                </button>
                <button 
                  className="text-gray-400 hover:text-white transition-colors duration-200 font-medium text-sm text-left py-2"
                  onClick={() => { scrollToSection('projects'); setMobileMenuOpen(false) }}
                >
                  Projects
                </button>
                <button 
                  className="text-gray-400 hover:text-white transition-colors duration-200 font-medium text-sm text-left py-2"
                  onClick={() => { scrollToSection('contact'); setMobileMenuOpen(false) }}
                >
                  Contact
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* HERO LANDING PAGE - Centered Dark Design */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Simplified Background - Subtle accent only */}
        <div className="absolute inset-0 z-0">
          {/* Reduced gradient orbs - smaller, more subtle */}
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
          {/* Simplified grid pattern - more subtle */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.01)_1px,transparent_1px)] bg-[size:120px_120px] [mask-image:radial-gradient(ellipse_70%_40%_at_50%_50%,black,transparent)]"></div>
        </div>

        <div className="container mx-auto px-8 max-w-5xl pt-32 pb-20 relative z-10">
          <div className="text-center space-y-8">
            {/* Pearl.AI Branding */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  Pearl.AI
                </span>
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl text-white/90 font-semibold px-4">
                Your AI-Powered Conversation with Lovely Pearl Alan
              </p>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
              BSIT Student building intelligent systems with clean code and data-driven insights.
              <br />
              <span className="text-blue-300">Ask me anything about my journey, projects, and technical expertise.</span>
            </p>

            {/* Trust Badge */}
            <div className="flex justify-center">
              <div className="bg-white/5 backdrop-blur-sm border border-blue-500/30 rounded-full px-6 py-2 text-sm text-gray-300 flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-400" />
                <span>Powered by RAG + LLaMA 3.1 | 135+ Q&A Knowledge Base</span>
              </div>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">100+ Members Led</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-coral-500 rounded-full"></div>
                <span className="text-gray-300">Available for Opportunities</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-8">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-10 py-6 text-lg font-bold rounded-full shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 hover:scale-105"
                onClick={() => setShowChatbot(true)}
              >
                Explore Pearl.AI
              </Button>
            </div>

            {/* Suggested Questions */}
            <div className="pt-12">
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-6 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Try asking Pearl.AI:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => openChatbotWithQuestion("What's your biggest achievement?")}
                  className="group bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 rounded-full px-5 py-2.5 text-sm text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  <span>What's your biggest achievement?</span>
                </button>
                <button
                  onClick={() => openChatbotWithQuestion("Tell me about your projects")}
                  className="group bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 rounded-full px-5 py-2.5 text-sm text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Tell me about your projects</span>
                </button>
                <button
                  onClick={() => openChatbotWithQuestion("What technologies do you know?")}
                  className="group bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 rounded-full px-5 py-2.5 text-sm text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  <Code className="w-4 h-4" />
                  <span>What technologies do you know?</span>
                </button>
                <button
                  onClick={() => openChatbotWithQuestion("Why should we hire you?")}
                  className="group bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 rounded-full px-5 py-2.5 text-sm text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  <span>Why should we hire you?</span>
                </button>
                <button
                  onClick={() => openChatbotWithQuestion("Tell me about your leadership")}
                  className="group bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 rounded-full px-5 py-2.5 text-sm text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Tell me about your leadership</span>
                </button>
              </div>
            </div>

            {/* Digital Twin Technology Stack - Carousel */}
            <div className="pt-16">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Digital Twin Technology Stack</h2>
                <p className="text-gray-400 text-lg">Technologies powering the AI digital twin experience</p>
              </div>
              
              <div className="relative max-w-6xl mx-auto">
                <div className="relative overflow-hidden">
                  <div className="transition-all duration-700 ease-out" style={{ transform: `translateX(${-currentTechSlide * 100}%)` }}>
                    <div className="flex">
                      {Array.from({ length: totalTechSlides }).map((_, slideIndex) => (
                        <div key={slideIndex} className="min-w-full px-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                            {techStack.slice(slideIndex * techItemsPerSlide, (slideIndex + 1) * techItemsPerSlide).map((tech, techIndex) => {
                              const colors = getTechColorClasses(tech.color)
                              const Icon = tech.icon
                              return (
                                <div key={techIndex} className="group" style={{ animation: `fadeInUp 0.6s ease-out ${techIndex * 0.1}s both` }}>
                                  <div className={`h-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border ${colors.border} rounded-3xl p-6 lg:p-8 transition-all duration-500 hover:scale-105 shadow-lg shadow-black/20 cursor-pointer overflow-hidden relative`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                                    <div className="relative z-10 flex flex-col h-full">
                                      <div className="flex items-start justify-between mb-6">
                                        <div className={`p-4 rounded-2xl ${colors.bg} border border-white/10 group-hover:scale-110 transition-transform duration-500`}>
                                          <Icon className={`w-7 h-7 lg:w-8 lg:h-8 ${colors.text} group-hover:rotate-12 transition-transform duration-500`} />
                                        </div>
                                      </div>
                                      <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-500">{tech.name}</h3>
                                      <p className="text-gray-400 text-sm leading-relaxed flex-grow">{tech.description}</p>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-3 mt-8">
                  {Array.from({ length: totalTechSlides }).map((_, index) => (
                    <button 
                      key={index} 
                      onClick={() => { setIsTechAutoPlaying(false); setCurrentTechSlide(index) }} 
                    className={`transition-all duration-300 rounded-full ${
                      currentTechSlide === index 
                        ? 'w-12 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50' 
                        : 'w-3 h-3 bg-white/20 hover:bg-white/40'
                    }`}
                    />
                  ))}
                </div>

                {/* Auto-play Toggle */}
                <div className="flex justify-center mt-6">
                  <button 
                    onClick={() => setIsTechAutoPlaying(!isTechAutoPlaying)} 
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10"
                  >
                    {isTechAutoPlaying ? (
                      <><Pause className="w-4 h-4" />Pause Auto-play</>
                    ) : (
                      <><Play className="w-4 h-4" />Resume Auto-play</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MY COLLEGE JOURNEY SECTION */}
      <section id="about" className="relative w-full min-h-screen h-auto md:h-screen overflow-hidden bg-black py-12 md:py-0">
        <div className="text-center pt-8 md:pt-12 pb-6 md:pb-8 relative z-20 px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            My College Journey
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">A timeline of growth, leadership, and memorable moments</p>
        </div>

        {/* Carousel Container - Centered with max-width and margins */}
        <div className="relative w-full h-[500px] sm:h-[600px] md:h-[calc(100vh-180px)] max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
          {/* Slides */}
          {journeyMilestones.map((milestone, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentJourneySlide 
                  ? 'opacity-100 translate-x-0 z-10' 
                  : index < currentJourneySlide
                  ? 'opacity-0 -translate-x-full z-0'
                  : 'opacity-0 translate-x-full z-0'
              }`}
            >
              {/* Background Image - Changes based on selected gallery image */}
              <div className="absolute inset-0 transition-all duration-700 ease-in-out rounded-2xl overflow-hidden">
                <Image
                  src={activeGalleryImage[index] !== undefined 
                    ? milestone.galleryImages[activeGalleryImage[index]] 
                    : milestone.image}
                  alt={milestone.title}
                  fill
                  className="object-cover transition-opacity duration-700"
                  priority={index === 0}
                  onError={() => {}}
                />
                {/* Dark Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40"></div>
              </div>

              {/* Content Container */}
              <div className="relative h-full">
                {/* Left: Text Content - Positioned in lower-left */}
                <div className="absolute left-4 sm:left-6 md:left-8 lg:left-16 bottom-16 sm:bottom-20 md:bottom-24 lg:bottom-32 max-w-[calc(100%-2rem)] sm:max-w-xl md:max-w-2xl text-white space-y-3 sm:space-y-4 md:space-y-6 z-20">
                  <div className="inline-block px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 backdrop-blur-sm border border-blue-500/50 rounded-full">
                    <span className="text-xs sm:text-sm font-semibold text-blue-200">{milestone.badge}</span>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                    {milestone.title}
                  </h3>
                  
                  <p className="text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed max-w-xl">
                    {milestone.description}
                  </p>

                  <button 
                    onClick={() => setShowChatbot(true)}
                    className="group mt-3 sm:mt-4 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 flex items-center gap-2 w-fit text-sm sm:text-base"
                  >
                    <span>Know More</span>
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Dots Indicator */}
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-2 sm:gap-3">
            {journeyMilestones.map((_, index) => (
              <button
                key={index}
                onClick={() => { setIsJourneyAutoPlaying(false); setCurrentJourneySlide(index) }}
                className={`transition-all duration-300 rounded-full ${
                  index === currentJourneySlide
                    ? 'w-8 sm:w-10 md:w-12 h-2 sm:h-2.5 md:h-3 bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50'
                    : 'w-2 sm:w-2.5 md:w-3 h-2 sm:h-2.5 md:h-3 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Auto-play Toggle */}
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 z-30">
            <button
              onClick={() => setIsJourneyAutoPlaying(!isJourneyAutoPlaying)}
              className="text-xs sm:text-sm text-white/80 hover:text-white transition-colors flex items-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-white/20"
            >
              {isJourneyAutoPlaying ? (
                <><Pause className="w-3 h-3 sm:w-4 sm:h-4" /><span className="hidden sm:inline">Pause</span></>
              ) : (
                <><Play className="w-3 h-3 sm:w-4 sm:h-4" /><span className="hidden sm:inline">Play</span></>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* SKILLS CAROUSEL */}
      <SkillsCarousel />

      {/* PROJECTS SECTION */}
      <section id="projects" className="py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">Showcasing technical expertise and innovative solutions</p>
          </div>

          {/* Projects Carousel */}
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentProjectSlide * 100}%)` }}
              >
                {Array.from({ length: totalProjectSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {projects.slice(slideIndex * projectsPerSlide, (slideIndex + 1) * projectsPerSlide).map((project, index) => {
                        const Icon = project.icon
                        return (
                          <div key={index} className={`group bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-${project.color}-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-${project.color}-500/20`}>
                            <div className={`h-56 bg-gradient-to-br from-${project.color}-500/30 to-${project.color === 'purple' ? 'pink' : 'purple'}-500/30 flex items-center justify-center relative`}>
                              <div className={`absolute inset-0 bg-gradient-to-br from-${project.color}-600/20 to-${project.color === 'purple' ? 'pink' : 'purple'}-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                              <Icon className={`w-24 h-24 text-${project.color}-300 transition-all duration-500`} strokeWidth={1.5} />
                            </div>
                            <div className="p-8">
                              <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                              <p className={`text-${project.color}-300 text-xs uppercase tracking-wider mb-4`}>{project.subtitle}</p>
                              
                              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                {project.description}
                              </p>

                              {/* Impact Metrics */}
                              <div className="grid grid-cols-2 gap-3 mb-6">
                                {project.metrics.map((metric, idx) => (
                                  <div key={idx} className={`bg-${idx === 0 ? project.color : project.color === 'purple' ? 'pink' : 'purple'}-500/10 border border-${idx === 0 ? project.color : project.color === 'purple' ? 'pink' : 'purple'}-500/30 rounded-xl p-3 text-center`}>
                                    <div className={`text-2xl font-bold text-${idx === 0 ? project.color : project.color === 'purple' ? 'pink' : 'purple'}-300`}>{metric.value}</div>
                                    <div className="text-xs text-gray-400">{metric.label}</div>
                                  </div>
                                ))}
                              </div>

                              {/* Key Features */}
                              <div className="space-y-2 mb-4 text-sm text-gray-300">
                                {project.features.map((feature, idx) => (
                                  <div key={idx} className="flex items-start">
                                    <span className={`text-${project.color}-400 mr-2`}>✓</span>
                                    <span>{feature}</span>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag, idx) => (
                                  <Badge key={idx} className={`bg-${idx % 2 === 0 ? project.color : project.color === 'purple' ? 'pink' : 'purple'}-500/20 border border-${idx % 2 === 0 ? project.color : project.color === 'purple' ? 'pink' : 'purple'}-500/30 text-${idx % 2 === 0 ? project.color : project.color === 'purple' ? 'pink' : 'purple'}-300`}>{tag}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows - Only show if more than 3 projects */}
            {/* Dots Indicator */}
            {totalProjectSlides > 1 && (
              <div className="flex justify-center gap-3 mt-8">
                {Array.from({ length: totalProjectSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProjectSlide(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentProjectSlide
                        ? 'w-12 h-3 bg-gradient-to-r from-blue-500 to-cyan-500'
                        : 'w-3 h-3 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CONTACT FOOTER */}
      <footer id="contact" className="py-12 sm:py-16 md:py-24 border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Let's Connect
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base px-4">
              Open to internship opportunities and exciting projects. Feel free to reach out!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {/* Email */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 text-center hover:border-blue-500/30 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-500/20 rounded-full group-hover:bg-blue-500/30 transition-all">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <h4 className="text-white font-bold mb-2">Email</h4>
              <a href="mailto:lovelyalan692@gmail.com" className="text-gray-400 hover:text-blue-400 transition-colors text-sm break-all">
                lovelyalan692@gmail.com
              </a>
            </div>

            {/* Phone */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 text-center hover:border-coral-500/30 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-coral-500/20 rounded-full group-hover:bg-coral-500/30 transition-all">
                  <Phone className="w-6 h-6 text-coral-400" />
                </div>
              </div>
              <h4 className="text-white font-bold mb-2">Phone</h4>
              <a href="tel:+639686452130" className="text-gray-400 hover:text-coral-400 transition-colors text-sm">
                +63 968 645 2130
              </a>
            </div>

            {/* Location */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 text-center hover:border-blue-500/30 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-500/20 rounded-full group-hover:bg-blue-500/30 transition-all">
                  <MapPin className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <h4 className="text-white font-bold mb-2">Location</h4>
              <p className="text-gray-400 text-sm">
                Tuguegarao City,<br />Cagayan, Philippines
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
            <a 
              href="https://www.linkedin.com/in/lovely-pearl-alan-62bbb2311/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white/5 backdrop-blur-xl rounded-full p-4 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
            </a>
            <a 
              href="https://github.com/solace1221" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white/5 backdrop-blur-xl rounded-full p-4 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300"
              aria-label="GitHub Profile"
            >
              <Github className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
            </a>
            <a 
              href="mailto:lovelyalan692@gmail.com"
              className="group bg-white/5 backdrop-blur-xl rounded-full p-4 border border-white/10 hover:border-coral-500/50 hover:bg-coral-500/10 transition-all duration-300"
              aria-label="Send Email"
            >
              <Mail className="w-6 h-6 text-gray-400 group-hover:text-coral-400 transition-colors" />
            </a>
          </div>

          {/* Copyright & Quick Links */}
          <div className="border-t border-white/5 pt-6 sm:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-xs sm:text-sm text-center md:text-left">
                © {new Date().getFullYear()} Lovely Pearl Alan. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
                <a href="#hero" className="text-gray-400 hover:text-blue-400 transition-colors">Home</a>
                <a href="#about" className="text-gray-400 hover:text-blue-400 transition-colors">About</a>
                <a href="#skills" className="text-gray-400 hover:text-blue-400 transition-colors">Skills</a>
                <a href="#projects" className="text-gray-400 hover:text-blue-400 transition-colors">Projects</a>
                <a href="#contact" className="text-gray-400 hover:text-blue-400 transition-colors">Contact</a>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-gray-600 text-xs">
                Built with Next.js, TypeScript & AI • Powered by Digital Twin Technology
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* CHATBOT OVERLAY */}
      {showChatbot && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <PearlAIInterface 
            onClose={() => {
              setShowChatbot(false)
              setInitialQuestion(undefined)
            }} 
            initialQuestion={initialQuestion}
          />
        </div>
      )}
    </div>
  )
}
