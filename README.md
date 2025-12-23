# Resume Repository

Personal resume, cover letters, and professional content managed from a single source of truth.

## Structure

```
content/
├── profile-data.json      # SOURCE OF TRUTH - all profile data lives here
├── linkedin-post.md       # LinkedIn content
├── resumes/               # Resume outputs (generated from profile-data.json)
│   ├── resume-draft.md
│   ├── resume-one-page.md
│   └── *.pdf
└── cover-letters/         # Job-specific cover letters
    ├── cover-letter-template.md
    └── [company-name].md

docs/                      # Project documentation
tools/                     # Scripts and utilities
```

## Workflow

1. **Update `content/profile-data.json`** - This is the single source of truth
2. **Generate outputs** - Resumes and other formats are generated from the JSON
3. **Cover letters** - Created per-job using template + profile data

## Profile Data Structure

The JSON contains:
- `personal` - Name, contact, location
- `bios` - Various lengths for different uses (headline, short, LinkedIn about)
- `work_experience` - Jobs with resume bullets and LinkedIn descriptions
- `education` - Schools, courses, certifications
- `skills` - Categorized technical skills
- `projects` - Portfolio projects
- `cover_letter_elements` - Reusable accomplishments and role-specific intros
- `metadata` - Tone guidelines, career narrative, last updated date

## Content Guidelines

Style: inviting, focused, considerate, supportive, influential
Language: relatable, accessible to most adults
Avoid: jargon without context, generic statements, over-explanation
