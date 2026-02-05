import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

async function convertHtmlToPdf(htmlFile: string, pdfFile: string) {
  if (!fs.existsSync(htmlFile)) {
    console.error(`Error: HTML file not found: ${htmlFile}`);
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();
    const htmlPath = `file://${path.resolve(htmlFile)}`;

    await page.goto(htmlPath, { waitUntil: "networkidle0" });

    // Set viewport to A4 size (8.5 x 11 inches at 96 DPI = 816 x 1056 pixels)
    await page.setViewport({
      width: 1080,
      height: 1400,
      deviceScaleFactor: 2, // 2x scale for higher quality (200 DPI equivalent)
    });

    // Generate PDF with high quality settings
    await page.pdf({
      path: pdfFile,
      format: "A4",
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      scale: 1,
      printBackground: true,
      preferCSSPageSize: true,
    });

    console.log(`✓ PDF created successfully: ${pdfFile}`);
  } catch (error) {
    console.error("Error converting HTML to PDF:", error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Get arguments from command line
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: npx tsx html-to-pdf.ts <input.html> <output.pdf>");
  process.exit(1);
}

const inputFile = args[0];
const outputFile = args[1];

convertHtmlToPdf(inputFile, outputFile);
