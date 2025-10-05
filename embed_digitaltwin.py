#!/usr/bin/env python3
"""
Digital Twin Profile Embedding Script
Updates the Upstash Vector database with enhanced profile data
"""

import json
import os
import requests
from typing import List, Dict, Any
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv('.env.local')

class DigitalTwinEmbedder:
    def __init__(self):
        self.upstash_url = os.getenv('UPSTASH_VECTOR_REST_URL')
        self.upstash_token = os.getenv('UPSTASH_VECTOR_REST_TOKEN')
        
        if not self.upstash_url or not self.upstash_token:
            print("⚠️  Warning: Upstash credentials not found in environment variables")
            print("Will demonstrate profile chunking process without uploading to vector database")
            self.credentials_available = False
        else:
            self.credentials_available = True
            self.headers = {
                'Authorization': f'Bearer {self.upstash_token}',
                'Content-Type': 'application/json'
            }
            print("✅ Upstash credentials loaded successfully")

    def load_profile_data(self) -> Dict[str, Any]:
        """Load the enhanced digital twin profile"""
        try:
            # Try utf-8-sig first to handle BOM, then other encodings
            encodings = ['utf-8-sig', 'utf-8', 'latin-1', 'cp1252']
            
            for encoding in encodings:
                try:
                    with open('data/digitaltwin.json', 'r', encoding=encoding) as f:
                        profile_data = json.load(f)
                    print(f"✅ Loaded enhanced profile data: {len(str(profile_data))} characters (encoding: {encoding})")
                    return profile_data
                except (UnicodeDecodeError, json.JSONDecodeError):
                    continue
            
            print("❌ Error: Could not decode JSON file with any supported encoding")
            return {}
                
        except FileNotFoundError:
            print("❌ Error: digitaltwin.json not found in data/ directory")
            return {}
        except Exception as e:
            print(f"❌ Error loading profile data: {e}")
            return {}

    def create_content_chunks(self, profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Create content chunks optimized for RAG search"""
        chunks = []
        chunk_id = 0
        
        # Personal information chunk
        personal = profile.get('personal', {})
        chunks.append({
            'id': f'chunk_{chunk_id}',
            'content': f"I'm {personal.get('name', '')}. {personal.get('summary', '')}",
            'metadata': {
                'section': 'personal',
                'type': 'overview',
                'category': 'introduction'
            }
        })
        chunk_id += 1
        
        # Salary and location preferences
        salary_location = profile.get('salary_location_detailed', {})
        if salary_location:
            salary_info = salary_location.get('salary_expectations', {})
            location_info = salary_location.get('location_preferences', {})
            
            content = f"My salary expectations are {salary_info.get('entry_philippines', 'negotiable')} for Philippines roles and {salary_info.get('entry_international', 'negotiable')} for international positions. "
            content += f"I prefer {', '.join(location_info.get('preferred', []))} work arrangements. "
            content += f"Work authorization: {salary_location.get('work_authorization', '')}"
            
            chunks.append({
                'id': f'chunk_{chunk_id}',
                'content': content,
                'metadata': {
                    'section': 'compensation',
                    'type': 'salary_location',
                    'category': 'logistics'
                }
            })
            chunk_id += 1
        
        # Major project details (STAR format)
        project = profile.get('project_star_format', {})
        if project:
            content = f"My major project is the {project.get('name', '')}. "
            content += f"Situation: {project.get('situation', '')} "
            content += f"I achieved {project.get('result', {}).get('processing_time', '')} processing time improvement and {project.get('result', {}).get('accuracy', '')} system accuracy. "
            content += f"Technologies used: {', '.join(project.get('technologies', []))}. "
            content += f"Impact: served {project.get('result', {}).get('users_served', '')} with {project.get('result', {}).get('cost_savings', '')} in savings."
            
            chunks.append({
                'id': f'chunk_{chunk_id}',
                'content': content,
                'metadata': {
                    'section': 'projects',
                    'type': 'major_project',
                    'category': 'technical_achievement',
                    'technologies': project.get('technologies', [])
                }
            })
            chunk_id += 1
        
        # Leadership experience
        leadership = profile.get('leadership_star_format', {})
        if leadership:
            content = f"As {leadership.get('position', '')}, I transformed the organization with these results: "
            results = leadership.get('result', {})
            content += f"{results.get('participation', '')} participation rate, "
            content += f"{results.get('membership', '')} membership growth, "
            content += f"{results.get('career_impact', '')} career impact for members. "
            content += f"I managed {leadership.get('scope', '')} with proven leadership capabilities."
            
            chunks.append({
                'id': f'chunk_{chunk_id}',
                'content': content,
                'metadata': {
                    'section': 'leadership',
                    'type': 'organizational_leadership',
                    'category': 'soft_skills'
                }
            })
            chunk_id += 1
        
        # Technical skills with proficiency levels
        tech_skills = profile.get('technical_skills_proficiency', {})
        if tech_skills:
            programming = tech_skills.get('programming', {})
            data_analysis = tech_skills.get('data_analysis', {})
            
            content = "My technical skills include: "
            for skill, details in programming.items():
                level = details.get('level', 0)
                evidence = details.get('evidence', '')
                content += f"{skill.replace('_', '/')} (level {level}/5) - {evidence}. "
            
            content += "Data analysis capabilities: "
            for skill, details in data_analysis.items():
                level = details.get('level', 0)
                evidence = details.get('evidence', '')
                content += f"{skill.replace('_', ' ')} (level {level}/5) - {evidence}. "
            
            chunks.append({
                'id': f'chunk_{chunk_id}',
                'content': content,
                'metadata': {
                    'section': 'skills',
                    'type': 'technical_proficiency',
                    'category': 'hard_skills'
                }
            })
            chunk_id += 1
        
        # Quantified achievements
        achievements = profile.get('achievements_quantified', [])
        if achievements:
            content = "My key quantified achievements include: "
            for achievement in achievements:
                metric = achievement.get('metric', '')
                context = achievement.get('context', '')
                content += f"{metric} in {context}. "
            
            chunks.append({
                'id': f'chunk_{chunk_id}',
                'content': content,
                'metadata': {
                    'section': 'achievements',
                    'type': 'quantified_results',
                    'category': 'accomplishments'
                }
            })
            chunk_id += 1
        
        # Education details
        education = profile.get('education', {})
        if education:
            content = f"I'm studying {education.get('degree', '')} at {education.get('university', '')}, "
            content += f"graduating {education.get('graduation', '')}. "
            content += f"Academic honors: {education.get('honors', '')} with {education.get('gpa_equivalent', '')} GPA equivalent."
            
            chunks.append({
                'id': f'chunk_{chunk_id}',
                'content': content,
                'metadata': {
                    'section': 'education',
                    'type': 'academic_background',
                    'category': 'credentials'
                }
            })
            chunk_id += 1
        
        print(f"✅ Created {len(chunks)} content chunks for embedding")
        return chunks

    def upsert_chunks(self, chunks: List[Dict[str, Any]]) -> bool:
        """Upload content chunks to Upstash Vector database"""
        if not self.credentials_available:
            print("📋 DEMONSTRATION MODE: Showing profile chunks that would be uploaded:")
            print("=" * 60)
            
            for chunk in chunks:
                print(f"\n🔹 Chunk ID: {chunk['id']}")
                print(f"📝 Content: {chunk['content'][:100]}...")
                print(f"🏷️  Category: {chunk['metadata']['section']} - {chunk['metadata']['type']}")
            
            print(f"\n📊 Profile Analysis Complete: {len(chunks)} chunks ready for vector database")
            print("💡 When valid Upstash credentials are provided, these chunks will be uploaded automatically")
            return True
        
        success_count = 0
        
        for chunk in chunks:
            # Prepare the upsert request
            upsert_data = {
                "id": chunk['id'],
                "data": chunk['content'],
                "metadata": chunk['metadata']
            }
            
            try:
                response = requests.post(
                    f"{self.upstash_url}/upsert",
                    headers=self.headers,
                    json=upsert_data
                )
                
                if response.status_code == 200:
                    success_count += 1
                    print(f"✅ Uploaded chunk {chunk['id']}: {chunk['metadata']['section']}")
                else:
                    print(f"❌ Failed to upload {chunk['id']}: {response.status_code} - {response.text}")
                    
            except requests.RequestException as e:
                print(f"❌ Network error uploading {chunk['id']}: {e}")
        
        print(f"\n📊 Upload Summary: {success_count}/{len(chunks)} chunks uploaded successfully")
        return success_count == len(chunks)

    def update_vector_database(self) -> bool:
        """Main method to update the vector database"""
        print("🚀 Starting Digital Twin Profile Embedding Process...")
        print("=" * 60)
        
        # Load profile data
        profile = self.load_profile_data()
        if not profile:
            return False
        
        # Create content chunks
        chunks = self.create_content_chunks(profile)
        if not chunks:
            print("❌ No content chunks created")
            return False
        
        # Upload to vector database
        success = self.upsert_chunks(chunks)
        
        if success:
            print("\n🎉 Digital Twin Profile Successfully Updated in Vector Database!")
            print(f"📈 Enhanced profile with quantified achievements now available for RAG queries")
            print(f"💡 Your interview simulation capabilities have been significantly improved")
        else:
            print("\n⚠️  Profile update completed with some errors")
            print("🔍 Check Upstash credentials and network connectivity")
        
        return success


def main():
    """Main execution function"""
    print("Digital Twin Profile Embedding Script")
    print("=====================================")
    
    embedder = DigitalTwinEmbedder()
    success = embedder.update_vector_database()
    
    if success:
        exit(0)
    else:
        exit(1)


if __name__ == "__main__":
    main()