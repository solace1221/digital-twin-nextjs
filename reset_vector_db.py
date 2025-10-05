#!/usr/bin/env python3
"""
Reset Upstash Vector Database
Clears all vectors to allow fresh upload
"""

import os
from dotenv import load_dotenv
from upstash_vector import Index

# Load environment variables
load_dotenv('.env.local')

def reset_database():
    """Reset the vector database"""
    try:
        # Initialize index
        index = Index(
            url=os.getenv('UPSTASH_VECTOR_REST_URL'),
            token=os.getenv('UPSTASH_VECTOR_REST_TOKEN')
        )
        
        print("🔄 Resetting Upstash Vector database...")
        
        # Get current count
        info = index.info()
        current_count = info.total_vector_count if hasattr(info, 'total_vector_count') else 0
        print(f"📊 Current vectors: {current_count}")
        
        # Reset database
        index.reset()
        print("✅ Database reset successfully!")
        
        # Verify
        info = index.info()
        new_count = info.total_vector_count if hasattr(info, 'total_vector_count') else 0
        print(f"📊 Vectors after reset: {new_count}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error resetting database: {str(e)}")
        return False

if __name__ == "__main__":
    print("⚠️  WARNING: This will delete all vectors from your Upstash database!")
    response = input("Are you sure you want to continue? (yes/no): ")
    
    if response.lower() == 'yes':
        reset_database()
    else:
        print("❌ Reset cancelled")
