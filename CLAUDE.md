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

## Resume System - Creating Variants

This resume system uses **context-based variants** to maintain one source of truth while generating resumes for different audiences.

### Core Concept

All resume content lives in `profile-data-v2.json`. Jobs can have different content for different contexts:
- **tech**: Developer/technical positions
- **general_sales**: Sales roles (consultative, relationship-focused)
- **automotive**: Automotive industry sales (F&I, aftermarket products)

### File Structure

```
profile-data-v2.json         Source of truth (edit this)
  ↓
build-resume.ts              Context-aware generator
  ↓
resume-dev.html              Generated tech resume (uses "tech" context)
resume-sales.html            Generated sales resume (uses "general_sales" context)
```

### Creating a New Resume Variant

When user needs a resume for a different audience:

**Step 1: Add context variant to existing jobs**

Find the job in `profile-data-v2.json` → `work_experience` array:

```json
{
  "id": "toyota",
  "base": { ... },
  "variants": {
    "tech": { "title": "...", "bullets": [...] },
    "general_sales": { "title": "...", "bullets": [...] },
    "new_context": {
      "title": "Job Title for New Audience",
      "bullets": [
        "Bullet point emphasizing relevant skills",
        "Another bullet focused on this context"
      ]
    }
  }
}
```

**Step 2: Create resume variant configuration**

Add to `profile-data-v2.json` → `resume_variants`:

```json
{
  "resume_variants": {
    "new_variant": {
      "title": "Resume Title",
      "context": "new_context",
      "output_file": "resume-new.html",
      "summary_paragraphs": ["Professional summary..."],
      "skills_display": [...],
      "experience": [
        { "id": "needthisdone" },
        { "id": "toyota" },
        { "id": "fullsail_work" }
      ],
      "featured_projects": [],
      "education": [...],
      "influences": [...]
    }
  }
}
```

**Step 3: Generate the resume**

```bash
npx tsx build-resume.ts new_variant
```

This creates `resume-new.html` using the "new_context" content for each job.

### Content Selection Priority

The build system uses this fallback chain:

```
1. Explicit override in experience config
   ↓
2. Context-specific variant
   ↓
3. Base content (if no variant exists)
   ↓
4. Defaults
```

This allows gradual migration and temporary overrides.

### When to Create New Context vs New Variant

**New Context** (add to job variants):
- Different industry focus (healthcare, finance, logistics)
- Different role type (management vs IC, technical vs non-technical)
- Different emphasis on same experience (leadership vs execution)

**New Variant** (new resume config):
- Different job application using existing context
- Same content, different ordering/selection of jobs
- Different summary or skills presentation

### Example: Adding Healthcare Context

User wants resume for healthcare sales:

```json
// In work_experience → toyota job
"variants": {
  "healthcare": {
    "title": "Client Success Manager",
    "bullets": [
      "Managed complex transactions in high-stakes environment",
      "Built trust with clients making significant financial decisions",
      "Maintained detailed records and compliance with regulations"
    ]
  }
}

// In resume_variants
"healthcare_sales": {
  "title": "Healthcare Sales Professional",
  "context": "healthcare",
  "output_file": "resume-healthcare-sales.html",
  ...
}
```

### Workflow

```
User requests resume for X audience
  ↓
Identify context (existing or new)
  ↓
If new context:
  • Add variants to relevant jobs
  • Create resume variant config
  ↓
Generate:
  npx tsx build-resume.ts variant_name
  ↓
Convert to PDF:
  npx tsx html-to-pdf.ts resume-X.html Resume.pdf
```

### Important Notes

- Each job can have unlimited context variants
- Not all jobs need variants for every context
- Missing variant = falls back to base content
- Update `profile-data-v2.json` directly (no separate HTML editing)
- All generated HTML files can be recreated anytime
- Don't store generated PDFs in git (regenerate as needed)

### Reference Documents

- `QUICK_START.md` - Day-to-day usage guide
- `IMPLEMENTATION_COMPLETE.md` - Full technical details
- `MIGRATION_SUMMARY.md` - How the system was built

