#!/bin/bash

echo "🗑️  Resume Cleanup Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Remove company-specific resume folders
echo "Removing company-specific resume variants..."
rm -rf tech/smartly-done/
rm -rf sales/holler-classic-automotive/
rm -rf sales/general-sales/
echo "✓ Removed tech/smartly-done/"
echo "✓ Removed sales/holler-classic-automotive/"
echo "✓ Removed sales/general-sales/"
echo ""

# 2. Remove empty parent folders if they're now empty
if [ -d "tech" ] && [ -z "$(ls -A tech)" ]; then
  rmdir tech/
  echo "✓ Removed empty tech/ folder"
fi

if [ -d "sales" ] && [ -z "$(ls -A sales)" ]; then
  rmdir sales/
  echo "✓ Removed empty sales/ folder"
fi
echo ""

# 3. Remove archive folder
echo "Removing archive folder..."
rm -rf archive/
echo "✓ Removed archive/"
echo ""

# 4. Remove all cover letter files
echo "Removing cover letter files..."
find . -maxdepth 1 -name "cover-letter*" -type f -delete
echo "✓ Removed root-level cover letters"
echo ""

# 5. List remaining resume files
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Cleanup complete!"
echo ""
echo "📁 Remaining resume files:"
ls -lh *.html *.pdf 2>/dev/null | grep -E "(resume-|Resume_)" || echo "  No core resume files found"
echo ""
echo "📊 Core files kept:"
echo "  • profile-data-v2.json (source of truth)"
echo "  • build-resume.ts (resume builder)"
echo "  • html-to-pdf.ts (PDF generator)"
echo "  • scripts/ (utilities)"
echo ""
echo "To generate resumes:"
echo "  npx tsx build-resume.ts dev     # Generate dev resume"
echo "  npx tsx build-resume.ts sales   # Generate sales resume"
