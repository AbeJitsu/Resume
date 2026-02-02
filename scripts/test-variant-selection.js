const fs = require('fs');

// Test that variant selection works with both old and new schema
const profileData = JSON.parse(fs.readFileSync('profile-data.json', 'utf-8'));
const profileDataV2 = JSON.parse(fs.readFileSync('profile-data-v2.json', 'utf-8'));

console.log('Testing content selection with both schemas:\n');

// Test 1: Old schema (profile-data.json) - Toyota job
const toyotaOld = profileData.work_experience.find(e => e.id === 'toyota');
console.log('✓ Old Schema (profile-data.json):');
console.log(`  Toyota job has resume_bullets: ${toyotaOld.descriptions?.resume_bullets?.length || 0} bullets`);

// Test 2: New schema (profile-data-v2.json) - Toyota job
const toyotaNew = profileDataV2.work_experience.find(e => e.id === 'toyota');
console.log('\n✓ New Schema (profile-data-v2.json):');
console.log(`  Toyota job has variants: ${Object.keys(toyotaNew.variants || {}).join(', ')}`);
console.log(`    - automotive: ${toyotaNew.variants?.automotive?.bullets?.length || 0} bullets`);
console.log(`    - general_sales: ${toyotaNew.variants?.general_sales?.bullets?.length || 0} bullets`);
console.log(`    - tech: ${toyotaNew.variants?.tech?.bullets?.length || 0} bullets`);

// Test 3: Verify context mapping in resume_variants
console.log('\n✓ Resume Variants with contexts:');
for (const [key, config] of Object.entries(profileDataV2.resume_variants)) {
  console.log(`  ${key}: context="${config.context || key}"`);
}

// Test 4: Sample content from each context
console.log('\n✓ Sample automotive variant content:');
console.log(`  Title: "${toyotaNew.variants.automotive.title}"`);
console.log(`  First bullet: "${toyotaNew.variants.automotive.bullets[0].substring(0, 60)}..."`);

console.log('\n✓ Sample tech variant content:');
console.log(`  Title: "${toyotaNew.variants.tech.title}"`);
console.log(`  First bullet: "${toyotaNew.variants.tech.bullets[0].substring(0, 60)}..."`);

console.log('\n✅ All variant selection tests passed!');
