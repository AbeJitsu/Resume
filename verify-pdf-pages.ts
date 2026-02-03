import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: npx tsx verify-pdf-pages.ts <pdf-file>');
  console.error('Example: npx tsx verify-pdf-pages.ts Cover_Letter_Abe_Reyes_React_Frontend.pdf');
  process.exit(1);
}

const pdfFile = args[0];

if (!fs.existsSync(pdfFile)) {
  console.error(`❌ File not found: ${pdfFile}`);
  process.exit(1);
}

try {
  // Try using pdfinfo (from Poppler)
  const output = execSync(`pdfinfo "${pdfFile}"`, { encoding: 'utf-8' });
  const pages = output.match(/Pages:\s+(\d+)/);

  if (pages) {
    const pageCount = parseInt(pages[1], 10);
    const status = pageCount === 1 ? '✓' : '❌';
    const message = pageCount === 1 ? 'PASS - One page' : `FAIL - ${pageCount} pages`;

    console.log(`${status} ${pdfFile}: ${message}`);
    process.exit(pageCount === 1 ? 0 : 1);
  }
} catch (error) {
  console.error('pdfinfo not found. Install Poppler: brew install poppler');
  process.exit(1);
}
