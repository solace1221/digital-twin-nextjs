# Digital Twin Next.js MCP Project

A Next.js application with Model Context Protocol (MCP) integration for AI-powered digital twin functionality.

## 🚀 Project Overview

This project combines Next.js with MCP (Model Context Protocol) to create an interactive digital twin application that can:
- Provide intelligent responses about professional background
- Handle real-time chat interactions
- Integrate with RAG (Retrieval-Augmented Generation) systems
- Serve as a personal AI assistant

## 🛠 Technology Stack

- **Frontend**: Next.js 15.5.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Development**: Turbopack for faster builds
- **Linting**: ESLint
- **AI Integration**: Groq API, Upstash Vector
- **Protocol**: Model Context Protocol (MCP)

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ (Current: v22.18.0)
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd digital-twin-nextjs

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

### Environment Variables
```env
# Groq API
GROQ_API_KEY=your_groq_api_key

# Upstash Vector
UPSTASH_VECTOR_REST_URL=your_upstash_url
UPSTASH_VECTOR_REST_TOKEN=your_upstash_token

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint
