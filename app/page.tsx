import DigitalTwinInterface from "@/components/digital-twin-interface";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Digital Twin MCP Server
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            A Model Context Protocol server for professional profile semantic search 
            using RAG (Retrieval-Augmented Generation) with Groq LLM and Upstash Vector.
          </p>
        </div>
        
        <DigitalTwinInterface />
      </div>
    </main>
  );
}
