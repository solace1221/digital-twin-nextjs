"""
Push Updated Q&A Database to Upstash Vector

This script uploads the comprehensive Q&A database with 100+ questions to Upstash Vector.
Successfully uploads Q&A pairs using the /upsert-data endpoint which automatically 
handles text embedding via Upstash's built-in embedding model.
"""

import os
import sys
from dotenv import load_dotenv
import requests
from datetime import datetime
import hashlib

# Load environment variables from .env.local
load_dotenv('.env.local')

def create_vector_id(text: str, prefix: str = "qa") -> str:
    """Create a deterministic ID from text content"""
    hash_object = hashlib.md5(text.encode())
    return f"{prefix}_{hash_object.hexdigest()[:12]}"

def main():
    # Get Upstash credentials
    upstash_url = os.getenv("UPSTASH_VECTOR_REST_URL")
    upstash_token = os.getenv("UPSTASH_VECTOR_REST_TOKEN")
    
    if not upstash_url or not upstash_token:
        print("❌ Error: Upstash credentials not found in .env.local")
        return 0, ["Missing credentials"]
    
    headers = {
        'Authorization': f'Bearer {upstash_token}',
        'Content-Type': 'application/json'
    }
    
    print("🚀 Starting Q&A database update to Upstash Vector...")
    print(f"⏰ Timestamp: {datetime.now().isoformat()}")
    print(f"📍 Upstash URL: {upstash_url[:50]}...")
    print("✅ Credentials loaded from .env.local")
    
    # Parse comprehensive Q&A from file
    qa_pairs = []
    try:
        with open('comprehensive_qa_update.txt', 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Parse Q&A pairs from the file
        # Format: Q: question\nA: answer\n
        current_question = None
        current_answer = []
        current_category = "general"
        
        for line in content.split('\n'):
            line = line.strip()
            
            # Skip empty lines and headers
            if not line or line.startswith('#') or line.startswith('='):
                continue
            
            # Detect category headers
            if line.startswith('##'):
                current_category = line.replace('#', '').strip().lower().replace(' ', '_')
                continue
            
            # Parse question
            if line.startswith('Q:'):
                # Save previous Q&A if exists
                if current_question and current_answer:
                    qa_pairs.append({
                        "question": current_question,
                        "answer": ' '.join(current_answer).strip(),
                        "category": current_category
                    })
                
                current_question = line[2:].strip()
                current_answer = []
            
            # Parse answer
            elif line.startswith('A:'):
                current_answer = [line[2:].strip()]
            
            # Continue multi-line answer
            elif current_question and not line.startswith('Q:'):
                current_answer.append(line)
        
        # Don't forget the last Q&A pair
        if current_question and current_answer:
            qa_pairs.append({
                "question": current_question,
                "answer": ' '.join(current_answer).strip(),
                "category": current_category
            })
        
        print(f"📝 Parsed {len(qa_pairs)} Q&A pairs from comprehensive_qa_update.txt")
        
    except FileNotFoundError:
        print("⚠️  comprehensive_qa_update.txt not found, using sample Q&A pairs...")
        qa_pairs = [
            {
                "question": "What's your biggest achievement?",
                "answer": "My biggest achievement is developing the Good Moral Application and Monitoring System with Decision Support using Laravel and SQL.",
                "category": "achievements"
            }
        ]
    
    vectors_upserted = 0
    errors = []
    
    # Upsert vectors to Upstash
    for idx, qa in enumerate(qa_pairs, 1):
        try:
            # Create combined text for embedding
            combined_text = f"Q: {qa['question']}\nA: {qa['answer']}"
            
            # Create deterministic ID
            vector_id = create_vector_id(combined_text, prefix="qa_updated")
            
            # Prepare upsert data (Upstash format - single dict, not array)
            upsert_data = {
                "id": vector_id,
                "data": combined_text,
                "metadata": {
                    "question": qa["question"],
                    "answer": qa["answer"],
                    "category": qa.get("category", "general"),
                    "updated_at": datetime.now().isoformat(),
                    "type": "qa_pair"
                }
            }
            
            # Upsert to Upstash via REST API (using /upsert-data for automatic embedding)
            response = requests.post(
                f"{upstash_url}/upsert-data",
                headers=headers,
                json=upsert_data
            )
            
            if response.status_code == 200:
                vectors_upserted += 1
                print(f"✅ Upserted {idx}/{len(qa_pairs)}: {qa['question'][:60]}...")
            else:
                error_msg = f"❌ Error upserting Q&A {idx}: HTTP {response.status_code} - {response.text}"
                errors.append(error_msg)
                print(error_msg)
            
        except Exception as e:
            error_msg = f"❌ Error upserting Q&A {idx}: {str(e)}"
            errors.append(error_msg)
            print(error_msg)
    
    # Print summary
    print("\n" + "="*80)
    print(f"📊 UPLOAD SUMMARY")
    print("="*80)
    print(f"✅ Successfully upserted: {vectors_upserted} vectors")
    print(f"❌ Errors encountered: {len(errors)}")
    
    if errors:
        print("\n⚠️  Error details:")
        for error in errors:
            print(f"  {error}")
    
    print("\n✨ Q&A database update complete!")
    print(f"📈 Added {vectors_upserted} new Q&A pairs to Upstash Vector")
    print(f"🎯 Your Pearl.AI knowledge base has been expanded!")
    
    return vectors_upserted, errors

if __name__ == "__main__":
    try:
        vectors_upserted, errors = main()
        sys.exit(0 if len(errors) == 0 else 1)
    except Exception as e:
        print(f"\n💥 Fatal error: {e}")
        sys.exit(1)
