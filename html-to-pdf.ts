#!/usr/bin/env npx tsx
// ============================================================================
// HTML to PDF Converter - High Quality with Clickable Links
// ============================================================================
// Uses Playwright to generate a high-quality PDF from HTML with working hyperlinks.
//
// Usage:
//   npx tsx html-to-pdf.ts input.html
//   npx tsx html-to-pdf.ts input.html output.pdf
//   npx tsx html-to-pdf.ts input.html --margin 0.25in
//
// Options:
//   --margin <size>    Set all margins (default: 0.5in)

import { chromium } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';

interface Options {
  margin: string;
}

function parseArgs(args: string[]): { input: string; output?: string; options: Options } {
  const options: Options = {
    margin: '0.5in',
  };

  let input = '';
  let output: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--margin' && args[i + 1]) {
      options.margin = args[++i];
    } else if (!input) {
      input = arg;
    } else if (!output) {
      output = arg;
    }
  }

  return { input, output, options };
}

async function htmlToPdf(inputPath: string, outputPath?: string, options: Options = { margin: '0.5in' }) {
  const absoluteInput = path.resolve(inputPath);

  if (!fs.existsSync(absoluteInput)) {
    console.error(`File not found: ${absoluteInput}`);
    process.exit(1);
  }

  // Default output name based on input
  const defaultOutput = absoluteInput.replace(/\.html$/, '.pdf');
  const absoluteOutput = outputPath ? path.resolve(outputPath) : defaultOutput;

  console.log(`Converting: ${absoluteInput}`);
  console.log(`Output: ${absoluteOutput}`);
  console.log(`Margins: ${options.margin}`);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Load the HTML file and wait for everything to be ready
  await page.goto(`file://${absoluteInput}`, { waitUntil: 'networkidle' });

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);

  // Set print media for proper styling
  await page.emulateMedia({ media: 'print' });

  // Generate PDF - text is vector-based and always crisp
  await page.pdf({
    path: absoluteOutput,
    format: 'Letter',
    printBackground: true,
    margin: {
      top: options.margin,
      right: options.margin,
      bottom: options.margin,
      left: options.margin,
    },
  });

  await browser.close();

  // Get file size for confirmation
  const stats = fs.statSync(absoluteOutput);
  const fileSizeKB = (stats.size / 1024).toFixed(1);

  console.log(`\n✓ PDF generated successfully!`);
  console.log(`  Size: ${fileSizeKB} KB`);
  console.log(`  Location: ${absoluteOutput}`);
  console.log(`  Links are clickable.`);
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('HTML to PDF Converter - High Quality with Clickable Links\n');
  console.log('Usage: npx tsx html-to-pdf.ts <input.html> [output.pdf] [options]\n');
  console.log('Options:');
  console.log('  --margin <size>   Set all margins (default: 0.5in)\n');
  console.log('Examples:');
  console.log('  npx tsx html-to-pdf.ts resume.html');
  console.log('  npx tsx html-to-pdf.ts resume.html Resume_Output.pdf');
  console.log('  npx tsx html-to-pdf.ts resume.html --margin 0.25in');
  process.exit(0);
}

const { input, output, options } = parseArgs(args);
htmlToPdf(input, output, options);
