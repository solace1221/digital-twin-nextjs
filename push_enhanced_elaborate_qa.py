"""
Push Enhanced Elaborate Q&A pairs to Upstash Vector Database
Replaces short answers with longer, more detailed, conversational responses
"""

import os
import requests
import hashlib
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv('.env.local')

# Get credentials
UPSTASH_URL = os.getenv('UPSTASH_VECTOR_REST_URL')
UPSTASH_TOKEN = os.getenv('UPSTASH_VECTOR_REST_TOKEN')

if not UPSTASH_URL or not UPSTASH_TOKEN:
    print("❌ Error: Missing Upstash credentials in .env.local")
    exit(1)

def create_vector_id(question: str, prefix: str = "enhanced_qa") -> str:
    """Create a deterministic ID from the question"""
    hash_object = hashlib.md5(question.encode())
    return f"{prefix}_{hash_object.hexdigest()[:12]}"

def parse_qa_file(filename: str) -> list:
    """Parse the Q&A file and return list of QA pairs"""
    qa_pairs = []
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Split by Q: to get individual QA pairs
        sections = content.split('\nQ: ')[1:]  # Skip header
        
        for section in sections:
            lines = section.strip().split('\n')
            if len(lines) >= 2:
                question = lines[0].strip()
                
                # Find the answer (starts with A:)
                answer_lines = []
                in_answer = False
                for line in lines[1:]:
                    if line.startswith('A: '):
                        in_answer = True
                        answer_lines.append(line[3:])  # Remove 'A: ' prefix
                    elif in_answer:
                        if line.startswith('Q: ') or line.startswith('## '):
                            break
                        answer_lines.append(line)
                
                if answer_lines:
                    answer = ' '.join(answer_lines).strip()
                    qa_pairs.append({
                        'question': question,
                        'answer': answer
                    })
        
        return qa_pairs
    
    except FileNotFoundError:
        print(f"❌ Error: File {filename} not found")
        return []
    except Exception as e:
        print(f"❌ Error parsing file: {e}")
        return []

def upload_to_upstash(qa_pairs: list) -> None:
    """Upload QA pairs to Upstash using /upsert-data endpoint"""
    
    endpoint = f"{UPSTASH_URL}/upsert-data"
    headers = {
        "Authorization": f"Bearer {UPSTASH_TOKEN}",
        "Content-Type": "application/json"
    }
    
    success_count = 0
    error_count = 0
    
    print(f"\n🚀 Starting upload of {len(qa_pairs)} enhanced Q&A pairs...\n")
    
    for idx, qa in enumerate(qa_pairs, 1):
        question = qa['question']
        answer = qa['answer']
        
        # Create vector ID
        vector_id = create_vector_id(question, prefix="enhanced_qa")
        
        # Prepare the data for upstash
        # Combine question and answer for embedding
        combined_text = f"Q: {question}\nA: {answer}"
        
        payload = {
            "id": vector_id,
            "data": combined_text,
            "metadata": {
                "question": question,
                "answer": answer,
                "category": "enhanced_profile",
                "timestamp": datetime.now().isoformat(),
                "type": "qa_pair",
                "enhanced": True,
                "source": "elaborate_qa_update"
            }
        }
        
        try:
            response = requests.post(endpoint, json=payload, headers=headers)
            
            if response.status_code == 200:
                success_count += 1
                print(f"✅ [{idx}/{len(qa_pairs)}] Uploaded: {question[:60]}...")
            else:
                error_count += 1
                print(f"❌ [{idx}/{len(qa_pairs)}] Failed: {question[:60]}...")
                print(f"   Status: {response.status_code}, Response: {response.text}")
        
        except Exception as e:
            error_count += 1
            print(f"❌ [{idx}/{len(qa_pairs)}] Error uploading: {e}")
    
    print(f"\n{'='*60}")
    print(f"✅ Successfully upserted: {success_count} vectors")
    print(f"❌ Errors encountered: {error_count}")
    print(f"{'='*60}\n")

def main():
    """Main function"""
    print("="*60)
    print("Enhanced Elaborate Q&A Upload to Upstash Vector")
    print("="*60)
    
    # Parse the enhanced elaborate QA file
    qa_pairs = parse_qa_file('enhanced_elaborate_qa.txt')
    
    if not qa_pairs:
        print("❌ No Q&A pairs found to upload")
        return
    
    print(f"\n📊 Found {len(qa_pairs)} Q&A pairs in enhanced_elaborate_qa.txt")
    print(f"🎯 Target: {UPSTASH_URL}")
    
    # Upload to Upstash
    upload_to_upstash(qa_pairs)
    
    print("\n✨ Enhanced Q&A upload complete!")

if __name__ == "__main__":
    main()
