const { default: mongoose } = require("mongoose");

const UserDetailsModelSchema = new mongoose.Schema({
    mobNo: {
        type: Number,
        required: true
    },
    brandImg: {
        type: Buffer,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    brandName: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    bankname: {
        type: String
    },
    bankaccnumber: {
        type: String
    },
    bankifsccode: {
        type: String
    },
    accountholdername: {
        type: String
    },
    saleCount: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("UserDetailsModel", UserDetailsModelSchema)