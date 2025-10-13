"""
Update career goals to focus on Data Analyst only
Add AI Data Analyst workshop information
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
    """Update career goals to Data Analyst only with AI workshop mention"""
    print("Loading digital twin data...")
    data = load_digital_twin_data()
    
    updates_made = 0
    
    # Update Career Goals content chunk
    for chunk in data.get('knowledge_base', {}).get('content_chunks', []):
        if chunk.get('id') == 'career_goals':
            old_content = chunk['content']
            chunk['content'] = "My primary career goal is to become a Data Analyst, where I can apply my technical skills and analytical mindset to solve complex problems through data. I recently completed an AI Data Analyst workshop which reinforced my passion for this career path and gave me hands-on experience with AI-powered data analysis tools. I want to work on projects that have real-world impact, continue learning cutting-edge data technologies, and eventually grow into a senior data analyst or data science role. I'm passionate about leveraging data and AI to drive informed decision-making in organizations."
            print(f"✓ Updated Career Goals content chunk")
            print(f"  Old: {old_content[:100]}...")
            print(f"  New: {chunk['content'][:100]}...")
            updates_made += 1
    
    # Update elevator pitch
    if 'personal' in data:
        old_pitch = data['personal']['elevator_pitch']
        data['personal']['elevator_pitch'] = "I am Lovely Alan, a BSIT student specializing in Web and App Development, with experience in programming, database management, and leadership. As a President's Lister and student leader, I combine technical expertise with organizational skills to contribute meaningfully in both academic and professional settings. I recently completed an AI Data Analyst workshop and aim to grow into a Data Analyst role where I can apply my skills in data-driven decision-making using AI-powered tools."
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
                            qa['answer'] = "In the next 5 years, I aim to establish myself as a skilled Data Analyst. Short-term, I want to graduate with honors in June 2026 and land my first professional role where I can apply my data analysis skills. I recently completed an AI Data Analyst workshop which gave me hands-on experience with AI-powered data tools and reinforced my passion for this field. In years 2-3, I want to deepen my expertise in data analytics, master tools like Python for data science, SQL for complex queries, and data visualization platforms like Power BI and Tableau. I also want to earn relevant certifications in data analysis, AI/ML, or cloud technologies. By year 4-5, I hope to be leading data analysis projects or mentoring junior analysts. Ultimately, I want to become a go-to expert in AI-powered data-driven decision making while continuing to grow technically and professionally!"
                            print(f"\n✓ Updated career goals Q&A (English): {qa['question'][:50]}...")
                            updates_made += 1
                        
                        # Tagalog version
                        elif qa.get('language') == 'Tagalog':
                            qa['answer'] = "In the next 5 years, gusto kong maging skilled Data Analyst. Short-term, gusto kong mag-graduate with honors sa June 2026 at makakuha ng first professional role kung saan pwede kong i-apply ang data analysis skills ko. Recently, nag-complete ako ng AI Data Analyst workshop na nag-bigay sa akin ng hands-on experience with AI-powered data tools at nag-reinforce ng passion ko for this field. Sa years 2-3, gusto kong palalimin ang expertise ko sa data analytics, master ang tools like Python for data science, SQL for complex queries, at data visualization platforms like Power BI at Tableau. Gusto ko rin mag-earn ng relevant certifications sa data analysis, AI/ML, o cloud technologies. By year 4-5, sana nag-lead na ako ng data analysis projects o nag-mentor ng junior analysts. Ultimately, gusto kong maging go-to expert sa AI-powered data-driven decision making habang patuloy na lumalaki technically at professionally!"
                            print(f"✓ Updated career goals Q&A (Tagalog): {qa['question'][:50]}...")
                            updates_made += 1
                
                # Update general career goals mentions
                if 'what are your career goals' in question_lower or 'ano ang career goals' in question_lower:
                    if 'Software Engineer' in qa.get('answer', '') and category_name != 'career_goals_5year':
                        old_answer = qa['answer']
                        # Replace Software Engineer mentions with Data Analyst focus
                        qa['answer'] = qa['answer'].replace('Data Analyst or Software Engineer', 'Data Analyst')
                        qa['answer'] = qa['answer'].replace('Software Engineer or Data Analyst', 'Data Analyst')
                        if old_answer != qa['answer']:
                            print(f"\n✓ Updated general career goal: {qa['question'][:50]}...")
                            updates_made += 1
    
    # Save updated data
    print(f"\n{'='*60}")
    print(f"Total updates made: {updates_made}")
    print("Saving updated data...")
    save_digital_twin_data(data)
    print("✅ Successfully updated career goals to focus on Data Analyst with AI workshop!")

if __name__ == "__main__":
    update_career_goals()
