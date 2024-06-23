const ejs = require('ejs');
const fs = require("fs");
const path = require('path');
const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");
const puppeteerExtra = require("puppeteer-extra");
const createPDF = async (req, res) => {
  try {
    let htmlString = fs.readFileSync(path.join(__dirname, '/invoice.ejs')).toString();
    let ejsData = ejs.render(htmlString, req.data);
    require("puppeteer-extra-plugin-stealth/evasions/defaultArgs");
    require("puppeteer-extra-plugin-user-preferences");
    require('puppeteer-extra-plugin-stealth/evasions/chrome.app');
require('puppeteer-extra-plugin-stealth/evasions/chrome.csi');
require('puppeteer-extra-plugin-stealth/evasions/chrome.loadTimes');
require('puppeteer-extra-plugin-stealth/evasions/chrome.runtime');
require('puppeteer-extra-plugin-stealth/evasions/iframe.contentWindow');
require('puppeteer-extra-plugin-stealth/evasions/media.codecs');
require('puppeteer-extra-plugin-stealth/evasions/navigator.hardwareConcurrency');
require('puppeteer-extra-plugin-stealth/evasions/navigator.languages');
require('puppeteer-extra-plugin-stealth/evasions/navigator.permissions');
require('puppeteer-extra-plugin-stealth/evasions/navigator.plugins');
require('puppeteer-extra-plugin-stealth/evasions/navigator.vendor');
require('puppeteer-extra-plugin-stealth/evasions/navigator.webdriver');
require('puppeteer-extra-plugin-stealth/evasions/sourceurl');
require('puppeteer-extra-plugin-stealth/evasions/user-agent-override');
require('puppeteer-extra-plugin-stealth/evasions/webgl.vendor');
require('puppeteer-extra-plugin-stealth/evasions/window.outerdimensions');
    puppeteerExtra.use(stealthPlugin())

  const options = {
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    }
  
    const browser = await puppeteerExtra.launch(options);
    const page = await browser.newPage();
    await page.setContent(ejsData);

    const pdf = await page.pdf({ format: 'A4' });
    await browser.close()
    res.set({ "Content-Type": "application/pdf" });
    res.send('pdf');

  }
  catch (err) {
    console.log(err);
    if (res.saleAddedToDatabase == true) {
      return res.status(206).json({ status: true, msg: "Sale Added But Failed to generate PDF. Please try again later !" })
    }
    res.status(500).json({ status: false, msg: 'Server Failed !' })
  }


}

module.exports = createPDF;
