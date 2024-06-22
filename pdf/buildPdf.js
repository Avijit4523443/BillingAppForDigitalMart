const ejs = require('ejs');
let pdf = require('html-pdf');
const fs = require("fs");
const path = require('path')
const createPDF = async (req, res) => {
  try {
    let htmlString = fs.readFileSync(path.join(__dirname, '/invoice.ejs')).toString();

    let ejsData = ejs.render(htmlString, req.data);

    pdf.create(ejsData,{"phantomPath": "./node_modules/phantomjs/bin/phantomjs"}).toStream((err,stream) => {
      console.log(err);
      stream.pipe(res);
    })

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
