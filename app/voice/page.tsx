"use client";

import React from "react";
import Link from "next/link";

export default function VoicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Voice AI Coming Soon
        </h1>
        
        <p className="text-xl text-gray-300 mb-8">
          Voice conversation with Pearl.AI is currently in development.
        </p>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-semibold mb-4">What's Coming:</h2>
          <ul className="text-left space-y-3 text-gray-200">
            <li className="flex items-start">
              <span className="mr-3">🎤</span>
              <span>Real-time voice conversations with Lovely Pearl's AI twin</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">💬</span>
              <span>Seamless switching between voice and text chat</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">🧠</span>
              <span>Same intelligent responses powered by RAG + LLaMA 3.1</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">🌐</span>
              <span>Bilingual support (English & Tagalog)</span>
            </li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/"
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            ← Back to Chat
          </Link>
          <button
            disabled
            className="px-8 py-3 bg-gray-600/50 rounded-full font-semibold cursor-not-allowed opacity-50"
          >
            🎤 Try Voice (Coming Soon)
          </button>
        </div>

        <div className="text-sm text-gray-400 mt-8">
          <p>Powered by OpenAI Realtime API + Upstash Vector Database</p>
        </div>
      </div>
    </div>
  );
}
