const fs = require('fs');
const path = require('path');

// Simple HTML tag removal helper
function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

// Extract content between tags
function extractBetween(content, startTag, endTag) {
  const regex = new RegExp(
    `${startTag}([\\s\\S]*?)${endTag}`,
    'gi'
  );
  const matches = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push(stripHtml(match[1]));
  }
  return matches;
}

const RESUME_FILES = [
  {
    path: 'sales/holler-classic-automotive/resume-automotive-sales-pdf.html',
    context: 'automotive',
  },
  {
    path: 'sales/general-sales/resume-sales-general-pdf.html',
    context: 'general_sales',
  },
  {
    path: 'tech/smartly-done/resume-frontend-smartly-done.html',
    context: 'tech',
  },
];

const JOB_COMPANY_MAP = {
  'Toyota of Orlando': 'toyota',
  'Full Sail University': 'fullsail_work',
  'U.S. Army': 'army',
  'Quill.com': 'quill',
  'needthisdone.com': 'needthisdone',
};

function extractJobCompanyId(companyName) {
  for (const [name, id] of Object.entries(JOB_COMPANY_MAP)) {
    if (companyName.includes(name)) {
      return id;
    }
  }
  return null;
}

function extractResumeContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract professional summary
  const summaryMatch = content.match(
    /<div class="summary-text"[^>]*>([\s\S]*?)<\/div>/i
  );
  const summary = summaryMatch ? stripHtml(summaryMatch[1]) : '';

  // Extract jobs - look for job divs and extract content until next job or section
  const jobs = [];
  const jobRegex = /<div class="job"[^>]*>/g;
  let jobMatch;
  const jobPositions = [];

  while ((jobMatch = jobRegex.exec(content)) !== null) {
    jobPositions.push(jobMatch.index);
  }

  for (let i = 0; i < jobPositions.length; i++) {
    const startPos = jobPositions[i];
    const endPos = i < jobPositions.length - 1 ? jobPositions[i + 1] : content.indexOf('</section>', startPos);
    const jobContent = content.substring(startPos, endPos);

    // Extract title
    const titleMatch = jobContent.match(/<div class="job-title"[^>]*>([\s\S]*?)<\/div>/i);
    const title = titleMatch ? stripHtml(titleMatch[1]) : '';

    // Extract company
    const companyMatch = jobContent.match(/<div class="job-company"[^>]*>([\s\S]*?)<\/div>/i);
    const company = companyMatch ? stripHtml(companyMatch[1]) : '';

    // Extract bullets
    const bulletMatches = [...jobContent.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
    const bullets = bulletMatches.map(m => stripHtml(m[1]));

    const jobId = extractJobCompanyId(company);
    if (jobId && title) {
      jobs.push({ id: jobId, title, company, bullets });
    }
  }

  // Extract skills - try both styles
  const skillsObj = {};

  // Find all strong tags
  const strongRegex = /<strong[^>]*>([\s\S]*?)<\/strong>/gi;
  let strongMatch;
  const strongPositions = [];

  while ((strongMatch = strongRegex.exec(content)) !== null) {
    strongPositions.push({
      index: strongMatch.index,
      endIndex: strongMatch.index + strongMatch[0].length,
      text: stripHtml(strongMatch[1]).replace(':', '').trim(),
    });
  }

  for (let i = 0; i < strongPositions.length; i++) {
    const strong = strongPositions[i];
    if (strong.text.length === 0) continue;

    const startPos = strong.endIndex;
    const nextStrongIndex = strongPositions[i + 1]?.index || content.length;
    const nextClosing = content.indexOf('</div>', startPos);
    const endPos = Math.min(nextStrongIndex, nextClosing);

    const skillText = content.substring(startPos, endPos);
    const cleanedSkillText = stripHtml(skillText);
    const skills = cleanedSkillText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0 && s.length < 50);

    if (skills.length > 0 && !skillsObj[strong.text]) {
      skillsObj[strong.text] = skills;
    }
  }

  return { summary, jobs, skills: skillsObj };
}

function main() {
  const report = {
    professional_summary: {},
    jobs: {},
    timestamp: new Date().toISOString(),
  };

  // Process each resume file
  for (const file of RESUME_FILES) {
    const fullPath = path.join(
      '/Users/abereyes/Projects/Personal/Resume',
      file.path
    );
    console.log(`Processing ${file.context} resume: ${file.path}`);

    if (!fs.existsSync(fullPath)) {
      console.warn(`  ⚠ File not found: ${fullPath}`);
      continue;
    }

    const extracted = extractResumeContent(fullPath);

    // Store professional summary
    if (!report.professional_summary[file.context]) {
      report.professional_summary[file.context] = {};
    }
    report.professional_summary[file.context].summary = extracted.summary;

    // Store skills
    if (Object.keys(extracted.skills || {}).length > 0) {
      if (!report.professional_summary[file.context]) {
        report.professional_summary[file.context] = {};
      }
      report.professional_summary[file.context].skills = extracted.skills;
    }

    // Store jobs
    for (const job of extracted.jobs) {
      if (!report.jobs[job.id]) {
        report.jobs[job.id] = {};
      }

      report.jobs[job.id][file.context] = {
        title: job.title,
        description: job.company,
        bullets: job.bullets,
      };
    }

    console.log(`  ✓ Extracted ${extracted.jobs.length} jobs`);
    console.log(`  ✓ Extracted ${Object.keys(extracted.skills || {}).length} skill categories`);
  }

  // Write report
  const reportPath = '/Users/abereyes/Projects/Personal/Resume/scripts/variations-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n✓ Report written to ${reportPath}`);

  // Print summary
  console.log('\n=== EXTRACTION SUMMARY ===');
  console.log(`Jobs found: ${Object.keys(report.jobs).length}`);
  for (const [jobId, variants] of Object.entries(report.jobs)) {
    const contexts = Object.keys(variants).join(', ');
    console.log(`  - ${jobId}: [${contexts}]`);
  }
}

main();
