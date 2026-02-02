import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

interface JobVariation {
  title?: string;
  description?: string;
  bullets?: string[];
  skills?: Record<string, string[]>;
  summary?: string;
}

interface ContextVariants {
  automotive?: JobVariation;
  general_sales?: JobVariation;
  tech?: JobVariation;
}

interface ExtractionReport {
  professional_summary: ContextVariants;
  jobs: Record<string, ContextVariants>;
  timestamp: string;
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

const JOB_COMPANY_MAP: Record<string, string> = {
  'Toyota of Orlando': 'toyota',
  'Full Sail University': 'fullsail_work',
  'U.S. Army': 'army',
  'Quill.com': 'quill',
  'needthisdone.com': 'needthisdone',
};

function extractJobCompanyId(companyName: string): string | null {
  for (const [name, id] of Object.entries(JOB_COMPANY_MAP)) {
    if (companyName.includes(name)) {
      return id;
    }
  }
  return null;
}

function extractResumeContent(filePath: string): {
  summary: string;
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    bullets: string[];
  }>;
  skills?: Record<string, string[]>;
} {
  const content = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(content);

  // Extract professional summary
  const summaryText = $('.summary-text').first().text().trim();

  // Extract jobs
  const jobs: Array<{
    id: string;
    title: string;
    company: string;
    bullets: string[];
  }> = [];

  $('.job').each((idx, elem) => {
    const $job = $(elem);
    const title = $job.find('.job-title').text().trim();
    const company = $job.find('.job-company').text().trim();
    const bullets: string[] = [];

    $job.find('.job-bullets li').each((_, li) => {
      bullets.push($(li).text().trim());
    });

    const jobId = extractJobCompanyId(company);
    if (jobId) {
      jobs.push({ id: jobId, title, company, bullets });
    }
  });

  // Extract skills
  const skills: Record<string, string[]> = {};
  $('.skills-text strong').each((idx, elem) => {
    const label = $(elem).text().replace(':', '').trim();
    const skillText = $(elem).nextUntil('strong').text().trim();
    const skillArray = skillText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (skillArray.length > 0) {
      skills[label] = skillArray;
    }
  });

  // Alternative skills extraction for grid-based layouts
  $('.skill-category').each((idx, elem) => {
    const $category = $(elem);
    const boldText = $category.find('strong').text();
    const label = boldText.replace(':', '').trim();
    const allText = $category.text();
    const skillText = allText.replace(boldText, '').trim();
    const skillArray = skillText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (skillArray.length > 0) {
      skills[label] = skillArray;
    }
  });

  return { summary: summaryText, jobs, skills };
}

function main() {
  const report: ExtractionReport = {
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
    report.professional_summary[file.context]!.summary = extracted.summary;

    // Store skills
    if (Object.keys(extracted.skills || {}).length > 0) {
      if (!report.professional_summary[file.context]) {
        report.professional_summary[file.context] = {};
      }
      report.professional_summary[file.context]!.skills = extracted.skills;
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
