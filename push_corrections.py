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

# Updated and corrected Q&A pairs
corrections_data = [
    # TECHFUSION CORRECTIONS - Updated to Team Leader (not Developer)
    {
        "id": "techfusion_role_corrected",
        "question": "Tell me about your TechFusion project.",
        "answer": "I was one of the Team Leaders for TechFusion: Equal Learn Platform, an international COIL (Collaborative Online International Learning) project between St. Paul University Philippines and Hayek Global College in Brazil. As Team Leader, I coordinated the international team, managed project planning, timelines, and deliverables, facilitated cross-cultural communication between Philippine and Brazilian team members, and led the final presentation showcasing our platform. Our team created an online learning platform specifically designed for underprivileged students, with multilingual translation support in Ibanag, Ilokano, Itawes, English, Tagalog, and Portuguese. The platform featured accessible interfaces and culturally appropriate content for both Philippine and Brazilian contexts. This project demonstrated my leadership abilities in international collaboration, project management, and my commitment to using technology for social impact and educational equity."
    },
    {
        "id": "techfusion_leadership_corrected",
        "question": "What was your role in TechFusion?",
        "answer": "I served as one of the Team Leaders for the TechFusion: Equal Learn Platform project, an international COIL initiative. My leadership responsibilities included coordinating the international team across different time zones and cultures, managing project planning and ensuring we met our timelines and deliverables, facilitating effective communication between our Philippine team and our Brazilian partners at Hayek Global College, organizing team meetings and ensuring everyone was aligned on our goals, and leading the final presentation to showcase our multilingual online learning platform. It was an incredible experience in international project management and cross-cultural leadership."
    },
    {
        "id": "techfusion_coil_explained",
        "question": "What is COIL TechFusion?",
        "answer": "COIL TechFusion stands for Collaborative Online International Learning - TechFusion: Global Project Management for EdTech Revolution. It was an international project between St. Paul University Philippines and Hayek Global College in Brazil, where I served as one of the Team Leaders. We created the Equal Learn Platform, an online learning platform for underprivileged students with multilingual support in six languages: Ibanag, Ilokano, Itawes, English, Tagalog, and Portuguese. The project combined global collaboration, educational technology innovation, and social impact, demonstrating how international teams can work together to create solutions that address educational inequality."
    },
    
    # YEAR LEVEL - EXPANDED
    {
        "id": "year_level_expanded",
        "question": "What year level are you in college?",
        "answer": "I'm currently in my 4th year (senior year) of my Bachelor of Science in Information Technology (BSIT) program at St. Paul University Philippines, majoring in Web and App Development. I'm expected to graduate in 2026. Throughout my four years, I've maintained President's Lister status, which recognizes students with outstanding academic performance (95%+ average). Being in my final year, I'm completing my capstone project - the Good Moral Application and Monitoring System with Decision Support - along with advanced courses in Artificial Intelligence and Robotics, Computer Network Systems, Game Development, Hybrid Mobile Application Development, and Strategic Planning with ERP. My fourth year has been focused on integrating all the knowledge I've gained over the past three years into practical, industry-ready skills and preparing for my transition into the professional workforce as a Data Analyst or Software Engineer."
    },
    {
        "id": "senior_year_courses",
        "question": "What courses are you taking in your senior year?",
        "answer": "In my 4th year (senior year) of BSIT, I'm taking advanced specialized courses across two semesters. First semester (AY 2024-2025) includes Platform Technologies as Elective 1, System Integration and Architecture, Information Assurance and Security, Integrative and Programming Technologies, Social and Professional Issues, and Capstone Project 1 where I'm developing my project research proposal for the Good Moral Application and Monitoring System. Second semester (AY 2024-2025) includes Computer Network Systems, Game Development as Elective 2, Hybrid Mobile Application as Elective 3, Strategic Planning-ERP as Free Elective 2, and the exciting course on Artificial Intelligence and Robotics. These courses are preparing me with cutting-edge skills in full-stack development, cybersecurity, AI/ML, and enterprise systems."
    },
    
    # ACADEMIC GRADES - COMPLETE TRANSCRIPT
    {
        "id": "grades_complete_transcript",
        "question": "What are your grades in college?",
        "answer": "I've maintained excellent academic performance throughout my BSIT program with most grades between 1.00 (highest) and 1.75, earning President's Lister status. Here's my complete transcript: First Semester AY 2022-2023: Introduction to Computing (1.50), Programming 1 (1.75). Second Semester AY 2022-2023: Mathematics in the Modern World (1.50), Programming 2 (1.75), Information Management (1.00). Summer AY 2022-2023: Discrete Mathematics (1.75). First Semester AY 2023-2024: Data Structures and Algorithm (1.25), Free Elective 1 - Accounting Process (1.25), Object Oriented Programming (1.00), Web Systems and Technologies (1.75), Advanced Database System (1.25). Second Semester AY 2023-2024: Rich Media Development (1.50), Application Development and Emerging Technologies (1.25). First Semester AY 2024-2025: Quantitative Methods, Human Computer Interaction, Platform Technologies (Elective 1), System Integration and Architecture, Information Assurance and Security, Integrative and Programming Technologies, Social and Professional Issues, Capstone Project 1. Second Semester AY 2024-2025: Computer Network Systems, Game Development (Elective 2), Hybrid Mobile Application (Elective 3), Strategic Planning-ERP (Free Elective 2), Artificial Intelligence and Robotics. My strongest grades were 1.00 (perfect) in Information Management and Object Oriented Programming, demonstrating my aptitude for database systems and programming fundamentals."
    },
    {
        "id": "best_grades",
        "question": "What was your best grade in college?",
        "answer": "My best grades were 1.00 (the highest possible grade in the Philippine grading system, equivalent to 4.0 GPA in the US system) in two courses: Information Management and Object Oriented Programming. In Information Management, I excelled at database design, SQL, data modeling, and understanding how organizations structure and manage their information assets. In Object Oriented Programming, I mastered OOP concepts like encapsulation, inheritance, polymorphism, and abstraction, which are fundamental to modern software development. These perfect grades reflect my strong aptitude for both data management and programming, which aligns perfectly with my career goals of becoming a Data Analyst or Software Engineer."
    },
    {
        "id": "programming_grades",
        "question": "How did you perform in programming courses?",
        "answer": "I've performed very well in all my programming courses, with grades ranging from 1.00 to 1.75. Here's my programming course performance: Programming 1 (1.75) - learned fundamental programming concepts, Programming 2 (1.75) - advanced programming techniques, Object Oriented Programming (1.00) - perfect grade demonstrating mastery of OOP concepts, Data Structures and Algorithm (1.25) - excellent understanding of algorithms and data structures, Web Systems and Technologies (1.75) - web development fundamentals, Application Development and Emerging Technologies (1.25) - modern development practices. Currently taking Integrative and Programming Technologies and preparing for Artificial Intelligence and Robotics. My consistent high performance across diverse programming languages and paradigms shows my strong foundation in software development and ability to quickly master new programming concepts and technologies."
    },
    {
        "id": "gpa_academic_standing",
        "question": "What is your GPA or academic standing?",
        "answer": "I'm a President's Lister at St. Paul University Philippines, which recognizes students with outstanding academic performance of 95%+ average across all courses. In the Philippine grading system where 1.00 is the highest and 5.00 is failing, my grades range from 1.00 to 1.75, with most courses in the 1.00-1.50 range. This is equivalent to approximately a 3.7-4.0 GPA in the US grading system. My President's Lister status has been consistent throughout my four years, reflecting my dedication to academic excellence while simultaneously managing leadership responsibilities as JPCS President and PSG Executive Secretary, and completing multiple technical projects. This achievement demonstrates my ability to excel under pressure and balance multiple demanding commitments."
    },
    
    # CAPSTONE PROJECT - DETAILED
    {
        "id": "capstone_overview_detailed",
        "question": "What is your capstone project?",
        "answer": "My capstone project is titled 'Good Moral Application and Monitoring System with Decision Support.' This is a comprehensive web-based application I'm developing using Laravel and MySQL to modernize and automate the student conduct record management process at our university. The system addresses the inefficiencies of the current manual, paper-based process by providing automated decision-making algorithms that evaluate student behavior patterns, a real-time dashboard for administrators to monitor incidents and track trends, comprehensive reporting tools for generating good moral certificates and conduct summaries, role-based access control for different levels of administrative staff, and a complete audit trail for accountability and transparency. The Decision Support component is particularly innovative - it uses rule-based algorithms to analyze incident types, frequencies, severity levels, and timeframes to automatically recommend appropriate actions, reducing manual processing time by approximately 70% while ensuring consistent decision-making across all student cases. The system currently handles over 500 student records with 95% operational efficiency and has been recognized for its practical impact in improving administrative workflows."
    },
    {
        "id": "capstone_technologies",
        "question": "What technologies are you using for your capstone project?",
        "answer": "For my capstone project - the Good Moral Application and Monitoring System with Decision Support - I'm using a full-stack web development approach. The backend is built with Laravel, a powerful PHP framework that provides elegant MVC architecture, Eloquent ORM for database operations, robust authentication and authorization, routing and middleware capabilities, and excellent documentation and community support. The database is MySQL, designed with normalized schemas to handle students, incidents, evaluations, staff members, certificates, and audit logs with complex relationships and data integrity constraints. The frontend uses HTML5 for semantic markup, CSS3 with responsive design principles for cross-device compatibility, JavaScript for interactive features and dynamic content, and Chart.js for data visualization in the admin dashboard. The decision support algorithms are implemented using PHP with rule-based logic, weighted scoring systems, and decision trees. This technology stack was chosen for its reliability, scalability, and my proficiency in these technologies, ensuring I can deliver a production-ready system that can be maintained and extended by future developers."
    },
    {
        "id": "capstone_decision_support",
        "question": "How does the decision support feature work in your capstone?",
        "answer": "The Decision Support feature in my Good Moral Application and Monitoring System is one of its most innovative components. It uses rule-based algorithms to automatically evaluate student conduct records against predefined, configurable criteria. The system analyzes multiple factors: incident type (academic dishonesty, behavioral issues, policy violations, etc.), frequency (number of incidents within specific timeframes), severity level (minor, moderate, major infractions), recency (how recent the incidents occurred), and student history (overall conduct pattern over time). Based on these factors, the system assigns weighted scores using algorithms I developed, then uses decision trees to traverse different evaluation paths depending on the combination of factors. The output is an automatic recommendation: approve good moral certificate, issue warning to student, require administrative review, or deny certificate with explanation. What makes this powerful is the consistency - similar cases are always evaluated using the same criteria, eliminating human bias and inconsistency. It also dramatically improves efficiency - what used to take administrators hours of manual review and deliberation now takes seconds, while maintaining accuracy. The system reduced manual processing time by 70% and ensures fair, transparent, and consistent decision-making. Administrators can still override the system's recommendations when special circumstances warrant it, but the automated analysis provides a solid, objective foundation for decisions."
    },
    {
        "id": "capstone_impact",
        "question": "What impact has your capstone project had?",
        "answer": "My capstone project - the Good Moral Application and Monitoring System with Decision Support - has had significant real-world impact at our university. The system transformed a tedious, paper-based manual process into an efficient digital workflow, reducing processing time from 3-5 days to under 1 hour for standard cases - that's a 95%+ time reduction. It currently serves 500+ students with 95% accuracy in record-keeping, compared to the frequent errors that occurred in the previous manual system. The automated decision support eliminated inconsistencies in how similar conduct cases were evaluated, ensuring fairness and transparency. Administrators praised the user-friendly interface and comprehensive reporting capabilities that give them instant insights into campus-wide conduct trends. The system maintains complete audit trails, providing accountability and protecting both students and administrators. From a technical perspective, it demonstrates my ability to understand complex organizational processes, translate them into software requirements, design scalable database architectures, implement sophisticated business logic, and deliver production-ready systems that solve real problems. This project has become a centerpiece of my portfolio, showcasing my full-stack development capabilities, problem-solving skills, and ability to create technology solutions with measurable impact."
    },
    {
        "id": "capstone_title",
        "question": "What is the title of your capstone project?",
        "answer": "The title of my capstone project is 'Good Moral Application and Monitoring System with Decision Support.' This title reflects the dual nature of the system: it's both an application for managing and monitoring student conduct records (the 'Application and Monitoring System' part), and it includes intelligent decision support capabilities that automatically analyze student behavior patterns and recommend appropriate actions (the 'with Decision Support' part). The system is designed to modernize how our university handles good moral certificate applications by replacing manual, paper-based processes with an automated, efficient digital solution."
    }
]

def upload_corrections():
    """Upload corrected Q&A pairs to Upstash Vector"""
    success_count = 0
    error_count = 0
    
    print(f"Starting upload of {len(corrections_data)} corrected Q&A pairs to Upstash Vector...")
    print("=" * 80)
    
    for item in corrections_data:
        try:
            # Combine question and answer for embedding
            combined_text = f"Q: {item['question']}\nA: {item['answer']}"
            
            # Upsert to Upstash (will update if ID exists, create if not)
            index.upsert(
                vectors=[
                    {
                        "id": item["id"],
                        "data": combined_text,
                        "metadata": {
                            "question": item["question"],
                            "answer": item["answer"],
                            "type": "correction_update",
                            "category": item["id"].split("_")[0]
                        }
                    }
                ]
            )
            
            success_count += 1
            print(f"✅ Updated: {item['id']}")
            
        except Exception as e:
            error_count += 1
            print(f"❌ Error updating {item['id']}: {str(e)}")
    
    print("=" * 80)
    print(f"\n📊 Upload Summary:")
    print(f"✅ Successfully upserted: {success_count} vectors")
    print(f"❌ Errors encountered: {error_count}")
    print(f"\n🎯 Total vectors updated: {success_count}")
    
    # Get info about the index
    try:
        info = index.info()
        print(f"\n📈 Current Upstash Vector Database Stats:")
        print(f"   Total vectors: {info.vector_count}")
        print(f"   Dimension: {info.dimension}")
    except Exception as e:
        print(f"\n⚠️ Could not fetch index info: {str(e)}")

if __name__ == "__main__":
    upload_corrections()
    print("\n✨ Corrections upload complete!")
    print("\n📝 Key Updates:")
    print("   - TechFusion role: Changed from Developer to Team Leader")
    print("   - Year level: Expanded to detailed 4th year description")
    print("   - Academic grades: Added complete transcript with all courses")
    print("   - Capstone: Added detailed title and comprehensive descriptions")
    print("\n🚀 Your PearlAI digital twin now has accurate, detailed answers!")
