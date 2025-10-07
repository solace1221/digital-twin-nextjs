import os
from upstash_vector import Index
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Initialize Upstash Vector
index = Index(
    url=os.getenv('UPSTASH_VECTOR_REST_URL'),
    token=os.getenv('UPSTASH_VECTOR_REST_TOKEN')
)

# Search for any remaining vectors with "Developer" in TechFusion context
print("=" * 80)
print("SEARCHING FOR REMAINING OLD TECHFUSION VECTORS")
print("=" * 80)

test_query = "What was your role in TechFusion?"
results = index.query(
    data=test_query,
    top_k=10,
    include_metadata=True
)

print(f"\nQuery: '{test_query}'")
print(f"Found {len(results)} results:\n")

vectors_to_delete = []

for i, result in enumerate(results, 1):
    score = result.score
    vector_id = result.id
    metadata = result.metadata if hasattr(result, 'metadata') else {}
    
    if metadata:
        answer = metadata.get('answer', '')
        question = metadata.get('question', '')
        
        print(f"{i}. ID: {vector_id} (Score: {score:.4f})")
        print(f"   Q: {question[:80]}...")
        print(f"   A: {answer[:150]}...")
        
        # Check if this is an old vector with "Developer" role
        if "Developer" in answer and "TechFusion" in answer and "Team Leader and Developer" in answer:
            print(f"   ⚠️  OLD VECTOR - Contains 'Team Leader and Developer'")
            vectors_to_delete.append(vector_id)
        elif "Team Leader" in answer and "TechFusion" in answer:
            print(f"   ✅ CORRECTED - Contains 'Team Leader' (not Developer)")
        
        print()

# Delete any remaining old vectors
if vectors_to_delete:
    print("=" * 80)
    print(f"DELETING {len(vectors_to_delete)} ADDITIONAL OLD VECTORS")
    print("=" * 80)
    
    for vector_id in vectors_to_delete:
        try:
            print(f"🗑️  Deleting: {vector_id}")
            index.delete(ids=[vector_id])
            print(f"   ✅ Deleted")
        except Exception as e:
            print(f"   ❌ Error: {str(e)}")
else:
    print("=" * 80)
    print("✅ NO OLD VECTORS FOUND - All TechFusion answers are corrected!")
    print("=" * 80)

# Final verification
print("\n" + "=" * 80)
print("FINAL VERIFICATION")
print("=" * 80)

final_results = index.query(
    data="What was your role in TechFusion?",
    top_k=3,
    include_metadata=True
)

print("\nTop 3 results for 'What was your role in TechFusion?':\n")
for i, result in enumerate(final_results, 1):
    metadata = result.metadata if hasattr(result, 'metadata') else {}
    if metadata:
        answer = metadata.get('answer', '')
        print(f"{i}. {result.id} (Score: {result.score:.4f})")
        print(f"   Answer: {answer[:200]}...")
        
        if "Developer" in answer and "Team Leader and Developer" in answer:
            print(f"   ❌ STILL WRONG!")
        else:
            print(f"   ✅ CORRECT")
        print()
