# Resume System: Multi-Source Documentation Strategy

> **A systematic approach to creating tailored, accurate, and impactful resumes from comprehensive source documentation.**

This repository demonstrates how to organize career information for maximum flexibility and reusability. Instead of maintaining multiple outdated resume versions, this system uses **source documents** as a single source of truth that can be quickly adapted for specific job applications.

---

## **Why This System?**

**Problem:** Traditional resumes are static documents that become outdated, duplicated, and inconsistent. Career changers and self-taught developers especially struggle with:
- Showcasing rapid skill growth
- Tailoring content for different roles
- Maintaining accuracy across versions
- Tracking comprehensive accomplishments

**Solution:** Separate **information gathering** from **information presentation**.

**This system:**
- ✅ Maintains one source of truth (no version conflicts)
- ✅ Enables quick tailoring for specific jobs
- ✅ Tracks complete career progression
- ✅ Supports multiple output formats (HTML, PDF, DOCX)
- ✅ Documents technical depth without overwhelming recruiters

---

## **System Architecture**

### **Source Documents** (Information Arsenal)

**[timeline.md](timeline.md)** - Complete career history
- Full progression from Army (1996) through present
- Army paramedic, Toyota career growth, software transition
- Projects, accomplishments, and transferable skills
- Professional context showing discipline and growth trajectory

**[tech-stack.md](tech-stack.md)** - Comprehensive technical documentation
- Organized by category (Frontend, Backend, DevOps, Testing, AI, etc.)
- Specific tools, frameworks, and methodologies
- Practical experience and implementation details
- Application architecture and patterns

**[resume-draft.md](resume-draft.md)** - Master resume document
- Complete professional summary
- All technical skills
- Full work history
- Detailed project descriptions
- Education background

### **Output Documents** (Tailored Deliverables)

**[resume-one-page.md](resume-one-page.md)**
- One-page resume emphasizing career discipline and proven growth
- Condensed from source documents with strongest skills and recent work
- Ready for most full-stack developer applications

**[resume-html/](resume-html/)**
- Professional HTML/CSS resume demonstrating front-end skills
- WCAG AA accessible with semantic HTML and proper contrast
- Print-optimized for clean PDF output
- Mobile-responsive design

**cover-letter-template.md** (Planned)
- Framework for job-specific cover letters
- Pull relevant accomplishments from source docs
- Customizable for each application

---

## **Key Accomplishments Documented**

This resume system captures a career built on discipline and proven growth—from high-stakes military service through progressive corporate leadership to software development:

### **1996-2001: U.S. Army (Paramedic)**
- 5 years delivering emergency medical care under high-pressure conditions
- Developed discipline, systematic thinking, and attention to detail
- Foundation of work ethic that carries through entire career

### **2017-2023: Toyota (Finance Manager)**
- 7 years advancing through three roles: Salesperson → Sales Manager → Finance Manager
- Mastered financial analysis, customer relationship management, and complex processes
- Built reputation for systematic problem-solving and process optimization

### **2023: Foundation Year (Software Transition)**
- Self-taught computer science fundamentals
- Mastered MEVN stack (MongoDB, Express.js, Vue.js, Node.js)
- Built 15+ learning projects demonstrating progressive skill growth

### **2024: Freelance & Application Year**
- Applied learning through client projects
- Full-stack web development (Node.js, Express, databases)
- Python automation and data processing
- Built flashcard management system (534+ entries, 431+ commits)
- Developed Merge 52 card game with complex state management

### **2025: Professional Year**
- **Acadio (Spring-Winter 2025):** Full-Stack Developer at EdTech company
  - Automated flashcard generation reducing weeks to minutes
  - Built validation pipelines with auto-correction
  - Primary technical problem-solver on team

- **needthisdone.com (Nov 2025-Present):** Founder & Full-Stack Developer
  - Production e-commerce platform with layered architecture
  - Comprehensive testing (Playwright E2E, Vitest unit/integration, WCAG AA accessibility)
  - Multi-environment Docker containerization
  - Professional git workflow (main/dev/experiment branches)

---

## **Technical Highlights**

**Full-Stack Capabilities:**
- Frontend: React, Next.js, Vue.js, TypeScript, HTML/CSS
- Backend: Node.js, Express.js, Python
- Databases: PostgreSQL, Supabase (pgvector), MongoDB, Redis
- DevOps: Docker, Docker Compose, Nginx, GitHub Actions CI/CD
- Testing: Playwright (E2E), Vitest (unit/integration), accessibility testing
- AI Integration: OpenAI API, Vercel AI SDK, context-aware chatbots with RAG patterns

**Notable Projects:**
- **needthisdone.com:** Production business platform (Next.js 14, Supabase, Docker, Nginx)
- **Flashcard Management System:** Python/HTML automation managing 534+ entries
- **Merge 52:** JavaScript game with OOP design and AI decision system

---

## **How To Use This System**

### **For Job Applications:**

1. **Review the role requirements** - What skills matter most?

2. **Pull relevant content from source docs:**
   - Check **timeline.md** for matching experience
   - Reference **tech-stack.md** for specific technical skills
   - Use **resume-draft.md** as a starting template

3. **Create a tailored version:**
   - Emphasize skills matching the job description
   - Lead with relevant projects (needthisdone.com for full-stack roles)
   - Condense to one page by removing less-relevant details

4. **Write a cover letter:**
   - Reference specific accomplishments from source docs
   - Connect your background to their needs
   - Use metrics (60-80% query reduction, 15-50x speed improvement)

### **For Maintaining the System:**

**When you complete a new project:**
1. Add to **timeline.md** under the appropriate year
2. Add technical details to **tech-stack.md** in relevant sections
3. Update **resume-draft.md** if it's a major accomplishment

**When you learn a new skill:**
1. Add to **tech-stack.md** under appropriate category
2. Note where you applied it in **timeline.md**
3. Refresh **resume-draft.md** Technical Skills section

---

## **Philosophy: Accuracy Over Affirmation**

This system prioritizes **verifiable facts and concrete metrics** over generic claims:

❌ **Avoid:**
- "Highly skilled developer"
- "Expert in modern frameworks"
- "Passionate about technology"

✅ **Use:**
- "Reduced database queries by 60-80%"
- "Built automated system reducing weeks to minutes"
- "Implemented 5+ E2E test suites with Playwright"

Every claim in these documents is:
- **Verifiable:** Can be demonstrated in code or explained technically
- **Quantified:** Includes numbers, timeframes, or specific technologies
- **Contextual:** Explains what was built and why it matters

---

## **The Meta-Resume: Why This Project Itself Demonstrates Skills**

This resume system is **itself** a portfolio piece, demonstrating:

### **System Design**
- Information architecture separating concerns (source vs. output)
- Reusable templates for quick customization
- Single source of truth eliminating version conflicts

### **Documentation**
- Clear README explaining system usage
- Organized file structure (timeline, tech-stack, outputs)
- Comprehensive technical documentation

### **Problem-Solving**
- Identified pain point: maintaining multiple resume versions
- Designed solution: multi-source documentation strategy
- Implemented system: structured markdown files with clear purpose

### **Professional Workflow**
- Git repository demonstrating version control
- Markdown for portability and maintainability
- Systematic approach to career documentation

### **Front-End & CSS Architecture** (HTML Resume)
- **Responsive Design:** Mobile-first CSS with breakpoints for tablet and desktop
- **WCAG AA Accessibility:** Semantic HTML, skip links, focus states, contrast-compliant colors
- **CSS Architecture:** Separation of concerns (colors.css for theming, styles.css for layout)
- **DRY Principles:** Centralized color system using CSS variables
- **Print Optimization:** Single-page PDF output with optimized typography

---

## **File Structure**

```
Resume/
├── README.md                    # This file - system documentation
├── timeline.md                  # Career progression (1996-2025)
├── tech-stack.md               # Comprehensive technical skills
├── resume-draft.md             # Master resume (full version)
├── resume-one-page.md          # One-page resume for applications
└── resume-html/                # HTML/CSS version
    ├── index.html              # Semantic, accessible markup
    ├── styles.css              # Layout and typography
    ├── colors.css              # Centralized color system
    └── resume.pdf              # Print-optimized output
```

---

## **Technologies Used in This System**

- **Markdown:** Structured documentation with portability
- **Git/GitHub:** Version control and public portfolio
- **Systematic Documentation:** Clear information architecture

---

## **Future Enhancements**

- [x] One-page resume (resume-one-page.md)
- [x] HTML/CSS resume version (resume-html/)
- [ ] Cover letter template with placeholders
- [ ] Job-specific resume variants (DevOps focus, AI focus, etc.)

---

## **Contact**

**Abiezer "Abe" Reyes**
- Email: abe.raise@gmail.com
- Website: [needthisdone.com](https://needthisdone.com)
- GitHub: [@AbeJitsu](https://github.com/AbeJitsu)

---

## **License**

This resume system framework is available for others to adapt. The specific career content is personal to Abiezer Reyes.

---

*"The way you organize information reflects how you think about systems."*
