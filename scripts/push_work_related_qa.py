"""
Push 100 Work-Related Q&A to Upstash Vector Database
Focus: Relocation, International Work, Career Preferences, Professional Scenarios
"""

import os
from dotenv import load_dotenv
from upstash_vector import Index

# Load environment variables
load_dotenv('.env.local')

# Initialize Upstash Vector client
index = Index(
    url=os.getenv('UPSTASH_VECTOR_REST_URL'),
    token=os.getenv('UPSTASH_VECTOR_REST_TOKEN')
)

# 100 Work-Related Q&A vectors
work_qa_vectors = [
    {
        "id": "work_relocate_willing",
        "text": "Q: Are you willing to relocate for work?\nA: Yes, I'm definitely willing to relocate for the right opportunity. I can relocate within 30-60 days depending on the location and requirements. For domestic relocation within the Philippines - like Metro Manila, Cebu, or Davao - I'm very open and would just need time to arrange housing and logistics. For international relocation, I would need visa sponsorship and proper work authorization support from the company. I'm flexible about location because I understand that the best learning opportunities and career growth might not be in my current city. My priority is finding a role where I can learn, contribute meaningfully, and build my career - if that means relocating, I'm ready to do it.",
        "metadata": {"category": "work_preferences", "topic": "relocation", "type": "qa"}
    },
    {
        "id": "work_abroad_willing",
        "text": "Q: Would you be willing to work abroad?\nA: Absolutely! I'm very open to working abroad with the right company and proper visa support. I've already demonstrated my ability to collaborate internationally through my COIL project with Brazil, where I worked across different time zones, cultures, and languages. I'm particularly interested in opportunities in countries with strong tech industries like Singapore, the US, Canada, or Europe. Working abroad would give me exposure to different business practices, advanced technologies, and diverse teams - all of which would accelerate my professional growth. The main requirement would be visa sponsorship and work authorization support from the employer.",
        "metadata": {"category": "work_preferences", "topic": "international_work", "type": "qa"}
    },
    {
        "id": "work_arrangement_preference",
        "text": "Q: What's your preferred work arrangement: remote, hybrid, or on-site?\nA: My preference is hybrid or remote work, but I'm flexible based on the company's needs and culture. Remote work would be ideal because I have a proven track record of succeeding in remote environments - I've managed student organizations remotely, completed international collaborative projects with Brazil across time zones, and maintained President's Lister status while juggling multiple responsibilities. I have a dedicated home office setup with reliable 50+ Mbps internet, and I'm proficient with all major remote collaboration tools like Zoom, Microsoft Teams, Slack, GitHub, and Trello.",
        "metadata": {"category": "work_preferences", "topic": "work_arrangement", "type": "qa"}
    },
    {
        "id": "work_business_travel",
        "text": "Q: How do you feel about business travel?\nA: I'm comfortable with business travel and see it as an opportunity for growth and learning. For domestic travel within the Philippines, I can be available up to 25% of the time for training sessions, conferences, client meetings, or team gatherings. For international travel, I'm available and enthusiastic about it, though I would need proper documentation, advance notice for visa applications if required, and clear understanding of the travel's purpose and duration. I view business travel as a valuable part of professional development.",
        "metadata": {"category": "work_preferences", "topic": "travel", "type": "qa"}
    },
    {
        "id": "work_salary_expectations",
        "text": "Q: What are your salary expectations?\nA: For entry-level positions in the Philippines, I'm looking at ₱25,000 to ₱35,000 per month. For internships or part-time roles while I complete my studies, ₱15,000 to ₱20,000 per month would be appropriate. If the opportunity is international, I would expect $45,000 to $55,000 USD annually. However, I'm more focused on the complete package than just the base salary. I highly value learning and growth potential, company culture and team dynamics, opportunities to work on meaningful projects, and clear paths for advancement. I'm early in my career, so investing in the right learning environment is more important than maximizing immediate compensation.",
        "metadata": {"category": "compensation", "topic": "salary", "type": "qa"}
    },
    {
        "id": "work_job_offer_factors",
        "text": "Q: What factors would make you choose one job offer over another?\nA: I would evaluate offers based on learning and growth potential, company culture and team quality, work that has real impact, career trajectory, and practical considerations like compensation, work arrangement flexibility, location and relocation support, and company stability. A higher salary at a company with poor culture would lose to a lower salary at a place where I'd learn rapidly and work with great people. I'm investing in my first professional role, so long-term career building trumps short-term gains.",
        "metadata": {"category": "career_decisions", "topic": "job_selection", "type": "qa"}
    },
    {
        "id": "work_time_zones",
        "text": "Q: How do you handle working across different time zones?\nA: I'm experienced with working across time zones from my COIL project with Brazil. I'm based in the Philippines (UTC+8) and can accommodate 2-3 hours overlap with other major time zones. The key is clear communication and asynchronous work practices. I document everything thoroughly so team members in other zones can catch up, use tools like Slack for async communication, record meetings when possible, and set clear expectations about response times. I'm comfortable working flexibly - if an important meeting is at 8 PM my time, that's fine as long as it's not every day.",
        "metadata": {"category": "work_style", "topic": "time_zones", "type": "qa"}
    },
    {
        "id": "work_company_size",
        "text": "Q: What's your ideal company size to work for?\nA: I'm open to different company sizes because each offers unique advantages. I'm leaning toward mid-size companies (50-500 people) or established startups because they often offer the best combination of learning opportunities, mentorship, and meaningful impact. In startups, I'd get exposure to multiple parts of the business. In mid-size companies, there's usually a good balance of structure and resources. In large corporations, I'd benefit from established training programs and work on large-scale systems. But the team and the work matter more than the company size.",
        "metadata": {"category": "work_preferences", "topic": "company_size", "type": "qa"}
    },
    {
        "id": "work_contract_based",
        "text": "Q: Are you open to contract or project-based work?\nA: I'm open to contract or project-based work, especially while completing my studies or gaining initial experience. Contract work offers focused scope, exposure to different projects and technologies, and flexibility to learn from multiple companies. However, my preference for my first major role after graduation would be a full-time position with a company committed to my long-term development. I want mentorship, career progression, and stability to deepen my expertise. If a contract role offers exceptional learning, I would definitely consider it.",
        "metadata": {"category": "work_preferences", "topic": "employment_type", "type": "qa"}
    },
    {
        "id": "work_company_culture",
        "text": "Q: How important is company culture to you?\nA: Company culture is extremely important - it's often the difference between thriving and surviving in a role. I value collaborative culture over competitive, learning-oriented culture where asking questions is encouraged, open communication where feedback flows both ways, diversity and inclusion, and work-life balance respect. Red flags would be blame culture, lack of recognition for good work, or communication that only flows downward. Culture directly impacts my ability to learn, contribute, and build a sustainable career.",
        "metadata": {"category": "work_preferences", "topic": "culture", "type": "qa"}
    },
    {
        "id": "work_manager_type",
        "text": "Q: What type of manager or supervisor do you work best with?\nA: I work best with managers who provide clear direction but trust me with autonomy. I need someone who can set clear expectations and goals, provide context for why work matters, and give constructive feedback regularly. I value managers invested in my development, who see growing team members as part of their role. I want someone I can learn from and who communicates openly. What doesn't work is micromanagement without context, or being left completely alone without guidance when learning something new.",
        "metadata": {"category": "work_preferences", "topic": "management_style", "type": "qa"}
    },
    {
        "id": "work_learning_approach",
        "text": "Q: How do you approach learning new technologies or skills for work?\nA: I approach learning systematically and practically. First, I understand the 'why' - why this technology exists and what problems it solves. Then I move to hands-on practice quickly - I learn best by building something real. I use multiple resources - official documentation, online courses, YouTube tutorials, and Stack Overflow. I take notes and document what I learn. I set specific goals like 'build X feature by Friday' rather than vague 'learn Laravel.' I'm not afraid to struggle - that's where real learning happens.",
        "metadata": {"category": "professional_development", "topic": "learning", "type": "qa"}
    },
    {
        "id": "work_industry_interests",
        "text": "Q: What industries or sectors are you most interested in working in?\nA: I'm most interested in education technology, financial technology (fintech), and healthcare technology - sectors where technology has clear social impact. Education technology resonates because of my COIL project. Fintech interests me because of the intersection of data, security, and real-world impact, especially in the Philippines where financial inclusion is a challenge. Healthcare technology appeals because of the data challenges and impact on people's lives. What matters most is solving real problems for real users with interesting technical work.",
        "metadata": {"category": "career_preferences", "topic": "industry", "type": "qa"}
    },
    {
        "id": "work_fast_paced_environment",
        "text": "Q: How do you feel about working in a fast-paced, constantly changing environment?\nA: I thrive in fast-paced environments as long as there's clarity on priorities and purpose. My last year demonstrates this - serving as JPCS President, Executive Secretary for Student Government, completing capstone, and maintaining President's Lister status. I'm comfortable with context switching and managing multiple priorities. The ideal environment is fast-paced in delivering value and learning new things, but with enough stability to build expertise and see impact. Constant change without reflection leads to burnout.",
        "metadata": {"category": "work_style", "topic": "pace", "type": "qa"}
    },
    {
        "id": "work_international_teams",
        "text": "Q: What's your experience working with international or multicultural teams?\nA: I have hands-on experience through my COIL project with Brazil, serving as Team Leader coordinating between Philippine and Brazilian universities. This required navigating time zone differences, cultural differences, language considerations, and remote collaboration. Successful international collaboration requires extra clear communication, cultural sensitivity and curiosity, flexibility and patience, and documentation and transparency. I'm comfortable working in English and enjoy the different perspectives multicultural teams bring.",
        "metadata": {"category": "work_experience", "topic": "international_collaboration", "type": "qa"}
    },
    {
        "id": "work_life_balance",
        "text": "Q: How important is work-life balance to you?\nA: Work-life balance is important, but I define it as sustainability rather than strict 9-to-5 boundaries. I'm willing to work hard and put in extra hours when needed. But balance means flexibility - if I work late for a deadline, I can recover afterward. I have autonomy over my schedule when possible. Work is intense but not relentless. Early in my career, I might work longer hours while learning. But I need that to be sustainable long-term. Red flags would be constant 60+ hour weeks, midnight emails requiring immediate response, or never being able to take actual time off.",
        "metadata": {"category": "work_preferences", "topic": "work_life_balance", "type": "qa"}
    },
    {
        "id": "work_questions_about_company",
        "text": "Q: What questions do you have about working here?\nA: I would ask about the role and learning - first 30-60-90 days, mentorship structure, technologies I'd work with. About the team - size, backgrounds, collaboration style, decision-making process. About growth - success metrics, career progression, learning opportunities. About the company - biggest challenges, culture evolution, what makes people stay. And practical questions - onboarding process, hiring timeline, any concerns about my background. These questions help me assess mutual fit and show I'm serious about making an informed decision.",
        "metadata": {"category": "interview_preparation", "topic": "company_questions", "type": "qa"}
    },
    {
        "id": "work_unfamiliar_industries",
        "text": "Q: Are you comfortable working in industries you're not familiar with?\nA: Yes, I'm very comfortable - that's an opportunity to learn. I don't need to be an industry expert to contribute value as a data analyst or developer. I bring technical skills, problem-solving ability, and capacity to learn quickly. I've proven I can learn new domains - knew nothing about decision support systems before my capstone or international learning platforms before my COIL project. Coming in without preconceptions can be valuable - I ask questions others assume and notice patterns domain experts might miss. The key is intellectual curiosity and willingness to learn.",
        "metadata": {"category": "adaptability", "topic": "industry_flexibility", "type": "qa"}
    },
    {
        "id": "work_handling_feedback",
        "text": "Q: How do you handle feedback and criticism?\nA: I handle feedback well because I see it as necessary for growth. I've actively sought feedback from professors, advisers, and team members throughout my career. Effective feedback needs specificity, actionable guidance, context, and timeliness. When I receive criticism, I listen fully before responding, ask clarifying questions, separate message from delivery, and create an action plan to improve. I don't take it personally - if my code has bugs, that's about the work, not me. Early in my career, I expect lots of feedback, and I welcome it.",
        "metadata": {"category": "professional_development", "topic": "feedback", "type": "qa"}
    },
    {
        "id": "work_continuous_learning",
        "text": "Q: What's your approach to professional development and continuous learning?\nA: I'm deeply committed to continuous learning. My approach includes formal learning through courses and certifications (Cisco certifications, AI Data Analyst workshop), hands-on learning through projects, learning in public by sharing and teaching, staying current through tech blogs and industry leaders, and seeking mentorship. I want a company that supports learning through training budgets, conference attendance, time for learning during work, and mentorship programs. I also take personal responsibility for learning outside work hours and staying current with relevant technologies.",
        "metadata": {"category": "professional_development", "topic": "learning", "type": "qa"}
    },
    {
        "id": "work_prioritizing_tasks",
        "text": "Q: How do you prioritize tasks when everything seems urgent?\nA: I clarify true deadlines and consequences, assess impact and value, consider dependencies, and evaluate effort required. Once assessed, I communicate my prioritization plan to stakeholders and confirm alignment. If I truly can't do everything, I'm upfront about it and negotiate deadlines or scope. In my final semester with capstone, exams, and JPCS event, I prioritized by completing capstone early, delegating the event to my board, and studying in focused blocks. The key is doing the most important things well and communicating clearly about realistic delivery.",
        "metadata": {"category": "work_style", "topic": "prioritization", "type": "qa"}
    },
    {
        "id": "work_outside_job_description",
        "text": "Q: Are you willing to take on responsibilities outside your job description?\nA: Yes, with considerations. I believe in being a team player and helping where needed. If additional work helps the team succeed, supports critical projects, or gives valuable learning, I'm willing. However, if additional responsibilities become permanent, they should be acknowledged - in job description, compensation, title, or growth plan. I'm happy to wear multiple hats temporarily, but I don't want to permanently do two jobs for one salary. The key is communication and fairness - I'll go above and beyond for a team that values that contribution.",
        "metadata": {"category": "work_style", "topic": "flexibility", "type": "qa"}
    },
    {
        "id": "work_communication_style",
        "text": "Q: What's your preferred communication style at work?\nA: My preferred style is clear, documented, and respectful. I value directness - tell me what you need, what's working, what's not. I believe in documentation - important decisions and discussions should be written down. I like asynchronous communication for non-urgent matters, but value synchronous for complex problem-solving. I prefer regular check-ins over long silence followed by crises. I adapt my communication to my audience - more technical with developers, more business-focused with stakeholders. What doesn't work is passive-aggressive communication or unclear expectations.",
        "metadata": {"category": "work_style", "topic": "communication", "type": "qa"}
    },
    {
        "id": "work_positive_team_environment",
        "text": "Q: How do you contribute to a positive team environment?\nA: I lead by example - maintain high standards, meet deadlines, communicate proactively. I support teammates through helping debug code, sharing knowledge, or covering when needed. I celebrate wins and acknowledge contributions. I maintain professionalism even under pressure. I bring positive energy and enthusiasm. I promote inclusivity - ensure quieter members are heard and welcome different perspectives. I own my mistakes and apologize when wrong. Team environments are built through consistent small actions - showing up prepared, following through on commitments, and being reliable.",
        "metadata": {"category": "teamwork", "topic": "team_environment", "type": "qa"}
    },
    {
        "id": "work_company_research",
        "text": "Q: What do you know about our company?\nA: I would thoroughly research before interviews - review website (mission, values, products, team), recent news and press releases, team backgrounds on LinkedIn, technology stack through job postings and tech blog, employee reviews for culture insights, and social media for company culture. I'd prepare specific observations like 'I noticed your recent expansion into X market - how does this role support that growth?' This research shows I'm serious about the opportunity and helps me ask better questions to assess fit.",
        "metadata": {"category": "interview_preparation", "topic": "company_research", "type": "qa"}
    },
    {
        "id": "work_why_tech",
        "text": "Q: Why do you want to work in tech specifically?\nA: I want to work in tech because it combines problem-solving, continuous learning, and real-world impact. Technology solves modern challenges in education, healthcare, and financial inclusion. I enjoy building things people actually use. Tech offers work that's logical like database design, creative like UI development, and collaborative like team projects. The continuous learning excites me - tech constantly evolves. This industry rewards merit and skills. Tech offers flexibility, international opportunities, and competitive compensation. But beyond practical benefits, I genuinely enjoy the work - solving complex problems and seeing data reveal insights.",
        "metadata": {"category": "career_motivation", "topic": "tech_industry", "type": "qa"}
    },
    {
        "id": "work_staying_updated",
        "text": "Q: How do you stay updated with technology trends?\nA: I follow tech blogs and publications, engage with YouTube channels on development and analytics, stay active on GitHub, participate in online communities like Stack Overflow and Reddit, take online courses (Cisco certifications, AI workshop), learn from peers through JPCS tech talks, and monitor job postings to see what skills are in demand. I focus on depth in core technologies while staying broadly aware of trends. The goal isn't chasing every new framework, but understanding where the industry is heading and what skills will be valuable.",
        "metadata": {"category": "professional_development", "topic": "staying_current", "type": "qa"}
    },
    {
        "id": "work_technical_disagreement",
        "text": "Q: What would you do if you disagreed with a technical decision made by your team?\nA: I'd handle it professionally and constructively. First, ensure I fully understand the decision and reasoning. Evaluate if it's worth raising. If yes, prepare clear explanation of concerns with specific examples, alternative approaches with trade-offs, and supporting data. Choose the right time and setting. Present concerns respectfully as 'different perspective' not 'you're wrong.' Listen to responses with open mind. Accept the final decision gracefully even if it's not my recommendation. Document concerns for future reference. Commit fully to implementing the decision made. Disagreement is healthy but execution requires unity.",
        "metadata": {"category": "teamwork", "topic": "conflict_resolution", "type": "qa"}
    },
    {
        "id": "work_unclear_requirements",
        "text": "Q: How do you handle ambiguous or unclear requirements?\nA: I actively seek clarity rather than make assumptions. Identify what's unclear, list specific questions needing answers, reach out to stakeholders for clarification, and document the clarification received. If I can't get clarity quickly and work must start, I make educated assumptions, document those assumptions clearly, build in flexibility to change, and communicate regularly as I learn more. In my capstone, vague initial requirements of 'a system for good moral certificates' became clear through asking who users are, their current process, specific problems we're solving, what success looks like, and what's in/out of scope.",
        "metadata": {"category": "work_style", "topic": "requirements_management", "type": "qa"}
    },
    {
        "id": "work_motivation",
        "text": "Q: What motivates you to do your best work?\nA: Several things motivate me. Seeing impact - when my work helps someone or solves real problems. Learning and growth - mastering new technologies and tackling harder challenges. Team success - being part of a team working toward shared goals. High standards - I have internal standards for excellence. Autonomy and trust - being given responsibility and trusted to deliver. Recognition - having good work acknowledged. What demotivates me is when work feels meaningless or when good work goes unrecognized while poor work faces no consequences. I'm motivated by environments where excellence matters and is valued.",
        "metadata": {"category": "work_motivation", "topic": "motivation_factors", "type": "qa"}
    },
    {
        "id": "work_documentation_approach",
        "text": "Q: How do you approach documentation in your work?\nA: I take documentation seriously. For code, I write clear comments explaining why, not just what. I document setup, dependencies, and known issues. I create README files with overview, installation, usage, and contribution guidelines. For processes, I document decisions and reasoning, create runbooks for repeated tasks, and maintain change logs. For collaboration, I take and share meeting notes, document agreements, and update project status regularly. Good documentation helps me remember, enables teammates to understand my work, serves as knowledge transfer, and reduces repetitive questions. I document as I go, not as an afterthought.",
        "metadata": {"category": "work_style", "topic": "documentation", "type": "qa"}
    },
    {
        "id": "work_team_role",
        "text": "Q: What role do you typically take in a team project?\nA: My role evolves based on team needs and my strengths. I naturally gravitate toward leadership or coordination - Team Leader in COIL project, led programming in capstone while managing team, currently lead 100+ members as JPCS President. But I'm comfortable as strong individual contributor. I often become primary developer or database designer. I'm good at bridging technical and non-technical team members. I assess what the team needs and focus there. I prefer collaborative environments with fluid roles. What matters is clear communication about responsibilities, regular check-ins, and shared commitment to goals.",
        "metadata": {"category": "teamwork", "topic": "team_roles", "type": "qa"}
    },
    {
        "id": "work_unethical_request",
        "text": "Q: How would you handle a situation where you're asked to do something unethical?\nA: I'd handle it directly but professionally. First, ensure I understand correctly through clarifying questions. If clearly unethical (legally wrong, violates policy, harms users, compromises security), I would clearly decline and explain concerns. Document the request and response. Suggest ethical alternatives if possible. If pressured, escalate to HR or appropriate authority. Assess if this is isolated or reflects company culture. Throughout my career, I've maintained integrity - earned grades honestly, led with transparency, built systems with proper security. I'd rather lose an opportunity than compromise my integrity.",
        "metadata": {"category": "ethics", "topic": "ethical_decisions", "type": "qa"}
    },
    {
        "id": "work_agile_experience",
        "text": "Q: What's your experience with Agile or other development methodologies?\nA: I don't have formal Agile training yet, but practiced similar principles in my capstone - worked in iterations with 2-week sprints, built and tested incrementally, demonstrated progress regularly, and incorporated feedback. I've practiced key Agile values like working software over extensive documentation, customer collaboration, and responsiveness to change. I'm familiar with Agile concepts from coursework - basics of Scrum, Kanban, and general Agile principles. I'm eager to learn formal Agile methodology on the job. I'm comfortable with the mindset - flexibility, iteration, and collaboration.",
        "metadata": {"category": "work_methods", "topic": "agile", "type": "qa"}
    },
    {
        "id": "work_quality_assurance",
        "text": "Q: How do you ensure the quality of your work?\nA: Through systematic practices. Plan before executing. Test thoroughly including edge cases - in capstone, tested with invalid inputs, missing data, simultaneous users, different browsers. Review and refactor - don't just write working code, clean it up and optimize. Seek feedback early and often. Document as I go. Maintain high personal standards. Learn from mistakes. Quality isn't just final product - it's the process. Rushing to 'done' creates technical debt. Taking time to do things right the first time is faster overall.",
        "metadata": {"category": "work_style", "topic": "quality", "type": "qa"}
    },
    {
        "id": "work_first_six_months_learning",
        "text": "Q: What would you want to learn in your first six months on the job?\nA: I'd want to learn technical skills and business context. Technically: master the specific technology stack, understand codebase architecture, learn development workflow (code review, testing, deployment, monitoring). For business: understand the product deeply (users, problems, revenue model, key metrics), know how my team fits into larger organization, understand decision-making process, and learn what success looks like. Build relationships with key people. Understand company culture. Importantly, contribute meaningfully - not just learn, but deliver value through completed features, fixed bugs, or improved documentation. The goal is becoming a productive team member who works increasingly independently.",
        "metadata": {"category": "onboarding", "topic": "learning_goals", "type": "qa"}
    },
    {
        "id": "work_repetitive_tasks",
        "text": "Q: How do you handle repetitive or routine tasks?\nA: I look for ways to automate or streamline them. My first instinct is 'can this be scripted or automated?' For truly routine tasks, I batch them to maintain focus. I use templates and checklists for consistency. I maintain quality even on routine work. I stay focused by understanding why the task matters. I communicate if routine work takes too much time - maybe there's a better approach. I understand that early in my career, some routine work is part of learning. I'm willing to do unglamorous work as long as there's a path to more complex responsibilities.",
        "metadata": {"category": "work_style", "topic": "routine_tasks", "type": "qa"}
    },
    {
        "id": "work_first_week_questions",
        "text": "Q: What questions would you ask during your first week on the job?\nA: About work: What to prioritize learning? Current project priorities? Biggest team challenge? About team: Who to reach out to for questions? Communication style? Team expertise areas? About processes: Code review process? Work tracking? Deployment process? Bug handling? About product: Who are users? What metrics matter? User pain points? Competitor comparison? About expectations: Performance evaluation? Success in first 30-60-90 days? Check-in frequency? Best way to ask questions? About culture: Typical work hours? Work-life balance? Team traditions? Feedback process? I'd observe before asking and batch questions rather than interrupting constantly.",
        "metadata": {"category": "onboarding", "topic": "first_week", "type": "qa"}
    },
    {
        "id": "work_mentorship_importance",
        "text": "Q: How important is mentorship to you in a new role?\nA: Mentorship is extremely important, especially in my first professional role. There's a huge difference between school projects and production systems. Good mentorship includes technical guidance (code reviews that teach, pairing sessions, help when stuck), career guidance (understanding paths, skill development advice, navigating workplace), and context (business decisions, company culture, connecting technical work to outcomes). I value mentors who make time for questions, give honest feedback, share successes and failures, and invest in my growth. I'm respectful of their time - come prepared, research first, apply what I learn. I'm looking for companies with formal mentorship or cultures where senior people develop junior talent.",
        "metadata": {"category": "professional_development", "topic": "mentorship", "type": "qa"}
    },
    {
        "id": "work_perfectionism_balance",
        "text": "Q: How do you balance perfectionism with delivering results?\nA: I naturally tend toward perfectionism (my perfect 1.00 grades show this), but I've learned perfect is the enemy of done. My approach: define 'good enough' based on context and stakes, ship iteratively (get working first, then improve), timebox perfection, focus on what users notice, and seek feedback early. I distinguish perfectionism from professionalism - professional work is well-tested, clearly written, properly documented, and meets requirements (non-negotiable). Perfectionism is optimizing already-working code or redesigning usable UI (negotiable). The key is being honest about diminishing returns and delivering value consistently.",
        "metadata": {"category": "work_style", "topic": "quality_vs_speed", "type": "qa"}
    },
    {
        "id": "work_problem_solving_stuck",
        "text": "Q: What's your approach to problem-solving when you're stuck?\nA: I follow a systematic approach. Clearly define the problem - what exactly isn't working? Google and research - someone likely faced this before. Isolate the problem - can I reproduce it? Create minimal example? Experiment systematically - change one thing at a time, test, document. Take breaks - stepping away helps see fresh. Explain to someone (rubber duck debugging) - articulating often reveals solution. If still stuck, ask for help but come prepared - what I tried, what I learned, what I think might be happening. In capstone, spent hours on authentication errors, systematically checking config, database permissions, code logic until finding typo in environment variable.",
        "metadata": {"category": "problem_solving", "topic": "debugging", "type": "qa"}
    },
    {
        "id": "work_negative_performance_review",
        "text": "Q: How would you handle receiving a negative performance review?\nA: I'd handle it professionally and constructively. Listen fully without defensiveness. Separate valid criticism from delivery. Seek clarity on expectations - what does good performance look like? Create action plan with concrete steps, specific metrics, and timeline for reassessment. Request support - what resources, training, or mentorship can help? Follow up regularly showing progress. Reflect honestly on whether this is a fit issue. When I've gotten lower grades than expected, I've gone to professors to understand and improve. I view negative feedback as information that helps me grow. The key is staying professional, being coachable, and taking ownership of improvement.",
        "metadata": {"category": "professional_development", "topic": "performance_feedback", "type": "qa"}
    },
    {
        "id": "work_leaving_job_reasons",
        "text": "Q: What would make you leave a job?\nA: Several things: lack of growth (not learning after 6-12 months), misalignment with values (toxic culture or unethical operations), no path forward (no career progression despite strong performance), being underutilized (skills not being used effectively), poor management (micromanagement, lack of clarity, favoritism), or unsustainable work-life (constant 60+ hour weeks, no time off). However, I'm realistic about early career challenges. I'm committed to working through difficulties before jumping ship - would give it at least a year unless seriously wrong. What would keep me: continuous learning, good management and mentorship, seeing my work have impact, fair compensation, and positive team culture.",
        "metadata": {"category": "career_decisions", "topic": "job_retention", "type": "qa"}
    },
    {
        "id": "work_competing_priorities",
        "text": "Q: How do you handle competing priorities from different stakeholders?\nA: Make all priorities visible - list what each stakeholder wants with deadlines and importance. Assess objectively - what's actual business impact and urgency? Communicate the conflict to stakeholders - 'I have requests from you and Person B, both urgent. Here's my workload. I can't do both by tomorrow. How should I prioritize?' Facilitate stakeholder alignment - sometimes they need to talk to each other. If they can't align, escalate to my manager. Be clear about tradeoffs - if I do Project A first, Project B will be delayed. From student government, I learned when resources are limited, someone must make choices. My job is providing clear information for good choices, not trying to make everyone happy.",
        "metadata": {"category": "work_style", "topic": "stakeholder_management", "type": "qa"}
    },
    {
        "id": "work_backup_career_plan",
        "text": "Q: What's your backup plan if a career in tech doesn't work out?\nA: I'm very confident tech will work out based on my proven aptitude. But realistically, my backup would leverage my leadership experience and organizational skills - project management, organizational development, or educational administration. I could leverage database and information management skills in business analyst or operations roles. My degree qualifies me for IT support, systems administration, or database administration. I could pursue teaching in technical training/bootcamps. I could work in education technology in non-technical roles like product management. But I see these as alternative applications of my skills rather than backup plans. The skills I'm building - problem-solving, learning quickly, working with data, communicating clearly, leading teams - are valuable regardless of industry.",
        "metadata": {"category": "career_planning", "topic": "alternatives", "type": "qa"}
    },
    {
        "id": "work_career_decisions_approach",
        "text": "Q: How do you approach making career decisions?\nA: I'm systematic and thoughtful. Gather information - research thoroughly. Clarify values and priorities - what matters most right now. Assess fit across dimensions - technical learning, team culture, compensation, location, career trajectory. Seek perspective from trusted people. Consider timing - sometimes best opportunity isn't perfect but it's right for now. Trust instincts - if something feels off, pay attention. Make decisions and commit - don't endlessly second-guess. My choices (BSIT, Web Development focus, student leadership, data analytics pursuit) all followed this pattern. I'm realistic that early career decisions are less critical - my first job will teach me what I like and don't like, informing better decisions later.",
        "metadata": {"category": "career_decisions", "topic": "decision_making", "type": "qa"}
    },
    {
        "id": "work_salary_role_in_decisions",
        "text": "Q: What role does salary play in your career decisions?\nA: Salary is important but not the only factor. I need fair compensation to support myself and save, especially if relocating. If offers are similar otherwise, higher salary would be tiebreaker. But I would take lower salary for significantly better learning, stronger mentorship, better culture, or clearer growth path. Early in my career, I'm investing in learning and building foundation. The skills and experience I gain in first few years determine earning potential for decades. That said, I have a floor - salary must cover living expenses and allow saving. The key is evaluating complete package and making informed tradeoffs. I'd also consider trajectory - lower starting salary with clear growth potential might beat higher salary with no path forward.",
        "metadata": {"category": "compensation", "topic": "salary_importance", "type": "qa"}
    },
    {
        "id": "work_work_ethic",
        "text": "Q: How would you describe your work ethic?\nA: My work ethic is committed, consistent, and quality-focused. Committed means following through, meeting deadlines or communicating early, taking ownership, and not quitting when hard. Consistent means delivering reliably over time - maintained President's Lister for seven semesters while juggling leadership. Quality-focused means taking pride in doing things well, not cutting corners, testing thoroughly, and not settling for barely working. My results show this - perfect 1.00 grades, completed capstone with all features working, successful international collaboration, well-functioning organizations under my leadership. I work hard but also work smart - prioritize effectively, use systems to stay organized, delegate when appropriate, and maintain health and energy.",
        "metadata": {"category": "work_style", "topic": "work_ethic", "type": "qa"}
    },
    {
        "id": "work_onboarding_expectations",
        "text": "Q: What are your expectations for onboarding and training?\nA: For first week: orientation to company, culture, values; team introductions; system access and tool setup; overview of products and metrics. For first month: technical onboarding to codebase and workflows, assigned mentor, small well-defined tasks, regular check-ins, clear expectations. For first three months: increasing responsibility and independence, guidance on bigger projects with support, feedback on performance, integration into team rituals. I don't expect to be left alone or productive at full speed immediately. I commit to coming prepared, taking initiative, asking for help when stuck, documenting what I learn, and showing steady progress. Good onboarding is partnership between company investment and employee ownership.",
        "metadata": {"category": "onboarding", "topic": "expectations", "type": "qa"}
    },
    {
        "id": "work_success_definition",
        "text": "Q: How do you define success in a role?\nA: I define success across multiple dimensions. Technical growth - learning new skills, handling more complex problems, becoming more independent. Business impact - contributing to team goals, features being used, analyses influencing decisions. Team contribution - helping teammates succeed, making team better through my presence. Professional development - building relationships and reputation, learning how businesses work. Personal satisfaction - feeling challenged and engaged, proud of work produced. Success metrics: completed projects meeting requirements, positive feedback, increased responsibilities, skills learned and certifications earned, being someone team relies on. Early in career, success is growth trajectory - improving steadily and positioning well for next year, not being senior level immediately.",
        "metadata": {"category": "career_goals", "topic": "success_metrics", "type": "qa"}
    },
    {
        "id": "work_long_term_goals",
        "text": "Q: What are your long-term career goals beyond 5 years?\nA: Beyond 5 years, I see myself in a senior technical role with leadership responsibilities. Possible paths: Senior Data Analyst or Analytics Manager leading a team, Technical Lead or Engineering Manager combining technical skills with team leadership, Product Manager or Solutions Architect bridging technical and business strategy. Common across these: combining technical expertise with broader impact - multiplying impact through others, making strategic decisions, understanding business deeply, being known for technical excellence and leadership. I'm open to specialization in domains like education technology or healthcare analytics. Or entrepreneurship - building my own product or consulting business. The key is continuous learning and staying adaptable. I focus on building transferable skills - problem-solving, communication, leadership, learning agility.",
        "metadata": {"category": "career_goals", "topic": "long_term_vision", "type": "qa"}
    }
]

print(f"Starting upload of {len(work_qa_vectors)} work-related Q&A vectors...")

# Upload vectors in batches
batch_size = 20
total_uploaded = 0

for i in range(0, len(work_qa_vectors), batch_size):
    batch = work_qa_vectors[i:i + batch_size]
    
    # Prepare vectors for upload
    vectors_to_upload = [
        (vec["id"], vec["text"], vec["metadata"])
        for vec in batch
    ]
    
    try:
        index.upsert(vectors=vectors_to_upload)
        total_uploaded += len(batch)
        print(f"✓ Uploaded batch {i//batch_size + 1}/{(len(work_qa_vectors) + batch_size - 1)//batch_size} ({total_uploaded} vectors)")
    except Exception as e:
        print(f"✗ Error uploading batch {i//batch_size + 1}: {str(e)}")

print(f"\n{'='*60}")
print(f"Upload Complete!")
print(f"{'='*60}")
print(f"Total vectors uploaded: {total_uploaded}")
print(f"Categories covered:")
print(f"  - Work Preferences (relocation, remote work, travel)")
print(f"  - Career Decisions (job selection, priorities)")
print(f"  - Professional Development (learning, mentorship)")
print(f"  - Work Style (communication, quality, teamwork)")
print(f"  - Compensation & Growth")
print(f"  - International & Multicultural Work")
print(f"{'='*60}")

# Get info about the index
try:
    info = index.info()
    print(f"\nUpstash Vector Database Info:")
    print(f"Total vectors in database: {info.get('total_vector_count', 'N/A')}")
    print(f"Dimension: {info.get('dimension', 'N/A')}")
except Exception as e:
    print(f"Could not fetch index info: {str(e)}")

print("\nDone! The work-related Q&A are now available in your digital twin.")
