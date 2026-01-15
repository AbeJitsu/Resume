# Resume Repository

Personal resume, cover letters, and professional content.

## Quick Reference

| Task | Command |
|------|---------|
| Generate PDF | `npx tsx html-to-pdf.ts resume-dev.html Resume_Abe_Reyes.pdf` |
| Cover letter PDF | `npx tsx html-to-pdf.ts cover-letter-etp.html --margin 0.75in` |

## Files

| File | Purpose |
|------|---------|
| `resume-dev.html` | Main resume - edit this |
| `resume-mortgage.html` | Mortgage industry variant |
| `cover-letter-template.html` | Base cover letter template |
| `cover-letter-*.html` | Company-specific cover letters |
| `profile-data.json` | Structured profile data (source of truth) |
| `role-descriptions.md` | Job descriptions for reference |
| `html-to-pdf.ts` | PDF generator script |

## Generating PDFs

```bash
cd ~/Projects/Personal/Resume

# Resume (0.5in margins, Retina quality)
npx tsx html-to-pdf.ts resume-dev.html Resume_Abe_Reyes.pdf

# Cover letter (0.75in margins for more breathing room)
npx tsx html-to-pdf.ts cover-letter-company.html CoverLetter_Company.pdf --margin 0.75in

# Options
npx tsx html-to-pdf.ts <input.html> [output.pdf] [--margin <size>] [--dpi <1|2|3>]
```

| Option | Default | Description |
|--------|---------|-------------|
| `--margin` | 0.5in | All margins |
| `--dpi` | 2 | Device scale factor (2 = Retina quality) |

## Syncing with needthisdone.com/resume

The website has a live resume page at `needthisdone.com/resume`. When you update the HTML resume here, you should also update the website version.

**Website file location:**
```
~/Projects/Personal/Need_This_Done/app/app/resume/page.tsx
```

**The key difference:**
- `resume-dev.html` uses inline CSS (for PDF generation)
- `page.tsx` uses React + Tailwind (for the website)

**When to sync:**
- Content changes (new job, updated bullets, new skills)
- Structure changes (new sections, reordered content)

**What stays different:**
- Styling approach (inline CSS vs Tailwind classes)
- Page breaks (HTML has print-specific CSS, React version doesn't need it)

**Sync checklist:**
1. Update `resume-dev.html` first (source of truth for content)
2. Generate new PDF to verify layout
3. Open `page.tsx` and update the corresponding data arrays:
   - `skills` - Technical skills by category
   - `experience` - Job history with bullets
   - `education` - Education entries
   - Summary text in the JSX
4. Run the dev server to verify: `cd ~/Projects/Personal/Need_This_Done/app && npm run dev`
5. Visit `localhost:3000/resume` to check it looks right

## HTML Resume Structure

The HTML resume has three pages with explicit page breaks:

```
PAGE 1: Header + Summary + Skills + needthisdone.com job
PAGE 2: Acadio → Combat Medic (remaining jobs)
PAGE 3: Featured Project + Education + Influences
```

**Page break classes:**
- `.page-2-start` - Forces break before Acadio job
- `.projects-section` - Forces break before Featured Project

**Print CSS:** All print styles are in `@media print { }` block.

## Cover Letter Workflow

1. Copy `cover-letter-template.html`
2. Rename to `cover-letter-[company].html`
3. Customize the opening, body, and closing
4. Generate PDF: `npx tsx html-to-pdf.ts cover-letter-[company].html --margin 0.75in`

## Content Guidelines

- Keep language simple for non-technical readers
- Use active voice in bullet points
- Start bullets with action verbs
- Avoid jargon in summary and book descriptions
