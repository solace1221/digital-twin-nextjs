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

# Test the exact query
query = "What was your role in TechFusion?"
results = index.query(
    data=query,
    top_k=3,
    include_metadata=True
)

print("=" * 80)
print(f"DEBUGGING: Query = '{query}'")
print("=" * 80)

for i, result in enumerate(results, 1):
    print(f"\n--- Result {i} (Score: {result.score:.4f}) ---")
    print(f"ID: {result.id}")
    
    if hasattr(result, 'metadata') and result.metadata:
        print(f"\nMetadata keys: {list(result.metadata.keys())}")
        print(f"\nFull metadata:")
        for key, value in result.metadata.items():
            print(f"  {key}: {value[:200] if isinstance(value, str) and len(value) > 200 else value}...")
    else:
        print("NO METADATA!")
    
    # Simulate what the RAG system does
    title = result.metadata.get('title', 'Information') if hasattr(result, 'metadata') and result.metadata else 'Information'
    content = result.metadata.get('content', '') if hasattr(result, 'metadata') and result.metadata else ''
    answer = result.metadata.get('answer', '') if hasattr(result, 'metadata') and result.metadata else ''
    question = result.metadata.get('question', '') if hasattr(result, 'metadata') and result.metadata else ''
    
    print(f"\n--- What RAG system sees ---")
    print(f"Title: {title}")
    print(f"Content: {content[:200] if content else 'EMPTY'}...")
    print(f"Answer: {answer[:200] if answer else 'EMPTY'}...")
    print(f"Question: {question[:200] if question else 'EMPTY'}...")

# Show what context would be built
print("\n" + "=" * 80)
print("CONTEXT THAT WOULD BE SENT TO LLM")
print("=" * 80)

context_parts = []
for result in results:
    if hasattr(result, 'metadata') and result.metadata:
        title = result.metadata.get('title', 'Information')
        content = result.metadata.get('content', '')
        context_parts.append(f"{title}: {content}")

context = '\n\n'.join(context_parts)
print(context)

if not context.strip():
    print("⚠️ WARNING: CONTEXT IS EMPTY!")
    print("This is why LLM says 'I don't have that specific information'")
