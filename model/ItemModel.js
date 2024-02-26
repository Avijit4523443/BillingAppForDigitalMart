const { default: mongoose } = require("mongoose");

const ItemSchema = new mongoose.Schema({
  date:{
    type:String,
    required:true
  },
  name:{
    type:String,
    required:true
  },
  hsnNumber:{
    type:Number,
    required:true
  },
  pp:{
    type:Number,
    required:true
  },
  sp:{
    type:Number,
    required:true
  },
  qt:{
    type:Number,
    required:true
  },
  owner:{
    type:String,
    required:true
  }
});

module.exports = mongoose.model("Item",ItemSchema)