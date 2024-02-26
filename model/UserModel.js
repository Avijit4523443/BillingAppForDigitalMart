const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
});

UserSchema.methods.createJwt = function () {
    return jwt.sign(
      { email: this.email, userId: this._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_LIFETIME,
      }
    );
  };

module.exports = mongoose.model("User",UserSchema);