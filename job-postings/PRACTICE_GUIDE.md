# 🎯 Interview Practice Guide - Creating Custom Job Postings

## 📚 Overview

This guide shows you how to create new job postings for interview practice simulations with your digital twin MCP server.

---

## ✅ Example Created: E-commerce Analyst

**See**: `job2-ecommerce-analyst.md` for a complete, production-quality example

**Key Features**:
- Detailed company overview and role context
- 7 specific responsibilities with tools
- Philippines-based (removes visa blocker!)
- E-commerce metrics glossary
- 90-day success milestones
- Interview focus areas
- Expected difficulty: 7/10

**Try this next** to see how your score improves without the work authorization barrier!

---

## 🚀 How to Run Interview Simulations

### Option 1: GitHub Copilot (VS Code)
```
Prompt: "You are a senior recruiter conducting a comprehensive interview simulation using the job posting in job-postings/job2-ecommerce-analyst.md and my digital twin MCP server data. Conduct a 4-phase interview:
1. Initial Screening
2. Technical Assessment
3. Cultural Fit Evaluation
4. Final Comprehensive Report"
```

### Option 2: Claude Desktop
1. Make sure MCP server is running (`pnpm dev`)
2. Say: "I'd like to practice an interview for the e-commerce analyst role in job2-ecommerce-analyst.md. Use my digital twin profile."

---

## 📊 Recommended Practice Scenarios

### 1. ✅ E-commerce Analyst (CREATED)
**File**: `job2-ecommerce-analyst.md`
- **Difficulty**: 7/10
- **Focus**: Domain knowledge, Google Analytics
- **Expected Score**: 8.5-9/10 (visa blocker removed)

### 2. Mid-Level Analyst (Stretch Goal)
**File**: `job3-mid-level-analyst.md` (Create using template)
- **Difficulty**: 9/10
- **Focus**: Statistical analysis, Python required, mentoring
- **Purpose**: Identify future learning areas

### 3. BI Analyst (Tool-Focused)
**File**: `job4-bi-analyst.md` (Create using template)
- **Difficulty**: 8/10
- **Focus**: Tableau/Power BI, dashboard design
- **Purpose**: Test visualization skills

### 4. Remote Analyst (Cultural Fit)
**File**: `job5-remote-analyst.md` (Create using template)
- **Difficulty**: 6/10
- **Focus**: Async communication, self-management
- **Purpose**: Test remote readiness

### 5. Data Engineer (Technical Depth)
**File**: `job6-data-engineer.md` (Create using template)
- **Difficulty**: 10/10
- **Focus**: ETL pipelines, cloud platforms, optimization
- **Purpose**: Explore technical boundaries

---

## 📝 Job Posting Template

```markdown
# [Job Title] at [Company Name]

## Company Overview
[1-2 sentences about the company, industry, culture]

## Role Summary
[2-3 sentences describing role, team, responsibilities]

## Key Responsibilities
- [Specific responsibility 1 with tools]
- [Specific responsibility 2 with stakeholders]
- [Specific responsibility 3 with deliverables]
- [etc.]

## Required Qualifications
- [Education]
- [Experience level]
- [Technical skills]
- [Soft skills]

## Preferred Qualifications
- [Advanced skills]
- [Certifications]
- [Domain knowledge]

## Technical Skills
**Required**: [List with proficiency levels]
**Preferred**: [Advanced tools/techniques]

## What Success Looks Like (First 90 Days)
- 30 days: [Onboarding milestone]
- 60 days: [First project]
- 90 days: [Independent contribution]

## Work Arrangement
- Location / Remote / Hybrid
- Hours and timezone
- Travel requirements

## Compensation & Benefits
- Salary range
- Benefits
- Growth opportunities

## Interview Focus Areas
- [Technical area 1]
- [Behavioral competency 1]
- [Cultural fit dimension 1]
```

---

## 📋 Creation Checklist

### Research Phase
- [ ] Find 2-3 real job postings for the role
- [ ] Note common skills and requirements
- [ ] Identify industry terminology
- [ ] Research typical salary ranges

### Writing Phase
- [ ] Use template above
- [ ] Include 5-7 key responsibilities
- [ ] Separate required vs. preferred skills
- [ ] Add specific tools/technologies
- [ ] Include success milestones

### Difficulty Calibration
- [ ] Identify 2-3 skills you have (confidence builders)
- [ ] Identify 2-3 skills you're learning (progress test)
- [ ] Identify 1-2 skills you lack (gap identification)
- [ ] Note expected difficulty (6-10/10)

---

## 📊 Track Your Progress

| Job Posting | Difficulty | Tech Score | Cultural Fit | Overall | Date |
|-------------|-----------|------------|--------------|---------|------|
| job1.md (Bizcap) | 8/10 | 24/25 (96%) | 25/25 (100%) | 8.5/10 | Oct 1 |
| job2.md (E-commerce) | 7/10 | __/25 | __/25 | __/10 | _____ |
| job3.md (Mid-level) | 9/10 | __/25 | __/25 | __/10 | _____ |

**Goal**: See improvement over time as you learn Python, build Tableau dashboards, and practice more interviews.

---

## 🎯 Practice Schedule

### Week 1: Baseline
- ✅ Job 1 (Bizcap) - Score: 8.5/10
- 🎯 Job 2 (E-commerce) - Test without visa blocker

### Week 2-4: Skill Building
- Complete Python pandas course
- Build 2 Tableau dashboards
- Don't interview - focus on learning

### Week 4: Progress Check
- Job 2 again - Compare scores
- Job 5 (Remote) - Test improvements

### Week 8: Mid-Point
- Job 4 (BI Analyst) - Test Tableau skills
- Job 3 (Mid-level) - Identify gaps

### Week 12: Final Assessment
- All 5 jobs again
- Compare Week 1 vs Week 12 scores

**Expected Progress**:
- Week 1: 8.5/10 → Week 4: 8.8/10 → Week 8: 9.0/10 → Week 12: 9.2/10

---

## 🔄 After Each Interview

1. **Save responses** - `interview-results-job2.md`, etc.
2. **Note difficult questions** - What stumped you?
3. **Identify gaps** - Missing skills?
4. **Update profile** - Add to `digitaltwin.json`
5. **Re-embed** - `python embed_digitaltwin.py`

---

## 📚 Resources

- **Your Profile**: `data/digitaltwin.json`
- **Example Interview**: `interview-results-tracker.md`
- **Full Analysis**: `PROFILE_IMPROVEMENT_REPORT.md`
- **Quick Actions**: `QUICK_ACTION_CHECKLIST.md`

---

**Next Step**: Try `job2-ecommerce-analyst.md` to see how removing the visa blocker improves your score! 🚀
