'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Code2, Database, Globe, Cpu, Brain, Users, Target, MessageSquare, ChevronDown } from 'lucide-react'

export default function SkillsAccordion() {
  const [openCategory, setOpenCategory] = useState<string>('frontend')

  const skillCategories = {
    frontend: {
      title: "Frontend Development",
      icon: Globe,
      color: "blue" as const,
      skills: [
        { name: "HTML & CSS", level: "Expert", percentage: 92, description: "Responsive web design with modern CSS frameworks and best practices", badge: null },
        { name: "JavaScript", level: "Advanced", percentage: 88, description: "Modern ES6+ JavaScript for web applications", badge: "Cisco Certified" },
        { name: "Laravel Blade", level: "Proficient", percentage: 85, description: "Dynamic templating with Laravel's Blade engine", badge: null }
      ]
    },
    backend: {
      title: "Backend Development",
      icon: Code2,
      color: "coral" as const,
      skills: [
        { name: "Laravel & PHP", level: "Proficient", percentage: 85, description: "Full-stack web development with Laravel framework and MVC architecture", badge: null },
        { name: "API Development", level: "Proficient", percentage: 82, description: "RESTful API design and integration for scalable applications", badge: null },
        { name: "AI/ML (RAG, Vector DB)", level: "Intermediate", percentage: 75, description: "Retrieval-Augmented Generation systems with vector databases and LLMs", badge: "Latest Project" }
      ]
    },
    database: {
      title: "Database Management",
      icon: Database,
      color: "blue" as const,
      skills: [
        { name: "MySQL & SQL", level: "Advanced", percentage: 87, description: "Database design, optimization, and management for scalable applications", badge: null },
        { name: "Schema Design", level: "Advanced", percentage: 85, description: "Normalized database structures with optimal indexing strategies", badge: null },
        { name: "Query Optimization", level: "Proficient", percentage: 80, description: "Performance tuning and efficient query design", badge: null }
      ]
    },
    languages: {
      title: "Programming Languages",
      icon: Cpu,
      color: "coral" as const,
      skills: [
        { name: "C++", level: "Advanced", percentage: 90, description: "Object-oriented programming with strong foundation in data structures and algorithms", badge: "Cisco Certified" },
        { name: "JavaScript/TypeScript", level: "Advanced", percentage: 88, description: "Modern JavaScript and TypeScript for full-stack development", badge: "Cisco Certified" },
        { name: "PHP", level: "Proficient", percentage: 85, description: "Server-side scripting and web application development", badge: null }
      ]
    },
    softskills: {
      title: "Leadership & Soft Skills",
      icon: Users,
      color: "blue" as const,
      skills: [
        { name: "Leadership", level: "Expert", percentage: 95, description: "Leading teams and organizations with strategic vision", badge: "JPCS President" },
        { name: "Project Management", level: "Advanced", percentage: 88, description: "Planning, executing, and delivering projects on time", badge: null },
        { name: "Problem Solving", level: "Expert", percentage: 93, description: "Analytical thinking and debugging complex technical challenges", badge: null },
        { name: "Communication", level: "Advanced", percentage: 90, description: "Clear and effective collaboration across teams", badge: "Exec Secretary" }
      ]
    }
  }

  const getColorClasses = (color: 'blue' | 'coral') => {
    const colors = {
      blue: {
        gradient: 'from-blue-500 via-blue-600 to-cyan-500',
        border: 'border-blue-500/40',
        badge: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
        text: 'text-blue-300',
        bg: 'bg-blue-500/10',
        buttonBg: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30',
        buttonActive: 'bg-blue-500/20 border-blue-500/50'
      },
      coral: {
        gradient: 'from-coral-500 via-coral-600 to-blue-500',
        border: 'border-coral-500/40',
        badge: 'bg-coral-500/20 border-coral-500/30 text-coral-300',
        text: 'text-coral-300',
        bg: 'bg-coral-500/10',
        buttonBg: 'bg-coral-500/10 hover:bg-coral-500/20 border-coral-500/30',
        buttonActive: 'bg-coral-500/20 border-coral-500/50'
      }
    }
    return colors[color]
  }

  return (
    <section id="skills" className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Technical Skills & Expertise
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Certified proficiency with hands-on project experience
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {Object.entries(skillCategories).map(([key, category]) => {
            const colors = getColorClasses(category.color)
            const Icon = category.icon
            const isActive = openCategory === key
            return (
              <button
                key={key}
                onClick={() => setOpenCategory(key)}
                className={`group px-4 sm:px-6 py-3 rounded-full border transition-all duration-300 flex items-center gap-2 ${
                  isActive ? colors.buttonActive : colors.buttonBg
                }`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.text}`} />
                <span className="text-sm sm:text-base text-white font-medium">{category.title}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
              </button>
            )
          })}
        </div>

        {/* Skills Content */}
        <div className="max-w-6xl mx-auto">
          {Object.entries(skillCategories).map(([key, category]) => {
            const colors = getColorClasses(category.color)
            const isOpen = openCategory === key

            return (
              <div
                key={key}
                className={`transition-all duration-500 overflow-hidden ${
                  isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
                  {category.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="group"
                      style={{
                        animation: isOpen ? `fadeInUp 0.6s ease-out ${index * 0.1}s both` : 'none'
                      }}
                    >
                      <div className={`h-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border ${colors.border} rounded-2xl sm:rounded-3xl p-6 transition-all duration-500 hover:scale-105 shadow-lg shadow-black/20 cursor-pointer overflow-hidden relative`}>
                        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                        <div className="relative z-10 flex flex-col h-full">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-500">
                              {skill.name}
                            </h3>
                            {skill.badge && (
                              <Badge className={`${colors.badge} text-xs whitespace-nowrap ml-2`}>
                                {skill.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                            {skill.description}
                          </p>
                          <div className="space-y-3 mt-auto">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500 uppercase tracking-wider">
                                Proficiency
                              </span>
                              <span className={`font-bold text-sm ${colors.text}`}>
                                {skill.level}
                              </span>
                            </div>
                            <div className="relative h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                              <div
                                className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full transition-all duration-1000`}
                                style={{ width: `${skill.percentage}%` }}
                              >
                                <div
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                  style={{ animation: 'shimmer 2s infinite' }}
                                />
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">0%</span>
                              <span className={`font-bold text-lg ${colors.text}`}>
                                {skill.percentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
