const { default: mongoose } = require("mongoose");
const ItemModel = require("../model/ItemModel");
const SaleModel = require("../model/SaleModel");
const createPDF = require("../pdf/buildPdf");
const UserDetailsModel = require("../model/UserDetailsModel");
const addSale = async (req, res) => {
  const db = mongoose.connections[0];
  const session = await db.startSession();
  try {
    session.startTransaction();

    // update the number of sale
    const userDetails = await UserDetailsModel.findOneAndUpdate({ "user": req.user.userId }, { $inc: { saleCount: 1 } }, { session: session });

    const saleData = {
      transactionType: req.body.transactionType,
      name: req.body.customerDetails.name,
      address: req.body.customerDetails.address,
      mobNo: req.body.customerDetails.mobNo,
      productList: req.body.itemList,
      discount: req.body.discount,
      serviceCharge: req.body.serviceCharge,
      total: req.body.totalAmount,
      owner: req.user.userId,
      date: req.body.date,
      saleCount: userDetails.saleCount + 1
    }

    await SaleModel.create([saleData], { session: session });

    // update product quantity.
    for (let i = 0; i < saleData.productList.length; i++) {
      await ItemModel.updateOne({ _id: saleData.productList[i].productId, owner: req.user.userId }, { $inc: { qt: -saleData.productList[i].qt } }, { session: session });

    }


    await session.commitTransaction()

    let buffer = Buffer.from(userDetails.brandImg).toString("base64")


    req.data = {
      name: saleData.name,
      mobNo: saleData.mobNo,
      Discount: saleData.discount,
      ServiceCharge: saleData.serviceCharge,
      Total: saleData.total,
      billingAddress: saleData.address,
      list: saleData.productList,
      businessEmail: userDetails.email,
      businessMobileNo: userDetails.mobNo,
      businessAdd: userDetails.address,
      businessName: userDetails.brandName,
      imgSrc: buffer,
      date: saleData.date,
      saleCount: saleData.saleCount,
      BN: userDetails.bankname,
      BAN: userDetails.bankaccnumber,
      BIFSC: userDetails.bankifsccode,
      BAHN: userDetails.accountholdername
    }

    res.saleAddedToDatabase = true;
    createPDF(req, res)

  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ status: false, msg: "Something went wrong !" });
  }
};

const getSingleSale = async (req, res, next) => {
  try {
    const getType = req.query.type;
    const id = req.query.id;
    if (getType == 0) {
      const sale = await SaleModel.findOne({ "_id": id, "owner": req.user.userId });
      if (!sale) {
        return res.status(400).json({ statu: false, msg: 'No such sale.' })
      }
      res.status(200).json({ status: true, sale })
    }
    else {
      next();
    }
  }
  catch (err) {
    res.status(500).json({ status: false, msg: "Something went wrong !" })
  }
}

const getAllSale = async (req, res, next) => {
  try {
    const getType = req.query.type;
    const year = req.query.year;

    if (getType == 1) {
      const allSales = await SaleModel.find({ owner: req.user.userId, date: { $regex: year } });
      res.status(200).json({ status: true, allSales });
    }
    else {
      next();
    }
  }
  catch (err) {
    res.status(500).json({ status: false, msg: "something went wrong !" })
  }
}

const updateSale = async (req, res) => {
  try {
    const itemId = new mongoose.Types.ObjectId(req.query.id);

    const updatedItem = await SaleModel.updateOne({ "_id": itemId, "owner": req.user.userId }, req.body);

    if (updatedItem.matchedCount == 0) {
      return res.status(500).json({ status: false, msg: 'Something went wrong !' });
    }
    res.status(202).json({ status: true, msg: 'Updated successfully.', updatedItem })

  }
  catch (err) {
    res.status(500).json({ status: false, msg: 'Something went wrong !' })
  }
}

const deleteSale = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.query.id);
    const deletedItem = await SaleModel.deleteOne({ _id: id, owner: req.user.userId });
    if (deletedItem.deletedCount == 1) {
      return res.status(200).json({ status: true, msg: 'Successfully Deleted !' });
    }
    res.status(500).json({ status: false, msg: 'Something went wrong !' })
  }
  catch (err) {
    res.status(500).json({ status: false, msg: 'Something went wrong !' })
  }
}

const downloadPDF = async (req, res) => {
  try {
    const getType = req.query.type;
    if (getType == 2) {
      const id = req.query.id;
      const saleData = await SaleModel.findById(id);
      const userDetails = await UserDetailsModel.findOne({ user: req.user.userId });
      let buffer = Buffer.from(userDetails.brandImg).toString("base64")

      req.data = {
        name: saleData.name,
        mobNo: saleData.mobNo,
        Discount: saleData.discount,
        ServiceCharge: saleData.serviceCharge,
        Total: saleData.total,
        billingAddress: saleData.address,
        list: saleData.productList,
        businessEmail: userDetails.email,
        businessMobileNo: userDetails.mobNo,
        businessAdd: userDetails.address,
        businessName: userDetails.brandName,
        imgSrc: buffer,
        date: saleData.date,
        saleCount: saleData.saleCount,
        BN: userDetails.bankname,
        BAN: userDetails.bankaccnumber,
        BIFSC: userDetails.bankifsccode,
        BAHN: userDetails.accountholdername
      }
      createPDF(req, res);
    }
    else {
      res.status(500).json({ status: false, msg: 'Wrong Route !' });
    }
  }
  catch (err) {
    res.status(500).json({ status: false, msg: 'Something went wrong !' });
  }
}

module.exports = {
  addSale,
  getSingleSale,
  getAllSale,
  updateSale,
  deleteSale,
  downloadPDF
};
