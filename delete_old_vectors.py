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

# OLD vectors to delete (conflicting with corrections)
old_vectors_to_delete = [
    # Old TechFusion vectors with incorrect "Developer" role
    "qa_what_was_your_role_in_the_coil_20251004_202051",
    "qa_tell_me_about_techfusion",
    "qa_coil_techfusion",
    "qa_techfusion_project",
    
    # Old capstone vectors without full title
    "qa_capstone_project",
    "qa_biggest_achievement",
    
    # Old year level vectors (too short)
    "qa_year_level",
    "qa_what_year_are_you",
    
    # Old grades vectors (incomplete)
    "qa_grades",
    "qa_academic_performance",
]

print("=" * 80)
print("DELETING OLD CONFLICTING VECTORS")
print("=" * 80)

deleted_count = 0
not_found_count = 0

for vector_id in old_vectors_to_delete:
    try:
        print(f"\n🗑️  Attempting to delete: {vector_id}")
        index.delete(ids=[vector_id])
        deleted_count += 1
        print(f"   ✅ Deleted successfully")
    except Exception as e:
        not_found_count += 1
        print(f"   ℹ️  Not found or already deleted: {str(e)}")

print("\n" + "=" * 80)
print("DELETION SUMMARY")
print("=" * 80)
print(f"✅ Deleted: {deleted_count}")
print(f"ℹ️  Not found: {not_found_count}")

# Get updated stats
try:
    info = index.info()
    print(f"\n📈 Updated database stats:")
    print(f"   Total vectors: {info.vector_count}")
except Exception as e:
    print(f"\n⚠️ Could not fetch stats: {str(e)}")

print("\n✨ Cleanup complete! Old conflicting vectors removed.")
