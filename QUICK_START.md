# Resume Quick Start Guide

## Overview

Your resumes are now generated on demand from a single source of truth (`profile-data-v2.json`). No more maintaining multiple static files.

## Generate Resumes

```bash
# Generate tech resume
npx tsx build-resume.ts dev

# Generate sales resume
npx tsx build-resume.ts sales

# Generate all resumes
npx tsx build-resume.ts
```

This creates `resume-dev.html` and `resume-sales.html` in the root directory.

## Convert to PDF

```bash
# Convert specific resume
npx tsx html-to-pdf.ts resume-dev.html Resume_Abe_Reyes.pdf

# Or with custom name
npx tsx html-to-pdf.ts resume-sales.html Resume_Sales.pdf
```

## Update Content

Edit `profile-data-v2.json` to update resume content:

### Change job content for specific context

```json
{
  "work_experience": [
    {
      "id": "toyota",
      "variants": {
        "tech": {
          "title": "Finance & Insurance Manager",
          "bullets": [
            "Update these bullets...",
            "Add more as needed..."
          ]
        }
      }
    }
  ]
}
```

### Add new context variant

1. Add variant to job:
```json
{
  "id": "toyota",
  "variants": {
    "new_context": {
      "title": "Job Title for New Context",
      "bullets": ["..."]
    }
  }
}
```

2. Create resume variant that uses it:
```json
{
  "resume_variants": {
    "new_resume": {
      "title": "Resume Title",
      "context": "new_context",
      "output_file": "resume-new.html"
    }
  }
}
```

3. Generate:
```bash
npx tsx build-resume.ts new_resume
```

## Cover Letters

Generate fresh for each application. Don't store them - they're customized per job anyway.

## File Structure

```
Resume/
├── profile-data-v2.json      # Source of truth (edit this)
├── build-resume.ts            # Resume generator
├── html-to-pdf.ts             # PDF converter
├── resume-template.html       # Base template
├── resume-dev.html            # Generated tech resume
├── resume-sales.html          # Generated sales resume
└── scripts/
    ├── extract-resume-variations.js
    ├── migrate-profile-data.js
    ├── test-variant-selection.js
    └── validate-resumes.js
```

## Contexts

Available contexts in `profile-data-v2.json`:

- **tech**: Developer/technical roles
- **general_sales**: General sales positions
- **automotive**: Automotive industry sales

Each job can have different content for each context.

## Common Tasks

### Need a resume for job application?

1. Choose variant (dev or sales)
2. Generate: `npx tsx build-resume.ts dev`
3. Convert: `npx tsx html-to-pdf.ts resume-dev.html YourName_Resume.pdf`
4. Apply with PDF

### Updating your tech experience?

1. Edit `profile-data-v2.json`
2. Find job → variants → tech
3. Update title/bullets
4. Regenerate: `npx tsx build-resume.ts dev`

### Adding new job?

Add to `profile-data-v2.json` → `work_experience` array:

```json
{
  "id": "company_name",
  "base": {
    "company": "Company Name",
    "location": "City, ST",
    "dates": { "display": "Month Year - Present" }
  },
  "variants": {
    "tech": {
      "title": "Your Title",
      "bullets": ["Achievement 1", "Achievement 2"]
    }
  }
}
```

Then add to resume variant's experience list.

## Benefits of This Setup

✅ **Single source of truth** - Update once, affects all resumes
✅ **Context-aware** - Same job, different focus per audience
✅ **On-demand generation** - No outdated static files
✅ **Clean repository** - Minimal files, everything regenerable
✅ **Easy maintenance** - One JSON file to edit

## Need Help?

- See `IMPLEMENTATION_COMPLETE.md` for full documentation
- See `MIGRATION_SUMMARY.md` for migration details
- Check `scripts/` for utility functions
