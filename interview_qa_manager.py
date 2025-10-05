#!/usr/bin/env python3
"""
Interview Q&A Manager
Automatically saves interview questions and answers to:
1. Upstash Vector Database (for RAG retrieval)
2. digitaltwin.json (for persistent storage)

This allows the digital twin to learn and improve over time.
"""

import os
import json
from datetime import datetime
from dotenv import load_dotenv
from upstash_vector import Index
from groq import Groq

# Load environment variables
load_dotenv('.env.local')

# Constants
JSON_FILE = "data/digitaltwin.json"
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
DEFAULT_MODEL = "llama-3.1-8b-instant"

def setup_clients():
    """Setup Groq and Upstash clients"""
    try:
        groq_client = Groq(api_key=GROQ_API_KEY)
        vector_index = Index.from_env()
        return groq_client, vector_index
    except Exception as e:
        print(f"❌ Error setting up clients: {str(e)}")
        return None, None

def load_profile():
    """Load the digital twin profile from JSON"""
    try:
        with open(JSON_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Error loading profile: {str(e)}")
        return None

def save_profile(profile_data):
    """Save updated profile back to JSON file"""
    try:
        with open(JSON_FILE, "w", encoding="utf-8") as f:
            json.dump(profile_data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"❌ Error saving profile: {str(e)}")
        return False

def generate_qa_id(question):
    """Generate a unique ID for Q&A pair"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    question_slug = question.lower().replace(" ", "_")[:30]
    return f"qa_{question_slug}_{timestamp}"

def add_qa_to_json(profile_data, question, answer, category="interview"):
    """Add Q&A pair to JSON file in interview_qa section"""
    
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
    
    # Add to appropriate category
    if category not in profile_data["interview_qa"]["categories"]:
        profile_data["interview_qa"]["categories"][category] = []
    
    profile_data["interview_qa"]["categories"][category].append(qa_entry)
    
    # Update metadata
    profile_data["interview_qa"]["questions_answered"] = profile_data["interview_qa"].get("questions_answered", 0) + 1
    profile_data["interview_qa"]["last_updated"] = datetime.now().isoformat()
    
    return profile_data

def add_qa_to_vector_db(vector_index, question, answer, category):
    """Add Q&A pair to Upstash Vector Database"""
    try:
        qa_id = generate_qa_id(question)
        
        # Create enriched text for better retrieval
        enriched_text = f"Interview Question: {question}\n\nAnswer: {answer}"
        
        # Prepare vector with metadata
        vector = (
            qa_id,
            enriched_text,
            {
                "type": "interview_qa",
                "question": question,
                "answer": answer,
                "category": category,
                "title": f"Interview Q&A: {question[:50]}...",
                "content": answer,
                "tags": f"interview,qa,{category}",
                "added_date": datetime.now().isoformat()
            }
        )
        
        # Upload to vector database
        vector_index.upsert(vectors=[vector])
        print(f"✅ Added to vector database: {qa_id}")
        return True
        
    except Exception as e:
        print(f"❌ Error adding to vector database: {str(e)}")
        return False

def categorize_question(question):
    """Automatically categorize question based on keywords"""
    question_lower = question.lower()
    
    # Category keywords
    categories = {
        "personal": ["yourself", "background", "who are you", "about you", "introduce"],
        "technical": ["programming", "language", "database", "code", "technical", "skills", "technology"],
        "projects": ["project", "capstone", "coil", "built", "developed", "created"],
        "leadership": ["leadership", "lead", "team", "president", "manage", "organize"],
        "behavioral": ["time when", "describe a", "challenge", "difficult", "conflict", "failure"],
        "career": ["career", "goals", "future", "5 years", "aspire", "want to"],
    }
    
    # Check each category
    for category, keywords in categories.items():
        if any(keyword in question_lower for keyword in keywords):
            return category
    
    return "general"

def save_qa_pair(question, answer, category=None):
    """
    Main function to save Q&A pair to both JSON and Vector DB
    """
    print("\n💾 Saving Q&A pair...")
    
    # Auto-categorize if not provided
    if category is None:
        category = categorize_question(question)
        print(f"📂 Auto-categorized as: {category}")
    
    # Setup clients
    groq_client, vector_index = setup_clients()
    if not vector_index:
        print("❌ Failed to setup vector database")
        return False
    
    # Load profile
    profile_data = load_profile()
    if not profile_data:
        print("❌ Failed to load profile")
        return False
    
    # Add to JSON
    print("📝 Adding to JSON file...")
    profile_data = add_qa_to_json(profile_data, question, answer, category)
    
    # Save JSON
    if save_profile(profile_data):
        print("✅ Saved to JSON file")
    else:
        print("❌ Failed to save to JSON file")
        return False
    
    # Add to Vector DB
    print("🔄 Adding to vector database...")
    if add_qa_to_vector_db(vector_index, question, answer, category):
        print("✅ Saved to vector database")
    else:
        print("⚠️ Failed to save to vector database, but JSON is updated")
    
    print(f"\n🎉 Successfully saved Q&A pair!")
    print(f"📊 Total questions answered: {profile_data['interview_qa']['questions_answered']}")
    
    return True

def interactive_qa_session():
    """Interactive session to add multiple Q&A pairs"""
    print("🎯 Interview Q&A Learning Session")
    print("=" * 50)
    print("Add interview questions and answers to your digital twin.")
    print("Type 'done' when finished.\n")
    
    qa_count = 0
    
    while True:
        print("\n" + "=" * 50)
        question = input("❓ Enter interview question (or 'done' to finish): ").strip()
        
        if question.lower() == 'done':
            break
        
        if not question:
            print("⚠️ Question cannot be empty")
            continue
        
        answer = input("💬 Enter your answer: ").strip()
        
        if not answer:
            print("⚠️ Answer cannot be empty")
            continue
        
        # Optional: manual category selection
        print("\n📂 Categories: personal, technical, projects, leadership, behavioral, career, general")
        category = input("Category (press Enter for auto-detect): ").strip().lower()
        
        if not category:
            category = None  # Will auto-categorize
        
        # Save the Q&A pair
        if save_qa_pair(question, answer, category):
            qa_count += 1
            print(f"✅ Saved! ({qa_count} questions added this session)")
        else:
            print("❌ Failed to save this Q&A pair")
    
    print(f"\n🎉 Session complete! Added {qa_count} new Q&A pairs.")
    print("Your digital twin is now smarter! 🚀")

def bulk_import_from_text(file_path):
    """Import Q&A pairs from a text file"""
    print(f"📥 Importing Q&A pairs from {file_path}...")
    
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Parse Q&A pairs (expecting format: Q: question\nA: answer\n\n)
        qa_pairs = []
        sections = content.split("\n\n")
        
        for section in sections:
            lines = section.strip().split("\n")
            if len(lines) >= 2:
                question_line = lines[0].strip()
                answer_lines = lines[1:]
                
                if question_line.startswith("Q:") or question_line.startswith("Question:"):
                    question = question_line.split(":", 1)[1].strip()
                    answer = "\n".join([line.split(":", 1)[1].strip() if ":" in line else line for line in answer_lines])
                    qa_pairs.append((question, answer))
        
        # Save all Q&A pairs
        success_count = 0
        for question, answer in qa_pairs:
            if save_qa_pair(question, answer):
                success_count += 1
        
        print(f"\n✅ Imported {success_count}/{len(qa_pairs)} Q&A pairs successfully!")
        
    except Exception as e:
        print(f"❌ Error importing: {str(e)}")

def view_saved_qa():
    """View all saved Q&A pairs"""
    profile_data = load_profile()
    if not profile_data or "interview_qa" not in profile_data:
        print("❌ No Q&A pairs found")
        return
    
    qa_data = profile_data["interview_qa"]
    print("\n📊 Interview Q&A Database")
    print("=" * 50)
    print(f"Total questions answered: {qa_data.get('questions_answered', 0)}")
    print(f"Last updated: {qa_data.get('last_updated', 'Never')}")
    print("\nQuestions by category:")
    
    for category, questions in qa_data.get("categories", {}).items():
        if questions:
            print(f"\n📂 {category.upper()} ({len(questions)} questions)")
            for i, qa in enumerate(questions, 1):
                print(f"  {i}. {qa['question'][:60]}...")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "view":
            view_saved_qa()
        elif command == "import" and len(sys.argv) > 2:
            bulk_import_from_text(sys.argv[2])
        else:
            print("Usage:")
            print("  python interview_qa_manager.py           - Interactive Q&A session")
            print("  python interview_qa_manager.py view      - View saved Q&A pairs")
            print("  python interview_qa_manager.py import <file> - Import from text file")
    else:
        interactive_qa_session()
