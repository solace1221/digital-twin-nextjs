# URGENT: Environment Variables Required for MCP Server
# Create this file as .env.local in your project root

# Upstash Vector Database Configuration
# Get these from https://console.upstash.com/vector
UPSTASH_VECTOR_REST_URL=https://your-vector-xxxxx.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your_upstash_token_here

# Groq API Configuration  
# Get your API key from https://console.groq.com/keys
GROQ_API_KEY=gsk_your_groq_api_key_here

# Instructions:
# 1. Copy this file to .env.local
# 2. Replace the placeholder values with your actual credentials
# 3. Restart the development server (pnpm dev)
# 4. Never commit .env.local to version control

# How to get credentials:
# 
# Upstash Vector:
# 1. Go to https://console.upstash.com/vector
# 2. Create a new vector database (if you don't have one)
# 3. Copy the REST URL and REST TOKEN from your database settings
# 
# Groq API:
# 1. Go to https://console.groq.com/keys
# 2. Create a new API key
# 3. Copy the key (starts with gsk_)