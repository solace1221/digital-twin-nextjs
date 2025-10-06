'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Code2, Database, Globe, Cpu, Brain, Trophy, Users, Target, MessageSquare, GraduationCap, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'

export default function SkillsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const skills = [
    { name: "C++", icon: Code2, level: "Advanced", percentage: 90, description: "Object-oriented programming with strong foundation in data structures and algorithms", badge: "Cisco Certified", color: "purple" as const, category: "Programming" },
    { name: "JavaScript", icon: Code2, level: "Advanced", percentage: 88, description: "Modern ES6+ JavaScript for web applications and full-stack development", badge: "Cisco Certified", color: "pink" as const, category: "Programming" },
    { name: "Laravel & PHP", icon: Code2, level: "Proficient", percentage: 85, description: "Full-stack web development with Laravel framework and MVC architecture", color: "purple" as const, category: "Web Development" },
    { name: "Database Management", icon: Database, level: "Advanced", percentage: 87, description: "SQL/MySQL database design, optimization, and management for scalable applications", color: "pink" as const, category: "Backend" },
    { name: "HTML & CSS", icon: Globe, level: "Expert", percentage: 92, description: "Responsive web design with modern CSS frameworks and best practices", color: "blue" as const, category: "Web Development" },
    { name: "AI/ML (RAG, Vector DB)", icon: Brain, level: "Intermediate", percentage: 75, description: "Retrieval-Augmented Generation systems with vector databases and LLMs", badge: "Latest Project", color: "pink" as const, category: "Artificial Intelligence" },
    { name: "Leadership", icon: Users, level: "Expert", percentage: 95, description: "Leading teams and organizations with strategic vision and effective communication", badge: "JPCS President", color: "purple" as const, category: "Professional" },
    { name: "Project Management", icon: Target, level: "Advanced", percentage: 88, description: "Planning, executing, and delivering projects on time with quality standards", color: "pink" as const, category: "Professional" },
    { name: "Problem Solving", icon: Cpu, level: "Expert", percentage: 93, description: "Analytical thinking and debugging complex technical challenges efficiently", color: "blue" as const, category: "Professional" },
    { name: "Communication", icon: MessageSquare, level: "Advanced", percentage: 90, description: "Clear and effective collaboration across teams and stakeholders", badge: "Exec Secretary", color: "purple" as const, category: "Professional" },
    { name: "Academic Excellence", icon: GraduationCap, level: "Outstanding", percentage: 95, description: "Consistent high performance and strong academic record throughout university", color: "pink" as const, category: "Academic" }
  ]

  const itemsPerSlide = 3
  const totalSlides = Math.ceil(skills.length / itemsPerSlide)

  const getColorClasses = (color: 'purple' | 'pink' | 'blue') => {
    const colors = {
      purple: { gradient: 'from-purple-500 via-purple-600 to-pink-500', border: 'border-purple-500/40', badge: 'bg-purple-500/20 border-purple-500/30 text-purple-300', text: 'text-purple-300', glow: 'group-hover:shadow-purple-500/30', iconBg: 'bg-purple-500/10' },
      pink: { gradient: 'from-pink-500 via-pink-600 to-purple-500', border: 'border-pink-500/40', badge: 'bg-pink-500/20 border-pink-500/30 text-pink-300', text: 'text-pink-300', glow: 'group-hover:shadow-pink-500/30', iconBg: 'bg-pink-500/10' },
      blue: { gradient: 'from-blue-500 via-blue-600 to-cyan-500', border: 'border-blue-500/40', badge: 'bg-blue-500/20 border-blue-500/30 text-blue-300', text: 'text-blue-300', glow: 'group-hover:shadow-blue-500/30', iconBg: 'bg-blue-500/10' }
    }
    return colors[color]
  }

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 6000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, totalSlides])

  return (
    <section id="skills" className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Technical Skills & Expertise</h2>
          <p className="text-gray-400 text-base sm:text-lg">Certified proficiency with hands-on project experience</p>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden">
            <div className="transition-all duration-700 ease-out" style={{ transform: `translateX(${-currentSlide * 100}%)` }}>
              <div className="flex">
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="min-w-full px-2 sm:px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-2 sm:p-4">
                        {skills.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((skill, skillIndex) => {
                          const colors = getColorClasses(skill.color)
                          const Icon = skill.icon
                          return (
                            <div key={skillIndex} className="group" style={{ animation: `fadeInUp 0.6s ease-out ${skillIndex * 0.1}s both` }}>
                              <div className={`h-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl 
                                border ${colors.border} rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 transition-all duration-500 hover:scale-105 shadow-lg shadow-black/20 ${colors.glow} cursor-pointer overflow-hidden relative`}>
                                <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                                <div className="relative z-10 flex flex-col h-full">
                                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                                    <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${colors.iconBg} border border-white/10 group-hover:scale-110 transition-transform duration-500`}>
                                      <Icon className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${colors.text} group-hover:rotate-12 transition-transform duration-500`} />
                                    </div>
                                    {skill.badge && <Badge className={`${colors.badge} text-xs whitespace-nowrap`}>{skill.badge}</Badge>}
                                  </div>
                                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-500">{skill.name}</h3>
                                  <p className={`text-xs uppercase tracking-wider mb-4 ${colors.text} opacity-80`}>{skill.category}</p>
                                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">{skill.description}</p>
                                  <div className="space-y-3 mt-auto">
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs text-gray-500 uppercase tracking-wider">Proficiency</span>
                                      <span className={`font-bold text-sm ${colors.text}`}>{skill.level}</span>
                                    </div>
                                    <div className="relative h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                      <div className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full transition-all duration-1000`} style={{ width: `${skill.percentage}%` }}>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{animation: 'shimmer 2s infinite'}} />
                                      </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs text-gray-600">0%</span>
                                      <span className={`font-bold text-lg ${colors.text}`}>{skill.percentage}%</span>
                                    </div>
                                  </div>
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
          </div>

          {/* Navigation Buttons */}
          <button onClick={() => { setIsAutoPlaying(false); setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides) }} disabled={currentSlide === 0} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full p-4 text-white transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 z-10">
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button onClick={() => { setIsAutoPlaying(false); setCurrentSlide((prev) => (prev + 1) % totalSlides) }} disabled={currentSlide === totalSlides - 1} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full p-4 text-white transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 z-10">
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="flex justify-center gap-3 mt-12">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button key={index} onClick={() => { setIsAutoPlaying(false); setCurrentSlide(index) }} className={`transition-all duration-300 rounded-full ${currentSlide === index ? 'w-12 h-3 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50' : 'w-3 h-3 bg-white/20 hover:bg-white/40'}`} />
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <button onClick={() => setIsAutoPlaying(!isAutoPlaying)} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10">
              {isAutoPlaying ? <><Pause className="w-4 h-4" />Pause Auto-play</> : <><Play className="w-4 h-4" />Resume Auto-play</>}
            </button>
          </div>
      </div>
    </section>
  )
}