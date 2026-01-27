import { chromium } from 'playwright';

async function checkPages() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('file:///Users/abereyes/Projects/Personal/Resume/resume-dev.html', { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });

  // Measure actual content heights
  const pageInfo = await page.evaluate(() => {
    const page1 = document.querySelector('.page-1') as HTMLElement;
    const page2 = document.querySelector('.page-2') as HTMLElement;
    const page3 = document.querySelector('.page-3') as HTMLElement;

    return {
      page1Height: page1?.scrollHeight,
      page2Height: page2?.scrollHeight,
      page3Height: page3?.scrollHeight,
      page3Exists: !!page3,
    };
  });

  console.log('Page Heights (px):');
  console.log(`  Page 1: ${pageInfo.page1Height}px`);
  console.log(`  Page 2: ${pageInfo.page2Height}px`);
  if (pageInfo.page3Exists) {
    console.log(`  Page 3: ${pageInfo.page3Height}px`);
  }

  const inchPerPage = 11; // Letter size
  const pxPerInch = 96; // Standard screen DPI
  const maxHeight = inchPerPage * pxPerInch;

  console.log(`\nMax height per page: ${maxHeight}px (${inchPerPage}in)`);
  console.log('\nFit Analysis:');
  console.log(`  Page 1 fits: ${pageInfo.page1Height! <= maxHeight ? '✓ YES' : '✗ NO (overflows)'}`);
  console.log(`  Page 2 fits: ${pageInfo.page2Height! <= maxHeight ? '✓ YES' : '✗ NO (overflows)'}`);
  if (pageInfo.page3Exists) {
    console.log(`  Page 3 exists and contains: ${pageInfo.page3Height}px`);
  }

  await browser.close();
}

checkPages().catch(console.error);
