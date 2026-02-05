#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function extractTextFromHtml(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf-8');

  // Remove script and style tags
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

function findDuplicateTerms(text) {
  // Extract meaningful phrases (2-5 word chunks and key metrics)
  const terms = new Map();

  // Find all phrases of 2-5 words
  const wordRegex = /\b[\w+%]+(?:\s+[\w+%]+){1,4}\b/gi;
  let match;

  while ((match = wordRegex.exec(text)) !== null) {
    const term = match[0].toLowerCase().trim();

    // Skip very common words and short terms
    if (term.length < 8 || term.split(/\s+/).length === 1) continue;

    // Skip generic phrases
    if (/^(the|and|or|a |an |is |are |was |were )/.test(term)) continue;

    const position = match.index;
    if (!terms.has(term)) {
      terms.set(term, []);
    }
    terms.get(term).push({
      position,
      context: text.substring(Math.max(0, position - 30), Math.min(text.length, position + term.length + 30))
    });
  }

  // Find metrics/numbers that repeat
  const metricRegex = /(\d+\+?\s+(?:react|components|api|routes|pages|commits|tests|e2e|playwright|python|scripts|pipelines))/gi;
  while ((match = metricRegex.exec(text)) !== null) {
    const term = match[0].toLowerCase();
    const position = match.index;

    if (!terms.has(term)) {
      terms.set(term, []);
    }
    terms.get(term).push({
      position,
      context: text.substring(Math.max(0, position - 30), Math.min(text.length, position + term.length + 30))
    });
  }

  // Filter to only terms that appear 2+ times
  const duplicates = [];
  for (const [term, occurrences] of terms) {
    if (occurrences.length > 1) {
      duplicates.push({
        term,
        count: occurrences.length,
        occurrences
      });
    }
  }

  // Sort by frequency
  duplicates.sort((a, b) => b.count - a.count);

  return duplicates;
}

function main() {
  const resumePath = path.join(__dirname, 'resume-dev.html');

  if (!fs.existsSync(resumePath)) {
    console.error(`Error: ${resumePath} not found`);
    process.exit(1);
  }

  console.log('Analyzing for duplication...\n');

  const text = extractTextFromHtml(resumePath);
  const duplicates = findDuplicateTerms(text);

  if (duplicates.length === 0) {
    console.log('✓ No significant duplication detected');
    return;
  }

  console.log(`Found ${duplicates.length} repeated terms/phrases:\n`);

  duplicates.forEach((item, index) => {
    console.log(`${index + 1}. "${item.term}" (${item.count} times)`);
    item.occurrences.forEach((occ, i) => {
      const context = occ.context.replace(/\s+/g, ' ').trim();
      console.log(`   ${i + 1}. ...${context}...`);
    });
    console.log();
  });

  console.log('\n📝 ACTION ITEMS:');
  console.log('- Check if each repeated term appears in different sections');
  console.log('- Consolidate metrics to appear in ONE place (metrics box)');
  console.log('- Tech stack should be listed once in Skills section');
  console.log('- Features/accomplishments should not repeat metrics');
}

main();
