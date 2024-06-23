const ejs = require('ejs');
const fs = require("fs");
const path = require('path');
const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");
const createPDF = async (req, res) => {
  try {
    let htmlString = fs.readFileSync(path.join(__dirname, '/invoice.ejs')).toString();
    let ejsData = ejs.render(htmlString, req.data);
   

  const options = {
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
      ignoreDefaultArgs: ['--disable-extensions']
    }
  
    const browser = await puppeteer.launch(options);
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
