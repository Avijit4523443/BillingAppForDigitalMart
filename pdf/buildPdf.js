const ejs = require('ejs');
const fs = require("fs");
const path = require('path');
let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

const createPDF = async (req, res) => {
  try {
    let htmlString = fs.readFileSync(path.join(__dirname, '/invoice.ejs')).toString();
    let ejsData = ejs.render(htmlString, req.data);

    let options = {};

    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
      options = {
        args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chrome.defaultViewport,
        executablePath: await chrome.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
      };
    }

    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.setContent(ejsData);

    const pdf = await page.pdf({ format: 'A4' });
    await browser.close()
    res.set({ "Content-Type": "application/pdf" });
    res.send(pdf);

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
