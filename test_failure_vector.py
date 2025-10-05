#!/usr/bin/env python3
from upstash_vector import Index
from dotenv import load_dotenv

load_dotenv('.env.local')
index = Index.from_env()

print("🔍 Searching for: 'Tell me about a time you failed'\n")
results = index.query(
    data="Tell me about a time you failed and what you learned",
    top_k=1,
    include_metadata=True
)

if results:
    result = results[0]
    print(f"Top Result:")
    print(f"  ID: {result.id}")
    print(f"  Score: {result.score:.3f}")
    print(f"  Title: {result.metadata.get('title', 'N/A')}")
    print(f"  Category: {result.metadata.get('category', 'N/A')}")
    
    # Check if it mentions Treasurer
    result_str = str(result.metadata)
    if 'treasurer' in result_str.lower() or 'budget' in result_str.lower():
        print("\n⚠️  WARNING: Result still contains Treasurer/budget reference!")
    else:
        print("\n✅ No Treasurer/budget reference found")
else:
    print("❌ No results found")
