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

# Test queries to verify corrections are searchable
test_queries = [
    "What was your role in TechFusion?",
    "TechFusion project role",
    "Team Leader TechFusion",
    "What is your capstone project?",
    "What year level are you in college?",
    "What are your grades?"
]

print("=" * 80)
print("TESTING UPSTASH VECTOR SEARCH - Verifying Corrections Are Retrievable")
print("=" * 80)

for query in test_queries:
    print(f"\n🔍 Query: '{query}'")
    print("-" * 80)
    
    try:
        results = index.query(
            data=query,
            top_k=3,
            include_metadata=True
        )
        
        if not results:
            print("❌ No results found!")
        else:
            for i, result in enumerate(results, 1):
                score = result.score
                vector_id = result.id
                metadata = result.metadata if hasattr(result, 'metadata') else {}
                
                print(f"\n   Result #{i} (Score: {score:.4f})")
                print(f"   ID: {vector_id}")
                
                if metadata:
                    question = metadata.get('question', 'N/A')
                    answer = metadata.get('answer', 'N/A')
                    
                    print(f"   Question: {question[:100]}...")
                    print(f"   Answer: {answer[:200]}...")
                else:
                    print("   ⚠️ No metadata available")
                    
    except Exception as e:
        print(f"❌ Error: {str(e)}")

# Check specific vector IDs
print("\n" + "=" * 80)
print("CHECKING SPECIFIC CORRECTED VECTOR IDs")
print("=" * 80)

correction_ids = [
    "techfusion_role_corrected",
    "techfusion_leadership_corrected",
    "year_level_expanded",
    "capstone_overview_detailed"
]

for vector_id in correction_ids:
    print(f"\n🔍 Checking vector ID: {vector_id}")
    try:
        # Try to fetch by querying with the ID
        result = index.query(
            data=vector_id,
            top_k=1,
            include_metadata=True,
            filter=f"id = '{vector_id}'"
        )
        
        if result:
            print(f"   ✅ Found!")
            if hasattr(result[0], 'metadata') and result[0].metadata:
                print(f"   Question: {result[0].metadata.get('question', 'N/A')[:100]}")
        else:
            print(f"   ❌ Not found")
            
    except Exception as e:
        print(f"   ⚠️ Error: {str(e)}")

# Get index statistics
print("\n" + "=" * 80)
print("DATABASE STATISTICS")
print("=" * 80)
try:
    info = index.info()
    print(f"Total vectors: {info.vector_count}")
    print(f"Dimension: {info.dimension}")
    print(f"Similarity function: {info.similarity_function if hasattr(info, 'similarity_function') else 'N/A'}")
except Exception as e:
    print(f"Error getting info: {str(e)}")
