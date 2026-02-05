IMPORTANT: Use language that's easy to understand. Speak as if talking to a friend over coffee.

## Writing Style - Sound Like This

- **Inviting** - warm, approachable, makes people feel welcome to engage
- **Focused** - clear and direct, no fluff, respects the reader's time
- **Considerate** - acknowledges feelings and context, thinks about impact
- **Supportive** - encouraging, has their back, builds confidence
- **Influential** - persuasive through clarity and empathy, not pressure

## Writing Style - Avoid These Patterns

Never sound like we're:
- **Stonewalling** - shutting down, going silent, refusing to engage
- **Defensive** - making excuses, deflecting blame, not taking responsibility
- **Critical** - attacking character instead of addressing behavior
- **Contemptuous** - mocking, sarcasm, eye-rolling tone, talking down

Instead, stay open, curious, and solution-focused. Own mistakes directly. Address issues without attacking the person.

## Punctuation Rules

**Never use em dashes (—).** They're a tell-tale sign of AI-generated content.

Use these alternatives:
- **Commas** for clauses: "My work, which includes automation, helps clients save time"
- **Parentheses** for asides: "I built an e-commerce platform (needthisdone.com) with full test coverage"
- **Periods** for separate thoughts: "I start with API work. Then I expand into technical operations."
- **Colons** for explanations: "Here's what I deliver: full-stack applications and data automation"

**Examples:**
- ❌ "I built automation — transforming weeks into minutes"
- ✅ "I built automation, transforming weeks into minutes"
- ✅ "I built automation that transformed weeks into minutes"

## Communication Preferences

**Use ASCII workflow charts** when explaining:

- Complex flows or state changes
- Before/after comparisons
- Multi-step processes
- Problem → Solution explanations

Keep charts simple, use box-drawing characters, and label each step clearly.

## Git Workflow

Write code, build features, test, and refactor **without asking permission**. But always pause for explicit user approval before:
- Staging changes (`git add`)
- Committing changes (`git commit`)
- Pushing to remote

Git checkpoints are save points that require user review and approval. Do not auto-stage or auto-commit.

## Resume System - One Source of Truth

The resume system is intentionally simple: **WORK_HISTORY.md is the single source of truth**.

### Core Concept

All resume content lives in `WORK_HISTORY.md`:
- Complete work history (9 jobs, all roles)
- Detailed accomplishments and metrics
- Technical skills and tools
- Education and continuous learning
- Role narratives (for cover letters, interviews)
- Timeline verification

### File Structure

```
WORK_HISTORY.md              Source of truth (edit this)
  ↓
Generate resumes on demand using Claude Code
  ↓
resume-dev.html              Tech resume (AI-generated from markdown)
resume-sales.html            Sales resume (AI-generated from markdown)
resume-ats.html              ATS-optimized (AI-generated from markdown)
```

### Creating a Resume

**Step 1: Edit WORK_HISTORY.md**

Update content directly in the markdown file:
- Add accomplishments to the relevant job section
- Update education and skills
- Modify role narratives as needed

**Step 2: Generate a resume**

Use Claude Code to generate a resume for a specific audience:
- Request a tech resume highlighting needthisdone.com and Acadio
- Request a sales resume emphasizing Toyota progression
- Request an ATS-optimized variant for automated screening

Claude Code reads WORK_HISTORY.md and generates clean HTML with:
- Proper typography (unique font sizes, 12px minimum)
- Professional spacing and layout
- Content tailored to the audience
- Ready to convert to PDF

**Step 3: Convert to PDF (if needed)**

```bash
npx tsx html-to-pdf.ts resume-dev.html Resume.pdf
```

### Why This Approach

- **Single source of truth**: Everything lives in one markdown file
- **Version control friendly**: Markdown is easy to track in git
- **No build complexity**: No JSON configs or template engines
- **Easy to update**: Edit markdown, regenerate resumes
- **Flexible**: AI can adapt content for any audience
- **Maintainable**: Clear structure, easy to find sections

### Example Workflow

```
1. You have a job opportunity for healthcare sales
   ↓
2. Edit WORK_HISTORY.md - add healthcare-specific accomplishments
   (or ask Claude to generate a healthcare-focused variant)
   ↓
3. Claude generates resume-healthcare.html
   emphasizing trust-building and complex transactions
   ↓
4. Convert to PDF:
   npx tsx html-to-pdf.ts resume-healthcare.html Resume.pdf
```

### Important Notes

- WORK_HISTORY.md is the only file you need to maintain
- Generated HTML files can be recreated anytime
- Don't store generated PDFs in git (regenerate as needed)
- Edit WORK_HISTORY.md directly, no intermediate files
- Use role narratives section for cover letter content
- All metrics and accomplishments go in WORK_HISTORY.md

