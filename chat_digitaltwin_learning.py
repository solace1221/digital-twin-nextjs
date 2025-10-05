#!/usr/bin/env python3
"""
Digital Twin RAG Application with Learning Capability
Automatically saves every Q&A interaction to improve over time
"""

import os
import json
from datetime import datetime
from dotenv import load_dotenv
from upstash_vector import Index
from groq import Groq

# Load environment variables from .env.local
load_dotenv('.env.local')

# Constants
JSON_FILE = "data/digitaltwin.json"
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
DEFAULT_MODEL = "llama-3.1-8b-instant"

def setup_groq_client():
    """Setup Groq client"""
    if not GROQ_API_KEY:
        print("❌ GROQ_API_KEY not found in .env file")
        return None
    
    try:
        client = Groq(api_key=GROQ_API_KEY)
        print("✅ Groq client initialized successfully!")
        return client
    except Exception as e:
        print(f"❌ Error initializing Groq client: {str(e)}")
        return None

def setup_vector_database():
    """Setup Upstash Vector database with built-in embeddings"""
    print("🔄 Setting up Upstash Vector database...")
    
    try:
        index = Index.from_env()
        print("✅ Connected to Upstash Vector successfully!")
        
        # Check current vector count
        try:
            info = index.info()
            current_count = getattr(info, 'vector_count', 0)
            print(f"📊 Current vectors in database: {current_count}")
        except:
            current_count = 0
        
        # Load data if database is empty
        if current_count == 0:
            print("📝 Loading your professional profile...")
            
            try:
                with open(JSON_FILE, "r", encoding="utf-8") as f:
                    profile_data = json.load(f)
                    
            except FileNotFoundError:
                print(f"❌ {JSON_FILE} not found!")
                return None
            
            # Prepare vectors from content chunks
            vectors = []
            content_chunks = profile_data.get('content_chunks', [])
            
            if not content_chunks:
                print("❌ No content chunks found in profile data")
                return None
            
            for chunk in content_chunks:
                enriched_text = f"{chunk['title']}: {chunk['content']}"
                
                vectors.append((
                    chunk['id'],
                    enriched_text,
                    {
                        "title": chunk['title'],
                        "type": chunk['type'],
                        "content": chunk['content'],
                        "category": chunk.get('metadata', {}).get('category', ''),
                        "tags": ','.join(chunk.get('metadata', {}).get('tags', []))
                    }
                ))
            
            # Upload vectors
            index.upsert(vectors=vectors)
            print(f"✅ Successfully uploaded {len(vectors)} content chunks!")
        
        return index
        
    except Exception as e:
        print(f"❌ Error setting up database: {str(e)}")
        return None

def query_vectors(index, query_text, top_k=3):
    """Query Upstash Vector for similar vectors"""
    try:
        results = index.query(
            data=query_text,
            top_k=top_k,
            include_metadata=True
        )
        return results
    except Exception as e:
        print(f"❌ Error querying vectors: {str(e)}")
        return None

def generate_response_with_groq(client, prompt, model=DEFAULT_MODEL):
    """Generate response using Groq"""
    try:
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You are Lovely Pearl B. Alan, a BSIT student at St. Paul University Philippines. Answer all questions in FIRST PERSON as if YOU are Lovely speaking directly about YOUR OWN background, skills, and experience. Always use 'I', 'my', 'me' - NEVER refer to Lovely in third person. Be honest and natural - you're a talented student with real achievements, currently pursuing your degree and looking for opportunities to grow."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        return completion.choices[0].message.content.strip()
        
    except Exception as e:
        return f"❌ Error generating response: {str(e)}"

def categorize_question(question):
    """Automatically categorize question based on keywords"""
    question_lower = question.lower()
    
    categories = {
        "personal": ["yourself", "background", "who are you", "about you", "introduce", "age", "birthday"],
        "technical": ["programming", "language", "database", "code", "technical", "skills", "technology", "framework"],
        "projects": ["project", "capstone", "coil", "built", "developed", "created", "application"],
        "leadership": ["leadership", "lead", "team", "president", "manage", "organize", "jpcs", "student government"],
        "behavioral": ["time when", "describe a", "challenge", "difficult", "conflict", "failure", "handle"],
        "career": ["career", "goals", "future", "5 years", "aspire", "want to", "looking for"],
    }
    
    for category, keywords in categories.items():
        if any(keyword in question_lower for keyword in keywords):
            return category
    
    return "general"

def save_qa_to_json(question, answer, category):
    """Save Q&A pair to JSON file"""
    try:
        # Load current profile
        with open(JSON_FILE, "r", encoding="utf-8") as f:
            profile_data = json.load(f)
        
        # Ensure interview_qa section exists
        if "interview_qa" not in profile_data:
            profile_data["interview_qa"] = {
                "questions_answered": 0,
                "last_updated": None,
                "categories": {
                    "personal": [],
                    "technical": [],
                    "projects": [],
                    "leadership": [],
                    "behavioral": [],
                    "career": [],
                    "general": []
                }
            }
        
        # Create Q&A entry
        qa_entry = {
            "question": question,
            "answer": answer,
            "category": category,
            "added_date": datetime.now().isoformat(),
            "times_asked": 1
        }
        
        # Check if question already exists
        existing_category = profile_data["interview_qa"]["categories"].get(category, [])
        question_exists = False
        
        for existing_qa in existing_category:
            if existing_qa["question"].lower() == question.lower():
                existing_qa["times_asked"] += 1
                existing_qa["answer"] = answer  # Update with latest answer
                question_exists = True
                break
        
        if not question_exists:
            # Add new Q&A
            if category not in profile_data["interview_qa"]["categories"]:
                profile_data["interview_qa"]["categories"][category] = []
            
            profile_data["interview_qa"]["categories"][category].append(qa_entry)
            profile_data["interview_qa"]["questions_answered"] = profile_data["interview_qa"].get("questions_answered", 0) + 1
        
        # Update metadata
        profile_data["interview_qa"]["last_updated"] = datetime.now().isoformat()
        
        # Save back to file
        with open(JSON_FILE, "w", encoding="utf-8") as f:
            json.dump(profile_data, f, indent=2, ensure_ascii=False)
        
        return True
        
    except Exception as e:
        print(f"⚠️ Error saving to JSON: {str(e)}")
        return False

def save_qa_to_vector_db(index, question, answer, category):
    """Save Q&A pair to Upstash Vector Database"""
    try:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        qa_id = f"qa_{category}_{timestamp}"
        
        # Create enriched text
        enriched_text = f"Interview Question: {question}\n\nAnswer: {answer}"
        
        # Prepare vector
        vector = (
            qa_id,
            enriched_text,
            {
                "type": "interview_qa",
                "question": question,
                "answer": answer,
                "category": category,
                "title": f"Q&A: {question[:50]}",
                "content": answer,
                "tags": f"interview,qa,{category}",
                "added_date": datetime.now().isoformat()
            }
        )
        
        # Upload to vector database
        index.upsert(vectors=[vector])
        return True
        
    except Exception as e:
        print(f"⚠️ Error saving to vector DB: {str(e)}")
        return False

def rag_query(index, groq_client, question, save_response=True):
    """Perform RAG query using Upstash Vector + Groq"""
    try:
        # Step 1: Query vector database
        results = query_vectors(index, question, top_k=3)
        
        if not results or len(results) == 0:
            return "I don't have specific information about that topic."
        
        # Step 2: Extract relevant content
        print("\n🧠 Searching your professional profile...")
        
        top_docs = []
        for result in results:
            metadata = result.metadata or {}
            title = metadata.get('title', 'Information')
            content = metadata.get('content', '')
            score = result.score
            
            print(f"🔹 Found: {title} (Relevance: {score:.3f})")
            if content:
                top_docs.append(f"{title}: {content}")
        
        if not top_docs:
            return "I found some information but couldn't extract details."
        
        print(f"⚡ Generating personalized response...\n")
        
        # Step 3: Generate response with context
        context = "\n\n".join(top_docs)
        prompt = f"""Based on the following information about you (Lovely Pearl B. Alan), answer the question in FIRST PERSON.

Important: You ARE Lovely. Use "I", "my", "me" throughout your answer. Never refer to yourself in third person.

Your Information:
{context}

Question: {question}

Answer as Lovely herself:"""
        
        response = generate_response_with_groq(groq_client, prompt)
        
        # Step 4: Save Q&A pair (if enabled)
        if save_response and response and not response.startswith("❌"):
            category = categorize_question(question)
            print(f"\n💾 Learning from this interaction (category: {category})...")
            
            # Save to JSON
            if save_qa_to_json(question, response, category):
                print("✅ Saved to JSON")
            
            # Save to Vector DB
            if save_qa_to_vector_db(index, question, response, category):
                print("✅ Saved to vector database")
            
            print("🧠 Digital twin is getting smarter!")
        
        return response
    
    except Exception as e:
        return f"❌ Error during query: {str(e)}"

def main():
    """Main application loop"""
    print("🤖 Your Digital Twin - AI Profile Assistant (Learning Mode)")
    print("=" * 60)
    print("🔗 Vector Storage: Upstash (built-in embeddings)")
    print(f"⚡ AI Inference: Groq ({DEFAULT_MODEL})")
    print("📋 Data Source: Your Professional Profile")
    print("🧠 Auto-Learning: Every Q&A is saved for future improvement\n")
    
    # Setup clients
    groq_client = setup_groq_client()
    if not groq_client:
        return
    
    index = setup_vector_database()
    if not index:
        return
    
    print("✅ Your Digital Twin is ready!\n")
    
    # Interactive chat loop
    print("🤖 Chat with your AI Digital Twin!")
    print("Every question and answer will be saved to improve future responses.")
    print("Type 'exit' to quit.\n")
    
    print("💭 Try asking:")
    print("  - 'Tell me about your work experience'")
    print("  - 'What are your technical skills?'")
    print("  - 'Describe your career goals'")
    print("  - 'Tell me about your capstone project'")
    print()
    
    qa_count = 0
    
    while True:
        question = input("You: ")
        if question.lower() in ["exit", "quit"]:
            print(f"\n👋 Thanks for chatting with your Digital Twin!")
            print(f"🧠 Learned from {qa_count} new questions this session.")
            print("Your digital twin is smarter now! 🚀")
            break
        
        if question.strip():
            answer = rag_query(index, groq_client, question, save_response=True)
            print(f"🤖 Digital Twin: {answer}\n")
            qa_count += 1

if __name__ == "__main__":
    main()
