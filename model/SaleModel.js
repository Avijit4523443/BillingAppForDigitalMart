const { default: mongoose } = require("mongoose");

const SaleSchema = new mongoose.Schema({
  transactionType: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  address: {
    type: String
  },
  mobNo: {
    type: Number
  },
  productList: {
    type: []
  },
  discount: {
    type: Object
  },
  serviceCharge: {
    type: Number
  },
  total: {
    type: Number
  },
  owner: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  saleCount: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Sale", SaleSchema);
