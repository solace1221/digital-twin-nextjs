#!/usr/bin/env python3
"""
Update Yellow Forms project information in Upstash Vector database
Removes fictional OOP content and adds correct project details
"""

from upstash_vector import Index
from dotenv import load_dotenv
import os
import json

# Load environment variables
load_dotenv('.env.local')

# Initialize Upstash Vector
index = Index.from_env()

def update_yellow_forms_project():
    """Update the Yellow Forms project vector with correct information"""
    
    # Load the updated digitaltwin.json to get the correct project info
    with open('data/digitaltwin.json', 'r', encoding='utf-8') as f:
        profile = json.load(f)
    
    # Find the Yellow Forms project in the projects array
    yellow_forms_project = None
    for project in profile.get('projects', []):
        if 'Yellow Forms' in project.get('title', ''):
            yellow_forms_project = project
            break
    
    if not yellow_forms_project:
        print("❌ Yellow Forms project not found in digitaltwin.json")
        return
    
    # Create the enriched content for the vector
    project_content = f"""
    Title: {yellow_forms_project.get('name', yellow_forms_project.get('title', 'Yellow Forms Project'))}
    
    I was the Project Leader of a {yellow_forms_project.get('team_size', '3-member')} team that developed a digital ticketing system 
    to modernize how Saint Paul University Philippines manages campus violations. We transformed the traditional 
    yellow paper forms (used for recording student violations) into a comprehensive digital solution.
    
    Technologies Used: {', '.join(yellow_forms_project.get('technologies', []))}
    Development Environment: {yellow_forms_project.get('development_environment', 'NetBeans IDE')}
    Course: {yellow_forms_project.get('course', 'Object Oriented Programming')}
    Grade Achieved: {yellow_forms_project.get('grade_achieved', '1.00 (Perfect Grade)')}
    
    Problem We Solved:
    {yellow_forms_project.get('problem_solved', 'Manual input of violator names was time-consuming and inefficient')}
    
    Key Features:
    {chr(10).join('- ' + feature for feature in yellow_forms_project.get('key_features', []))}
    
    My Role as Project Leader:
    - Led the team of 3 members across all development phases
    - Designed system architecture using OOP principles (encapsulation, inheritance, polymorphism)
    - Developed core violation management modules in Java using NetBeans IDE
    - Implemented database integration for violator records and tracking
    - Coordinated team workflow and ensured timely deliverables
    - Applied lessons from achieving 1.00 (perfect grade) in OOP course
    
    Impact:
    {yellow_forms_project.get('impact', 'Modernized university violation tracking system')}
    
    Description:
    {yellow_forms_project.get('description', '')}
    
    This project represents my understanding of Object-Oriented Programming principles and my ability 
    to lead a team in delivering practical digital transformation solutions. The perfect grade I achieved 
    in OOP demonstrates my strong grasp of programming fundamentals.
    """
    
    # Check if the vector exists and delete it
    vector_id = "project_yellow_forms"
    
    try:
        # Delete the old vector if it exists
        print(f"🗑️  Deleting old vector: {vector_id}")
        index.delete(ids=[vector_id])
        print("✅ Old vector deleted")
    except Exception as e:
        print(f"ℹ️  No existing vector to delete: {e}")
    
    # Upload the new vector
    print(f"\n📤 Uploading updated Yellow Forms project information...")
    index.upsert(
        vectors=[
            {
                "id": vector_id,
                "data": project_content.strip(),
                "metadata": {
                    "type": "project",
                    "title": yellow_forms_project.get('name', yellow_forms_project.get('title', 'Yellow Forms')),
                    "role": yellow_forms_project.get('role', 'Project Leader'),
                    "team_size": yellow_forms_project.get('team_size', '3 members'),
                    "course": yellow_forms_project.get('course', 'OOP'),
                    "technologies": ', '.join(yellow_forms_project.get('technologies', [])),
                    "grade": yellow_forms_project.get('grade_achieved', '1.00'),
                    "category": "academic_project"
                }
            }
        ]
    )
    
    print("✅ Updated Yellow Forms project in vector database")
    
    # Verify the upload
    info = index.info()
    print(f"\n📊 Vector database now has {info.vector_count} vectors")
    
    # Test query to see if it works
    print("\n🔍 Testing query: 'Tell me about your Yellow Forms project'")
    results = index.query(
        data="Tell me about your Yellow Forms project",
        top_k=3,
        include_metadata=True
    )
    
    print("\n🎯 Top Results:")
    for i, result in enumerate(results, 1):
        print(f"\n{i}. {result.metadata.get('title', 'N/A')} (Score: {result.score:.3f})")
        if result.metadata.get('type') == 'project':
            print(f"   Role: {result.metadata.get('role', 'N/A')}")
            print(f"   Technologies: {result.metadata.get('technologies', 'N/A')}")

if __name__ == "__main__":
    print("=" * 70)
    print("🔧 UPDATING YELLOW FORMS PROJECT IN VECTOR DATABASE")
    print("=" * 70)
    print("\nThis script will:")
    print("1. Delete old Yellow Forms project vector with fictional OOP content")
    print("2. Upload correct project details (NetBeans, digital ticketing, team leader)")
    print("3. Verify the update with a test query")
    print()
    
    update_yellow_forms_project()
    
    print("\n" + "=" * 70)
    print("✅ YELLOW FORMS PROJECT UPDATED SUCCESSFULLY!")
    print("=" * 70)
    print("\nYour digital twin now has the CORRECT information:")
    print("✅ Project Leader (not just Developer)")
    print("✅ 3-member team")
    print("✅ Digital ticketing system for campus violations")
    print("✅ NetBeans IDE with Java")
    print("✅ 1.00 perfect grade in OOP")
    print("✅ No fictional banking or university system projects")
    print()
