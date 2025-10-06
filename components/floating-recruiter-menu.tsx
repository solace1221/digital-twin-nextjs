'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function FloatingRecruiterMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const downloadResume = () => {
    // Trigger resume download - you can create a PDF or link to existing one
    window.open('/resume-lovely-pearl-alan.pdf', '_blank')
  }

  const scheduleCall = () => {
    // Link to calendly or booking system
    window.open('https://calendly.com/lovelyalan692', '_blank')
  }

  const sendEmail = () => {
    window.location.href = 'mailto:lovelyalan692@gmail.com?subject=Opportunity from Pearl.AI Portfolio&body=Hi Lovely,%0D%0A%0D%0AI came across your Pearl.AI portfolio and...'
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Menu Items */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 space-y-2 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <button
            onClick={downloadResume}
            className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full px-5 py-3 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300 group w-full"
          >
            <span className="text-lg">📄</span>
            <span className="text-sm font-medium">Download Resume</span>
          </button>
          
          <button
            onClick={sendEmail}
            className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full px-5 py-3 text-white shadow-lg hover:shadow-pink-500/50 transition-all duration-300 group w-full"
          >
            <span className="text-lg">📧</span>
            <span className="text-sm font-medium">Email Me</span>
          </button>
          
          <button
            onClick={scheduleCall}
            className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full px-5 py-3 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300 group w-full"
          >
            <span className="text-lg">📅</span>
            <span className="text-sm font-medium">Schedule Call</span>
          </button>
          
          <a
            href="https://www.linkedin.com/in/lovely-pearl-alan-8746062b5"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full px-5 py-3 text-white shadow-lg hover:shadow-blue-500/50 transition-all duration-300 group w-full"
          >
            <span className="text-lg">💼</span>
            <span className="text-sm font-medium">LinkedIn</span>
          </a>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full px-6 py-4 text-white font-bold shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105"
      >
        <span className="text-xl">{isOpen ? '✕' : '👔'}</span>
        <span className="text-sm">For Recruiters</span>
      </button>
    </div>
  )
}
