/**
 * Resume Builder Script
 *
 * Generates HTML resumes from profile-data.json using resume-template.html
 *
 * Usage:
 *   npx tsx build-resume.ts           # Build all variants
 *   npx tsx build-resume.ts dev       # Build only dev variant
 *   npx tsx build-resume.ts sales     # Build only sales variant
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Types
interface WorkExperienceVariant {
  title: string;
  bullets: string[];
}

interface WorkExperience {
  id: string;
  company: string;
  company_description: string;
  title?: string;
  dates: { display: string };
  descriptions?: { resume_bullets: string[] };
  variants?: Record<string, WorkExperienceVariant>;
  base?: {
    company: string;
    company_description: string;
    employment_type: string;
    location: string;
    location_type: string;
    dates: { display: string };
    current: boolean;
  };
}

interface ProfileData {
  personal: {
    name: { full: string; display: string; first: string; last: string };
    title: string;
    location: { city: string; state: string; zip: string; display: string };
    contact: { email: string; phone: string; website: string; github: string; linkedin: string };
  };
  skills: Record<string, { label: string; items: string[] }>;
  work_experience: WorkExperience[];
  projects: Array<{
    id: string;
    name: string;
    role: string;
    url?: string;
    technologies: string[];
  }>;
  resume_variants: Record<string, ResumeVariant>;
}

interface SkillDisplay {
  key?: string;
  label?: string;
  items?: string[];
  items_override?: string[];
}

interface ExperienceConfig {
  id: string;
  title_override?: string;
  company_override?: string;
  description_override?: string;
  bullets_override?: string[];
  page_break?: boolean;
}

interface ProjectConfig {
  id: string;
  role_override?: string;
  bullets: string[];
  technologies_override?: string[];
}

interface EducationEntry {
  school: string;
  dates: string;
  description: string;
}

interface InfluenceEntry {
  title: string;
  author: string;
  impact: string;
}

interface ResumeVariant {
  title: string;
  output_file: string;
  context?: string;
  summary_paragraphs: string[];
  skills_display: SkillDisplay[];
  experience: ExperienceConfig[];
  featured_projects: ProjectConfig[];
  education: EducationEntry[];
  influences: InfluenceEntry[];
}

// Load data
const profilePath = join(process.cwd(), 'profile-data.json');
const templatePath = join(process.cwd(), 'resume-template.html');

const profile: ProfileData = JSON.parse(readFileSync(profilePath, 'utf-8'));
const template = readFileSync(templatePath, 'utf-8');

/**
 * Build resume data for a specific variant
 */
function buildResumeData(variantKey: string): Record<string, unknown> {
  const variant = profile.resume_variants[variantKey];
  if (!variant) {
    throw new Error(`Unknown variant: ${variantKey}`);
  }

  // Determine context (for variant-based content selection)
  const context = variant.context || variantKey;

  // Build skills display
  const skills_display = variant.skills_display.map((skill) => {
    let label: string;
    let items: string[];

    if (skill.key) {
      // Reference to profile.skills
      const baseSkill = profile.skills[skill.key];
      if (!baseSkill) {
        // Fallback: use provided label and items if key doesn't exist
        label = skill.label || skill.key;
        items = skill.items || [];
      } else {
        label = baseSkill.label;
        items = skill.items_override || baseSkill.items;
      }
    } else {
      // Inline skill definition
      label = skill.label!;
      items = skill.items!;
    }

    return {
      label,
      items,
      items_joined: items.join(', '),
    };
  });

  // Build experience entries
  const allExperience = variant.experience.map((expConfig) => {
    const baseExp = profile.work_experience.find((e) => e.id === expConfig.id);
    if (!baseExp) {
      throw new Error(`Unknown experience id: ${expConfig.id}`);
    }

    // Get content with context-aware variant selection
    let title = expConfig.title_override;
    let bullets = expConfig.bullets_override;

    if (!title || !bullets) {
      // Try to use context-aware variant if available (new schema)
      const contextVariant = baseExp.variants?.[context];

      if (!title) {
        title = contextVariant?.title || expConfig.title_override || baseExp.title;
      }

      if (!bullets) {
        if (contextVariant?.bullets) {
          bullets = contextVariant.bullets;
        } else if (baseExp.descriptions?.resume_bullets) {
          bullets = baseExp.descriptions.resume_bullets;
        } else {
          bullets = [];
        }
      }
    }

    const bullets_html = bullets.map((b) => `                        <li>${b}</li>`).join('\n');

    return {
      title,
      company: expConfig.company_override || baseExp.company,
      description: expConfig.description_override || baseExp.company_description,
      dates: baseExp.dates.display,
      bullets,
      bullets_html,
      page_break: expConfig.page_break || false,
    };
  });

  // Split experience into page 1 (before first page_break) and page 2 (from page_break onward)
  const pageBreakIndex = allExperience.findIndex((exp) => exp.page_break);
  const page1_experience = pageBreakIndex === -1 ? allExperience : allExperience.slice(0, pageBreakIndex);
  const page2_experience = pageBreakIndex === -1 ? [] : allExperience.slice(pageBreakIndex);
  const experience = allExperience;

  // Build featured projects
  const featured_projects = variant.featured_projects
    .map((projConfig) => {
      const baseProj = profile.projects.find((p) => p.id === projConfig.id);
      if (!baseProj) {
        console.warn(`⚠ Warning: Project "${projConfig.id}" not found, skipping`);
        return null;
      }

      const technologies = projConfig.technologies_override || baseProj.technologies;
      const bullets_html = projConfig.bullets.map((b) => `                        <li>${b}</li>`).join('\n');

      return {
        name: baseProj.name,
        role: projConfig.role_override || `Live at ${baseProj.url}`,
        bullets: projConfig.bullets,
        bullets_html,
        technologies,
        technologies_joined: technologies.join(' • '),
      };
    })
    .filter((p) => p !== null) as any[];

  return {
    personal: profile.personal,
    resume: {
      title: variant.title,
      summary_paragraphs: variant.summary_paragraphs,
      skills_display,
      experience,
      page1_experience,
      page2_experience,
      featured_projects,
      has_projects: featured_projects.length > 0,
      education: variant.education,
      influences: variant.influences,
    },
  };
}

/**
 * Simple template engine
 * Supports: {{path.to.value}}, {{#each array}}...{{/each}}, {{#if condition}}...{{/if}}
 */
function renderTemplate(tmpl: string, data: Record<string, unknown>): string {
  return processTemplate(tmpl, data);
}

function processTemplate(tmpl: string, context: Record<string, unknown>): string {
  let result = tmpl;

  // Process {{#each array}}...{{/each}} blocks (non-greedy, innermost first)
  let prevResult = '';
  while (prevResult !== result) {
    prevResult = result;
    result = result.replace(
      /\{\{#each\s+([\w.]+)\}\}([\s\S]*?)\{\{\/each\}\}/,
      (_, path, content) => {
        const array = getNestedValue(context, path) as unknown[];
        if (!Array.isArray(array)) return '';

        return array
          .map((item, index) => {
            // Create a new context with 'this' pointing to the current item
            const itemContext = { ...context, this: item, '@index': index, '@last': index === array.length - 1 };

            let itemContent = content;

            // Handle {{this}} for simple values (strings)
            if (typeof item === 'string' || typeof item === 'number') {
              itemContent = itemContent.replace(/\{\{this\}\}/g, String(item));
            }

            // Handle {{this.property}} for object items
            if (typeof item === 'object' && item !== null) {
              itemContent = itemContent.replace(/\{\{this\.([\w.]+)(\s*\|\s*(\w+)\s*:\s*"([^"]*)")?}}/g,
                (_: string, prop: string, __: string, filter: string, filterArg: string) => {
                  let value = getNestedValue(item as Record<string, unknown>, prop);

                  // Apply filters
                  if (filter === 'join' && Array.isArray(value)) {
                    value = value.join(filterArg || ', ');
                  }

                  return value != null ? String(value) : '';
                }
              );
            }

            // Handle {{#if this.property}}...{{/if}}
            itemContent = itemContent.replace(
              /\{\{#if\s+this\.([\w.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
              (_: string, prop: string, ifContent: string) => {
                const value = getNestedValue(item as Record<string, unknown>, prop);
                return value ? ifContent : '';
              }
            );

            // Handle {{#unless @last}}...{{/unless}}
            itemContent = itemContent.replace(
              /\{\{#unless\s+@last\}\}([\s\S]*?)\{\{\/unless\}\}/g,
              (_: string, unlessContent: string) => {
                return index < array.length - 1 ? unlessContent : '';
              }
            );

            return itemContent;
          })
          .join('');
      }
    );
  }

  // Process {{#if condition}}...{{/if}} blocks (top level)
  result = result.replace(/\{\{#if\s+([\w.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, path, content) => {
    const value = getNestedValue(context, path);
    return value ? content : '';
  });

  // Process simple {{path.to.value}} replacements
  result = result.replace(/\{\{([\w.]+)(\s*\|\s*(\w+)(:"([^"]*)")?)?}}/g, (_, path, __, filter, ___, filterArg) => {
    let value = getNestedValue(context, path);

    // Apply filters
    if (filter === 'uppercase' && typeof value === 'string') {
      value = value.toUpperCase();
    } else if (filter === 'join' && Array.isArray(value)) {
      value = value.join(filterArg || ', ');
    }

    return value != null ? String(value) : '';
  });

  return result;
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Build a specific variant or all variants
 */
function build(variantKey?: string): void {
  const variants = variantKey ? [variantKey] : Object.keys(profile.resume_variants);

  for (const key of variants) {
    const variant = profile.resume_variants[key];
    if (!variant) {
      console.error(`Unknown variant: ${key}`);
      continue;
    }

    console.log(`Building ${key} variant...`);

    const data = buildResumeData(key);
    const html = renderTemplate(template, data);

    const outputPath = join(process.cwd(), variant.output_file);
    writeFileSync(outputPath, html, 'utf-8');

    console.log(`  ✓ Generated ${variant.output_file}`);
  }

  console.log('\nDone! To generate PDFs:');
  console.log('  npx tsx html-to-pdf.ts resume-dev.html Resume_Abe_Reyes.pdf');
  console.log('  npx tsx html-to-pdf.ts resume-sales.html Resume_Abe_Reyes_Sales.pdf');
}

// CLI
const variantArg = process.argv[2];
build(variantArg);
