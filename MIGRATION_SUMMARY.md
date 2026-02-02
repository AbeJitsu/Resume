# Resume Content Consolidation - Phase 1 & 2 Complete

## Summary

Successfully extracted resume content variations and consolidated them into `profile-data-v2.json` using a context-based variant system.

## What Was Done

### Phase 1: Content Extraction ✓
Created extraction scripts to parse existing resume HTML files and identify content variations:

**Scripts Created:**
- `scripts/extract-resume-variations.js` - Parses HTML resumes and extracts job titles, bullets, and skills
- `scripts/variations-report.json` - Report of all extracted content variations by context

**Variations Found:**
- **toyota job**: 3 variants (automotive, general_sales, tech)
- **fullsail_work job**: 2 variants (automotive, general_sales)
- **army job**: 2 variants (automotive, general_sales)
- **quill job**: 2 variants (automotive, general_sales) - Added from profile-data.json

### Phase 2: Profile Data Migration ✓
Transformed `profile-data.json` into new variant-based schema:

**New Files:**
- `profile-data-v2.json` - Migrated profile data with context-aware variants
- `scripts/migrate-profile-data.js` - Migration script that performed the transformation

**Schema Changes:**
```
OLD STRUCTURE:
work_experience: [
  { id, company, title, dates, descriptions: { resume_bullets } }
]

NEW STRUCTURE:
work_experience: [
  {
    id,
    base: { company, location, dates, ... },
    variants: {
      automotive: { title, bullets[] },
      general_sales: { title, bullets[] },
      tech: { title, bullets[] }
    }
  }
]

resume_variants: [
  { title, output_file, context: "tech" | "general_sales" }
]
```

**Benefits:**
- Single source of truth for all resume content
- No duplicate HTML files with slight variations
- Easy to add new job contexts without code changes
- Clear semantic meaning (automotive, general_sales, tech)

## Phase 3: Resume Builder Updates (In Progress)

The `build-resume.ts` script needs updates to use the context-aware variant system:

**Changes Needed:**
1. Update ProfileData interface to support new schema
2. Add context field to ResumeVariant
3. Modify buildResumeData to select content with fallback chain:
   - Explicit override (highest priority)
   - Context-specific variant
   - Base content
   - Defaults

**Usage:**
```bash
# Build with context-aware variants
npx tsx build-resume.ts dev    # Uses context "tech"
npx tsx build-resume.ts sales  # Uses context "general_sales"
```

## Next Steps

1. **Complete Phase 3**: Update build-resume.ts to use profile-data-v2.json
2. **Phase 4**: Validate generated resumes match existing HTML versions
3. **Phase 5**: Switch to using profile-data-v2.json as primary source
4. **Cleanup**: Archive old HTML variants once validation complete

## Files Overview

### New Files Created:
- `profile-data-v2.json` - Migrated profile data (47 KB)
- `scripts/extract-resume-variations.js` - Content extraction utility
- `scripts/extract-resume-variations.ts` - TypeScript source (reference only)
- `scripts/migrate-profile-data.js` - Migration utility
- `scripts/variations-report.json` - Extraction report

### Modified Files:
- `build-resume.ts` - (Pending updates for Phase 3)

## Context Definitions

- **automotive**: Used in automotive sales-focused resumes (aftermarket products, F&I focus)
- **general_sales**: Used in general sales resumes (consultative selling, transferable skills)
- **tech**: Used in technical/developer resumes (programming focus, condensed experience)

## Backward Compatibility

The new system maintains backward compatibility through the existing override mechanism in resume_variants. Explicit overrides still take precedence over variants.
