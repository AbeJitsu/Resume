const fs = require('fs');

// Helper to extract text from HTML
function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

// Extract job entries from HTML
function extractJobsFromHtml(html) {
  const jobs = [];
  // Look for job divs or sections with job content
  const jobMatches = html.match(/<div class="job[^>]*>[\s\S]*?<\/div>/gi) || [];

  for (const jobMatch of jobMatches) {
    const titleMatch = jobMatch.match(/<div class="job-title"[^>]*>([\s\S]*?)<\/div>/i);
    const companyMatch = jobMatch.match(/<div class="job-company"[^>]*>([\s\S]*?)<\/div>/i);
    const bulletMatches = [...jobMatch.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];

    if (titleMatch) {
      const title = stripHtml(titleMatch[1]);
      const company = companyMatch ? stripHtml(companyMatch[1]) : '';
      const bullets = bulletMatches.map(m => stripHtml(m[1]));

      jobs.push({ title, company, bullets });
    }
  }

  // Alternative: handle section-based layout (tech resume)
  if (jobs.length === 0) {
    const sectionMatches = html.match(/<h2[^>]*>[\s\S]*?(?=<h2|$)/gi) || [];
    for (const section of sectionMatches) {
      const titleMatch = section.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
      const companyMatch = section.match(/<div class="job-company"[^>]*>([\s\S]*?)<\/div>/i);
      const bulletMatches = [...section.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];

      if (titleMatch && companyMatch) {
        const title = stripHtml(titleMatch[1]);
        const company = stripHtml(companyMatch[1]);
        const bullets = bulletMatches.map(m => stripHtml(m[1]));

        if (bullets.length > 0 && title !== 'Technical Skills' && title !== 'Education') {
          jobs.push({ title, company, bullets });
        }
      }
    }
  }

  return jobs;
}

// Compare two job entries
function compareJobs(job1, job2) {
  const titleMatch = job1.title === job2.title;
  const bulletCountMatch = job1.bullets.length === job2.bullets.length;

  let bulletContentMatch = true;
  if (bulletCountMatch) {
    for (let i = 0; i < job1.bullets.length; i++) {
      if (job1.bullets[i] !== job2.bullets[i]) {
        bulletContentMatch = false;
        break;
      }
    }
  }

  return {
    titleMatch,
    bulletCountMatch,
    bulletContentMatch,
    allMatch: titleMatch && bulletCountMatch && bulletContentMatch,
  };
}

// Main validation
console.log('📋 Validating resume content across variants...\n');

const variants = [
  {
    name: 'dev',
    generated: 'resume-dev.html',
    existing: 'tech/resume-dev.html',
    context: 'tech',
  },
  {
    name: 'sales',
    generated: 'resume-sales.html',
    existing: 'sales/general-sales/resume-sales-general-pdf.html',
    context: 'general_sales',
  },
];

let allPassed = true;

for (const variant of variants) {
  console.log(`Validating ${variant.name} (${variant.context} context):`);

  if (!fs.existsSync(variant.generated)) {
    console.log(`  ✗ Generated file not found: ${variant.generated}\n`);
    allPassed = false;
    continue;
  }

  if (!fs.existsSync(variant.existing)) {
    console.log(`  ⚠ Existing file not found for comparison: ${variant.existing}`);
    console.log(`  ✓ Generated file exists: ${variant.generated}\n`);
    continue;
  }

  const generatedHtml = fs.readFileSync(variant.generated, 'utf-8');
  const existingHtml = fs.readFileSync(variant.existing, 'utf-8');

  const generatedJobs = extractJobsFromHtml(generatedHtml);
  const existingJobs = extractJobsFromHtml(existingHtml);

  console.log(`  Generated jobs: ${generatedJobs.length}, Existing jobs: ${existingJobs.length}`);

  if (generatedJobs.length !== existingJobs.length) {
    console.log(`  ⚠ Job count mismatch (expected ${existingJobs.length}, got ${generatedJobs.length})`);
  }

  let variantPassed = true;
  for (let i = 0; i < Math.max(generatedJobs.length, existingJobs.length); i++) {
    const genJob = generatedJobs[i];
    const exJob = existingJobs[i];

    if (!genJob) {
      console.log(`  ✗ Missing generated job #${i + 1}`);
      variantPassed = false;
      continue;
    }

    if (!exJob) {
      console.log(`  ✓ Generated job #${i + 1}: "${genJob.title}" (new)`);
      continue;
    }

    const comparison = compareJobs(genJob, exJob);

    if (comparison.allMatch) {
      console.log(`  ✓ Job #${i + 1}: "${genJob.title}" matches`);
    } else {
      console.log(`  ✗ Job #${i + 1}: "${genJob.title}"`);
      if (!comparison.titleMatch) {
        console.log(`      Title mismatch: "${genJob.title}" vs "${exJob.title}"`);
      }
      if (!comparison.bulletCountMatch) {
        console.log(`      Bullet count: ${genJob.bullets.length} vs ${exJob.bullets.length}`);
      }
      if (!comparison.bulletContentMatch && comparison.bulletCountMatch) {
        console.log(`      Bullet content differs (first mismatch shown):`);
        for (let j = 0; j < genJob.bullets.length; j++) {
          if (genJob.bullets[j] !== exJob.bullets[j]) {
            console.log(`        Gen: "${genJob.bullets[j].substring(0, 70)}..."`);
            console.log(`        Exp: "${exJob.bullets[j].substring(0, 70)}..."`);
            break;
          }
        }
      }
      variantPassed = false;
    }
  }

  if (variantPassed) {
    console.log(`  ✅ ${variant.name} variant validation passed\n`);
  } else {
    console.log(`  ❌ ${variant.name} variant has differences\n`);
    allPassed = false;
  }
}

console.log('═══════════════════════════════════════════');
if (allPassed) {
  console.log('✅ All validations passed!');
  process.exit(0);
} else {
  console.log('⚠ Some validations failed or had warnings');
  process.exit(1);
}
