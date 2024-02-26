const { default: mongoose } = require("mongoose");
const ItemModel = require("../model/ItemModel");

const addItem = async (req, res) => {
  try {
    let { name, hsnNumber, pp, sp, date, qt } = req.body;
    if (!name || !hsnNumber || !pp || !sp || !date || !qt) {
      return res.status(400).json({ status: false, msg: 'Please Provide Valid Information !' })
    };
    let item = {
      name, hsnNumber, pp, sp, date, qt, owner: req.user.userId
    };
    let createdItem = await ItemModel.create(item);
    if (createdItem) {
      return res.status(201).json({ status: true, msg: 'Item Added', createdItem })
    }
    res.status(500).json({ status: false, msg: 'Something went wrong !' })
  }
  catch (err) {
    res.status(500).json({ status: false, msg: 'Something went wrong !' })
  }

}

const deleteItem = async (req, res) => {
 
  try {
    const { id } = req.query;
    const itemId = new mongoose.Types.ObjectId(id);
    const deletedItem = await ItemModel.deleteOne({ "_id": itemId, "owner": req.user.userId });
    if (deletedItem.deletedCount == 0) {
      return res.status(500).json({ status: false, msg: 'Something went wrong !' });
    }
    res.status(200).json({ status: true, msg: 'Deleted Successfully.', deletedItem })
  }
  catch (err) {
    res.status(500).json({ status: false, msg: 'Something went wrong !' })
  }
}

const updateItem = async (req, res) => {

  try {
    const { id } = req.query;
    const itemId = new mongoose.Types.ObjectId(id);
    const updatedItem = await ItemModel.updateOne({ "_id": itemId, "owner": req.user.userId }, req.body);

    if (updatedItem.matchedCount == 0) {
      return res.status(500).json({ status: false, msg: 'Something went wrong !' });
    }
    res.status(202).json({ status: true, msg: 'Updated successfully.'})
  }
  catch (err) {
    res.status(500).json({ status: false, msg: 'Something went wrong !' })
  }
}

const searchItem = async (req, res, next) => {
  try {
    const getType = req.query.type;
    if (getType == 0) {
      const searchQuery = req.query.k;
      const itemList = await ItemModel.aggregate([
        {
          $search: {
            index:"itemSearch",
            compound: {
              must: [{
                autocomplete: {
                  query: searchQuery,
                  path: "name"
                }
              }],
                filter: [{
                  queryString:{
                    defaultPath:"owner",
                    query:req.user.userId
                  }
              }]
            }
          }
        },
      ]);
      res.status(200).json({ status:true,itemList })
    }
    else {
      next()
    }
  }
  catch (err) {
    res.status(500).json({ status: false, msg: 'Something went wrong !' })
  }
}

const getItem = async (req, res, next) => {
  try {
    const getType = req.query.type;
    if (getType == 1) {
      const id =new mongoose.Types.ObjectId(req.query.id);
      const item = await ItemModel.findOne({"_id":id,"owner":req.user.userId});
      if(!item){
        return res.status(400).json({status:false,msg:'something went wrong !'})
      }
      res.status(200).json({ status: true, item })
    }
    else {
      next()
    }
  }
  catch (err) {
    res.status(500).json({ status: false, msg: "Something went wrong !" })
  }

}

const getAllItem = async (req, res, next) => {
  try {
    const getType = req.query.type;
    if (getType == 2) {
      const allItems = await ItemModel.find({ owner: req.user.userId })
      res.status(200).json({ status: true, items: allItems })
    }
    else {
      res.status(400).json({ status: false, msg: 'Invalid request !' })
    }

  }
  catch (err) {
    res.status(500).json({ status: false, msg: 'Something went wrong !' })
  }
}
module.exports = {
  addItem, deleteItem,
  updateItem, searchItem, getItem, getAllItem
};