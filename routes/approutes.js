const express = require('express')
const {addItem,deleteItem, updateItem, searchItem, getItem, getAllItem} = require("../controller/Item");
const { addSale, getSingleSale, getAllSale, updateSale,deleteSale, downloadPDF } = require('../controller/Sale');


const router = express.Router();

router.route('/item').post(addItem).delete(deleteItem).patch(updateItem).get(searchItem,getItem,getAllItem);

router.route('/sale').post(addSale).get(getSingleSale,getAllSale,downloadPDF).patch(updateSale).delete(deleteSale);

module.exports = router;