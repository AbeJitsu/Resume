const fs = require('fs');
const path = require('path');

// Load existing data
const profileDataPath = '/Users/abereyes/Projects/Personal/Resume/profile-data.json';
const variationsPath = '/Users/abereyes/Projects/Personal/Resume/scripts/variations-report.json';

const profileData = JSON.parse(fs.readFileSync(profileDataPath, 'utf-8'));
const variations = JSON.parse(fs.readFileSync(variationsPath, 'utf-8'));

// Manually add tech resume variants that couldn't be extracted by script
variations.jobs.toyota.tech = {
  title: "Finance & Insurance Manager",
  description: "Toyota of Orlando | Orlando, FL",
  bullets: [
    "Developed strong client communication skills working directly with customers to explain complex products and processes",
    "Collaborated across departments to resolve customer concerns and deliver exceptional service",
    "Managed multiple priorities in fast-paced environment while maintaining attention to detail"
  ]
};

// Add the Quill job (it's in profile-data but not in resumes)
// Default to general_sales and automotive context with same content
variations.jobs.quill = {
  automotive: {
    title: "B2B Sales Representative",
    description: "Quill.com | Orlando, FL",
    bullets: [
      "Outbound sales in a high-volume call center, contacting buyers to open Quill.com business accounts",
      "Built relationships with business owners and office managers to establish ongoing purchasing accounts"
    ]
  },
  general_sales: {
    title: "B2B Sales Representative",
    description: "Quill.com | Orlando, FL",
    bullets: [
      "Outbound sales in a high-volume call center, contacting buyers to open Quill.com business accounts",
      "Built relationships with business owners and office managers to establish ongoing purchasing accounts"
    ]
  }
};

console.log('🔄 Starting migration...\n');

// Map old resume_variants context names to new contexts
const contextMap = {
  'dev': 'tech',
  'sales': 'general_sales'  // Generic sales defaults to general_sales
};

// Transform work_experience to use new schema
const migratedWorkExperience = profileData.work_experience.map(job => {
  const jobId = job.id;
  const hasVariants = variations.jobs[jobId];

  if (!hasVariants) {
    console.log(`✓ ${jobId}: no variants found, keeping base structure`);
    return job;
  }

  // Build new job structure with variants
  const migratedJob = {
    id: job.id,
    base: {
      company: job.company,
      company_description: job.company_description,
      employment_type: job.employment_type,
      location: job.location,
      location_type: job.location_type,
      dates: job.dates,
      current: job.current,
      title_progression: job.title_progression,
    },
    variants: {},
  };

  // Add descriptions if they exist in original
  if (job.descriptions || job.title_alt) {
    migratedJob.descriptions = job.descriptions;
    migratedJob.title_alt = job.title_alt;
  }

  // Add key_accomplishments if exists
  if (job.key_accomplishments) {
    migratedJob.key_accomplishments = job.key_accomplishments;
  }

  // Add technologies if exists
  if (job.technologies) {
    migratedJob.technologies = job.technologies;
  }

  // Add client_engagements if exists (for needthisdone)
  if (job.client_engagements) {
    migratedJob.client_engagements = job.client_engagements;
  }

  // Populate variants from extracted variations
  for (const [context, variant] of Object.entries(hasVariants)) {
    if (variant.title) {
      migratedJob.variants[context] = {
        title: variant.title,
        bullets: variant.bullets
      };

      console.log(`✓ ${jobId}: added ${context} variant (title: "${variant.title}")`);
    }
  }

  return migratedJob;
});

// Update resume_variants with context field
const migratedResumeVariants = {};
for (const [key, config] of Object.entries(profileData.resume_variants)) {
  migratedResumeVariants[key] = {
    ...config,
    context: contextMap[key] || key,
  };
  console.log(`✓ resume_variant "${key}" -> context: "${contextMap[key] || key}"`);
}

// Create new profile data structure
const migratedProfileData = {
  ...profileData,
  work_experience: migratedWorkExperience,
  resume_variants: migratedResumeVariants,
};

// Write migrated profile data
const outputPath = '/Users/abereyes/Projects/Personal/Resume/profile-data-v2.json';
fs.writeFileSync(outputPath, JSON.stringify(migratedProfileData, null, 2));

console.log(`\n✅ Migration complete!`);
console.log(`✓ Written to: ${outputPath}`);
console.log(`\n📊 Summary:`);
console.log(`   Work experiences: ${migratedWorkExperience.length}`);
console.log(`   Resume variants: ${Object.keys(migratedResumeVariants).length}`);

// Create a quick validation report
console.log(`\n📋 Variants created:`);
for (const job of migratedWorkExperience) {
  if (Object.keys(job.variants || {}).length > 0) {
    const contexts = Object.keys(job.variants).join(', ');
    console.log(`   ${job.id}: [${contexts}]`);
  }
}
