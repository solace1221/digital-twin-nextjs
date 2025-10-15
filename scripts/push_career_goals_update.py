"""
Push updated career goals to Upstash Vector Database
Updates all career-related Q&A pairs to reflect AI Data Analyst focus
"""

import os
import json
from dotenv import load_dotenv
from upstash_vector import Index

# Load environment variables
load_dotenv('.env.local')

def get_upstash_index():
    """Initialize Upstash Vector index"""
    url = os.getenv('UPSTASH_VECTOR_REST_URL')
    token = os.getenv('UPSTASH_VECTOR_REST_TOKEN')
    
    if not url or not token:
        raise ValueError("Missing Upstash credentials")
    
    return Index(url=url, token=token)

def push_career_goals_updates():
    """Push updated career goals Q&A to Upstash"""
    print("Starting upload of AI Data Analyst career goals updates...")
    print("=" * 80)
    
    index = get_upstash_index()
    
    # Career goals Q&A updates
    career_updates = [
        {
            "id": "career_goals_general",
            "question": "What are your career goals?",
            "answer": "My primary career goal is to become an AI Data Analyst, where I can leverage artificial intelligence and machine learning to transform raw data into actionable insights. I recently completed an AI Data Analyst workshop which gave me hands-on experience with AI-powered analytics tools, machine learning workflows, and intelligent automation for data processing. Short-term, I want to secure an internship or entry-level position in AI-driven data analytics where I can apply my technical skills to real-world business challenges. Long-term, I aspire to become a senior AI data analyst or AI/ML specialist, leading projects that use predictive modeling, advanced analytics, and AI technologies to drive strategic decision-making. I'm passionate about the intersection of data science and artificial intelligence, and I'm committed to continuous learning in this rapidly evolving field.",
            "category": "career_goals",
            "tags": ["ai_data_analyst", "career", "ai_workshop", "machine_learning", "goals"]
        },
        {
            "id": "career_goals_5year_english",
            "question": "What are your career goals for the next 5 years?",
            "answer": "In the next 5 years, I aim to establish myself as a skilled AI Data Analyst who can leverage artificial intelligence and machine learning to extract meaningful insights from data. Short-term, I want to graduate with honors in June 2026 and land my first professional role where I can apply my AI-driven data analysis skills. I recently completed an AI Data Analyst workshop which gave me hands-on experience with AI-powered data tools, machine learning workflows, and intelligent automation - this reinforced my passion for combining AI with analytics. In years 2-3, I want to deepen my expertise in AI/ML for data analytics, master tools like Python for data science and machine learning, SQL for complex queries, cloud-based AI platforms (Azure ML, AWS SageMaker), and advanced data visualization tools like Power BI and Tableau. I also want to earn relevant certifications in AI/ML, data science, and cloud technologies. By year 4-5, I hope to be leading AI-powered data analysis projects, building predictive models, and mentoring junior analysts. Ultimately, I want to become a go-to expert in AI-driven analytics and intelligent decision-making systems while continuing to grow technically and stay current with emerging AI technologies!",
            "category": "career_goals_5year",
            "language": "English",
            "tags": ["ai_data_analyst", "career", "5_year_plan", "machine_learning", "professional_development"]
        },
        {
            "id": "career_goals_5year_tagalog",
            "question": "Ano ang career goals mo for the next 5 years?",
            "answer": "In the next 5 years, gusto kong maging skilled AI Data Analyst na makakapag-leverage ng artificial intelligence at machine learning para makakuha ng meaningful insights from data. Short-term, gusto kong mag-graduate with honors sa June 2026 at makakuha ng first professional role kung saan pwede kong i-apply ang AI-driven data analysis skills ko. Recently, nag-complete ako ng AI Data Analyst workshop na nag-bigay sa akin ng hands-on experience with AI-powered data tools, machine learning workflows, at intelligent automation - nag-reinforce ito ng passion ko for combining AI with analytics. Sa years 2-3, gusto kong palalimin ang expertise ko sa AI/ML for data analytics, master ang tools like Python for data science and machine learning, SQL for complex queries, cloud-based AI platforms (Azure ML, AWS SageMaker), at advanced data visualization tools like Power BI at Tableau. Gusto ko rin mag-earn ng relevant certifications sa AI/ML, data science, at cloud technologies. By year 4-5, sana nag-lead na ako ng AI-powered data analysis projects, building predictive models, at nag-mentor ng junior analysts. Ultimately, gusto kong maging go-to expert sa AI-driven analytics at intelligent decision-making systems habang patuloy na lumalaki technically at updated sa emerging AI technologies!",
            "category": "career_goals_5year",
            "language": "Tagalog",
            "tags": ["ai_data_analyst", "career", "5_year_plan", "tagalog", "machine_learning"]
        },
        {
            "id": "why_data_analyst",
            "question": "Why do you want to be a data analyst?",
            "answer": "I want to become an AI Data Analyst because I'm fascinated by the power of combining data with artificial intelligence to solve complex problems and drive decision-making. During my AI Data Analyst workshop, I got hands-on experience with AI-powered analytics tools and saw firsthand how machine learning can uncover patterns and insights that traditional analysis might miss. I love the analytical thinking required - breaking down complex datasets, identifying trends, and translating findings into actionable recommendations. My background in database management and programming gives me a strong technical foundation, while my leadership experience has taught me how to communicate insights effectively to different stakeholders. What excites me most is the intersection of AI and data analytics - using predictive modeling, intelligent automation, and advanced machine learning algorithms to not just understand what happened in the past, but to predict and shape the future. I believe AI-driven data analysis will be crucial for organizations in every industry, and I want to be at the forefront of this transformation, continuously learning emerging AI technologies and applying them to create real business value.",
            "category": "career_goals",
            "tags": ["ai_data_analyst", "motivation", "ai_workshop", "machine_learning", "passion"]
        },
        {
            "id": "career_path_ai_analyst",
            "question": "What's your ideal career path?",
            "answer": "My ideal career path is to grow from an entry-level AI Data Analyst into a senior AI/ML analytics specialist. I want to start by securing an internship or junior position where I can work with real-world datasets, learn industry best practices, and get mentored by experienced data professionals. In this initial phase, I'll focus on mastering Python for data science and machine learning, SQL for complex data queries, AI-powered business intelligence tools like Power BI and Tableau, and cloud-based AI platforms such as Azure ML and AWS SageMaker. As I gain 2-3 years of experience, I want to take on more complex projects involving predictive modeling, natural language processing, computer vision for data, and building intelligent recommendation systems. I'd also pursue certifications in AI/ML, data science, and cloud technologies to formalize my expertise. By years 4-5, I envision leading AI-powered analytics projects, architecting data pipelines with ML integration, mentoring junior analysts, and contributing to strategic decision-making. Long-term, I could see myself becoming a Chief Data Officer, AI Strategy Lead, or starting my own AI analytics consulting firm. Throughout this journey, continuous learning is key - I'll stay updated on emerging AI technologies, attend conferences, contribute to open-source AI projects, and possibly pursue a master's degree in Data Science or AI.",
            "category": "career_goals",
            "tags": ["ai_data_analyst", "career_path", "professional_development", "machine_learning", "leadership"]
        }
    ]
    
    success_count = 0
    error_count = 0
    
    for item in career_updates:
        try:
            # Upsert to Upstash with metadata
            index.upsert(
                vectors=[{
                    "id": item["id"],
                    "data": f"Q: {item['question']}\nA: {item['answer']}",
                    "metadata": {
                        "type": "qa",
                        "question": item["question"],
                        "answer": item["answer"],
                        "category": item["category"],
                        "tags": ",".join(item.get("tags", [])),
                        "language": item.get("language", "English")
                    }
                }]
            )
            print(f"✅ Updated: {item['id']}")
            success_count += 1
        except Exception as e:
            print(f"❌ Error updating {item['id']}: {str(e)}")
            error_count += 1
    
    print("=" * 80)
    print(f"\n📊 Upload Summary:")
    print(f"✅ Successfully upserted: {success_count} vectors")
    print(f"❌ Errors encountered: {error_count}")
    print(f"\n🎯 Total career goals vectors updated: {success_count}")
    
    # Get stats
    try:
        info = index.info()
        print(f"\n📈 Current Upstash Vector Database Stats:")
        print(f"   Total vectors: {info.total_vector_count}")
        print(f"   Dimension: {info.dimension}")
    except Exception as e:
        print(f"\n⚠️  Could not fetch database stats: {str(e)}")
    
    print("\n✨ AI Data Analyst career goals update complete!")
    print("\n📝 Key Updates:")
    print("   - Career goal: AI Data Analyst (not just Data Analyst)")
    print("   - Emphasis on AI/ML technologies and tools")
    print("   - AI Data Analyst workshop experience highlighted")
    print("   - Focus on predictive modeling and intelligent automation")
    print("   - Cloud-based AI platforms (Azure ML, AWS SageMaker)")
    print("\n🚀 Your PearlAI digital twin now reflects AI Data Analyst career aspirations!")

if __name__ == "__main__":
    push_career_goals_updates()
