import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const htmlPath = resolve(process.cwd(), 'scripts/biznex-docs.html');
const pdfPath = resolve(process.cwd(), 'BizNex-Technical-Documentation.pdf');

const html = readFileSync(htmlPath, 'utf-8');

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.pdf({
  path: pdfPath,
  format: 'A4',
  margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: '<div style="font-size:9px;color:#999;text-align:center;width:100%;">BizNex Technical Documentation — Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
});
await browser.close();
console.log(`✅ PDF saved to: ${pdfPath}`);
