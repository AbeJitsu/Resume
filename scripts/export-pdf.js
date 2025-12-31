const puppeteer = require('puppeteer');
const path = require('path');

async function exportToPDF(htmlFile, outputFile) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set higher device scale factor for crisp text
    await page.setViewport({
        width: 816,  // 8.5 inches * 96 DPI
        height: 1056, // 11 inches * 96 DPI
        deviceScaleFactor: 3  // 3x for retina-quality
    });

    const filePath = `file://${htmlFile}`;
    await page.goto(filePath, { waitUntil: 'networkidle0' });

    await page.pdf({
        path: outputFile,
        format: 'Letter',
        printBackground: true,
        displayHeaderFooter: false,
        margin: {
            top: '0.5in',
            right: '0.5in',
            bottom: '0.5in',
            left: '0.5in'
        }
    });

    await browser.close();
    console.log(`Created: ${outputFile}`);
}

async function main() {
    const baseDir = path.resolve(__dirname, '../web/resume-html');

    await exportToPDF(
        path.join(baseDir, 'resume-sales.html'),
        path.join(baseDir, 'resume-sales.pdf')
    );

    await exportToPDF(
        path.join(baseDir, 'cover-letter-liberty-mutual.html'),
        path.join(baseDir, 'cover-letter-liberty-mutual.pdf')
    );
}

main().catch(console.error);
