"""
Update career goals to focus on AI Data Analyst
Add emphasis on AI and machine learning in data analysis
Remove Software Engineer as alternative career path
"""

import json
from datetime import datetime

def load_digital_twin_data():
    """Load existing digital twin data"""
    with open('data/digitaltwin.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def save_digital_twin_data(data):
    """Save updated digital twin data"""
    with open('data/digitaltwin.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def update_career_goals():
    """Update career goals to AI Data Analyst with emphasis on AI/ML capabilities"""
    print("Loading digital twin data...")
    data = load_digital_twin_data()
    
    updates_made = 0
    
    # Update Career Goals content chunk (check both locations)
    content_chunks = data.get('knowledge_base', {}).get('content_chunks', [])
    if not content_chunks:
        content_chunks = data.get('content_chunks', [])
    
    for chunk in content_chunks:
        if chunk.get('id') == 'career_goals':
            old_content = chunk['content']
            chunk['content'] = "My primary career goal is to become an AI Data Analyst, where I can apply my technical skills and analytical mindset to solve complex problems through data-driven insights powered by artificial intelligence. I recently completed an AI Data Analyst workshop which reinforced my passion for this career path and gave me hands-on experience with AI-powered data analysis tools, machine learning workflows, and intelligent automation for data processing. Short-term, I want to secure an internship or entry-level position in AI-driven data analytics where I can gain practical experience working with real-world datasets, AI models, and business intelligence tools. I'm eager to learn from experienced data professionals and apply my technical foundation to meaningful projects. Long-term, I aspire to grow into a senior AI data analyst or AI/ML specialist role, leveraging advanced analytics, predictive modeling, and AI technologies to drive strategic decision-making in organizations. I'm passionate about the intersection of data science and artificial intelligence, and I believe my strong academic foundation combined with practical AI workshop experience will help me make valuable contributions to data-driven teams."
            print(f"✓ Updated Career Goals content chunk")
            print(f"  Old: {old_content[:100]}...")
            print(f"  New: {chunk['content'][:100]}...")
            updates_made += 1
    
    # Update elevator pitch
    if 'personal' in data:
        old_pitch = data['personal']['elevator_pitch']
        data['personal']['elevator_pitch'] = "I am Lovely Alan, a BSIT student specializing in Web and App Development, with experience in programming, database management, and leadership. As a President's Lister and student leader, I combine technical expertise with organizational skills to contribute meaningfully in both academic and professional settings. I recently completed an AI Data Analyst workshop and aim to become an AI Data Analyst where I can leverage artificial intelligence and advanced analytics to drive data-driven decision-making and create intelligent solutions for real-world business challenges."
        print(f"\n✓ Updated elevator pitch")
        updates_made += 1
    
    # Update interview Q&A
    if 'interview_qa' in data and 'categories' in data['interview_qa']:
        for category_name, questions in data['interview_qa']['categories'].items():
            for qa in questions:
                question_lower = qa.get('question', '').lower()
                
                # Update 5-year career goals
                if 'career goals' in question_lower and 'next 5 years' in question_lower:
                    if 'Data Analyst or Software Engineer' in qa.get('answer', ''):
                        old_answer = qa['answer']
                        
                        # English version
                        if qa.get('language') == 'English' or 'language' not in qa:
                            qa['answer'] = "In the next 5 years, I aim to establish myself as a skilled AI Data Analyst who can leverage artificial intelligence and machine learning to extract meaningful insights from data. Short-term, I want to graduate with honors in June 2026 and land my first professional role where I can apply my AI-driven data analysis skills. I recently completed an AI Data Analyst workshop which gave me hands-on experience with AI-powered data tools, machine learning workflows, and intelligent automation - this reinforced my passion for combining AI with analytics. In years 2-3, I want to deepen my expertise in AI/ML for data analytics, master tools like Python for data science and machine learning, SQL for complex queries, cloud-based AI platforms (Azure ML, AWS SageMaker), and advanced data visualization tools like Power BI and Tableau. I also want to earn relevant certifications in AI/ML, data science, and cloud technologies. By year 4-5, I hope to be leading AI-powered data analysis projects, building predictive models, and mentoring junior analysts. Ultimately, I want to become a go-to expert in AI-driven analytics and intelligent decision-making systems while continuing to grow technically and stay current with emerging AI technologies!"
                            print(f"\n✓ Updated career goals Q&A (English): {qa['question'][:50]}...")
                            updates_made += 1
                        
                        # Tagalog version
                        elif qa.get('language') == 'Tagalog':
                            qa['answer'] = "In the next 5 years, gusto kong maging skilled AI Data Analyst na makakapag-leverage ng artificial intelligence at machine learning para makakuha ng meaningful insights from data. Short-term, gusto kong mag-graduate with honors sa June 2026 at makakuha ng first professional role kung saan pwede kong i-apply ang AI-driven data analysis skills ko. Recently, nag-complete ako ng AI Data Analyst workshop na nag-bigay sa akin ng hands-on experience with AI-powered data tools, machine learning workflows, at intelligent automation - nag-reinforce ito ng passion ko for combining AI with analytics. Sa years 2-3, gusto kong palalimin ang expertise ko sa AI/ML for data analytics, master ang tools like Python for data science and machine learning, SQL for complex queries, cloud-based AI platforms (Azure ML, AWS SageMaker), at advanced data visualization tools like Power BI at Tableau. Gusto ko rin mag-earn ng relevant certifications sa AI/ML, data science, at cloud technologies. By year 4-5, sana nag-lead na ako ng AI-powered data analysis projects, building predictive models, at nag-mentor ng junior analysts. Ultimately, gusto kong maging go-to expert sa AI-driven analytics at intelligent decision-making systems habang patuloy na lumalaki technically at updated sa emerging AI technologies!"
                            print(f"✓ Updated career goals Q&A (Tagalog): {qa['question'][:50]}...")
                            updates_made += 1
                
                # Update general career goals mentions
                if 'what are your career goals' in question_lower or 'ano ang career goals' in question_lower:
                    if 'Software Engineer' in qa.get('answer', '') and category_name != 'career_goals_5year':
                        old_answer = qa['answer']
                        # Replace Software Engineer mentions with AI Data Analyst focus
                        qa['answer'] = qa['answer'].replace('Data Analyst or Software Engineer', 'AI Data Analyst')
                        qa['answer'] = qa['answer'].replace('Software Engineer or Data Analyst', 'AI Data Analyst')
                        qa['answer'] = qa['answer'].replace('Data Analyst', 'AI Data Analyst')
                        if old_answer != qa['answer']:
                            print(f"\n✓ Updated general career goal: {qa['question'][:50]}...")
                            updates_made += 1
    
    # Save updated data
    print(f"\n{'='*60}")
    print(f"Total updates made: {updates_made}")
    print("Saving updated data...")
    save_digital_twin_data(data)
    print("✅ Successfully updated career goals to focus on AI Data Analyst with AI/ML emphasis!")

if __name__ == "__main__":
    update_career_goals()
