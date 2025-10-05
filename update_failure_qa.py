#!/usr/bin/env python3
"""
Update the 'time you failed' Q&A in vector database
Removes Treasurer budget story, adds general communication lesson
"""

from upstash_vector import Index
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv('.env.local')

# Initialize Upstash Vector
index = Index.from_env()

def update_failure_qa():
    """Update the failure question with correct answer"""
    
    print("🔍 Searching for old 'time you failed' vectors...")
    
    # Search for vectors related to failure/Treasurer story
    results = index.query(
        data="Tell me about a time you failed Treasurer budget approval",
        top_k=5,
        include_metadata=True
    )
    
    print(f"\n📊 Found {len(results)} related vectors:")
    for i, result in enumerate(results, 1):
        vector_id = result.id
        title = result.metadata.get('title', 'N/A')
        print(f"{i}. ID: {vector_id}")
        print(f"   Title: {title}")
        print(f"   Score: {result.score:.3f}")
        
        # Delete if it's about Treasurer/budget/failed
        if any(keyword in str(result.id).lower() or keyword in str(title).lower() 
               for keyword in ['treasurer', 'failed', 'time you failed', 'qa_tell_me_about_a_time_you_fai']):
            print(f"   🗑️  Deleting this vector (contains old Treasurer story)")
            try:
                index.delete(ids=[vector_id])
                print(f"   ✅ Deleted: {vector_id}")
            except Exception as e:
                print(f"   ❌ Error deleting: {e}")
    
    # Load the updated answer from JSON
    print("\n📂 Loading updated failure Q&A from digitaltwin.json...")
    with open('data/digitaltwin.json', 'r', encoding='utf-8') as f:
        profile = json.load(f)
    
    # Find the updated failure Q&A
    failure_qa = None
    for category_name, qa_list in profile.get('interview_qa', {}).get('categories', {}).items():
        for qa in qa_list:
            if 'failed' in qa.get('question', '').lower():
                failure_qa = qa
                print(f"✅ Found updated Q&A in category: {category_name}")
                break
        if failure_qa:
            break
    
    if not failure_qa:
        print("❌ Could not find failure Q&A in digitaltwin.json")
        return
    
    # Create new vector content
    vector_content = f"""Question: {failure_qa['question']}

Answer: {failure_qa['answer']}

Category: {failure_qa.get('category', 'general')}
Added: {failure_qa.get('added_date', 'N/A')}"""
    
    # Upload new vector
    print("\n📤 Uploading updated failure Q&A to vector database...")
    new_vector_id = "qa_tell_me_about_a_time_you_failed_updated"
    
    index.upsert(
        vectors=[
            {
                "id": new_vector_id,
                "data": vector_content,
                "metadata": {
                    "type": "interview_qa",
                    "question": failure_qa['question'],
                    "category": failure_qa.get('category', 'general'),
                    "title": f"Interview Q&A: {failure_qa['question'][:50]}...",
                    "added_date": failure_qa.get('added_date', 'N/A')
                }
            }
        ]
    )
    
    print(f"✅ Uploaded new vector: {new_vector_id}")
    
    # Verify
    print("\n🔍 Testing updated database...")
    test_results = index.query(
        data="Tell me about a time you failed",
        top_k=3,
        include_metadata=True
    )
    
    print("\n🎯 Top Results for 'Tell me about a time you failed':")
    for i, result in enumerate(test_results, 1):
        print(f"\n{i}. {result.metadata.get('title', 'N/A')} (Score: {result.score:.3f})")
        if 'treasurer' in str(result.metadata).lower():
            print("   ⚠️  WARNING: Still contains Treasurer reference!")
        else:
            print("   ✅ No Treasurer reference")

if __name__ == "__main__":
    print("=" * 70)
    print("🔧 UPDATING 'TIME YOU FAILED' Q&A IN VECTOR DATABASE")
    print("=" * 70)
    print("\nRemoving: Treasurer budget approval story (NOT TRUE)")
    print("Adding: Communication and assumption lesson (AUTHENTIC)\n")
    
    update_failure_qa()
    
    print("\n" + "=" * 70)
    print("✅ FAILURE Q&A UPDATED!")
    print("=" * 70)
    print("\nYour digital twin now has:")
    print("✅ Generic leadership communication lesson")
    print("✅ No specific Treasurer budget story")
    print("✅ Authentic experience about verifying understanding")
    print()
