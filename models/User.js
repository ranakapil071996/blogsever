const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecretKey } = require("../config");

const UserSchema = mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    password: { type: String, trim: true, required: true },
    email: {
      type: String,
      trim: true,
      unique: [true, "Email already exists"],
      required: true,
      validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Email is invalid")
        }
      }
    },
    role: {type: [String], enum: ['ADMIN', 'USER'], default: ['USER'] },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.generateAuthToken = function(){
    let user = this
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role}, jwtSecretKey);
    return token
}

UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email, isActive:true});
    if(!user){
        return Promise.reject({message: "User not found"})
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
       return Promise.reject({message: "Invalid password"})
    }
    return user
}

UserSchema.pre("save", async function (next) {
  let user = this;
  if(user.isModified("password")){
      user.password = await bcrypt.hash(user.password, 8)
  }
  next();
});

const User = mongoose.model("user", UserSchema);

module.exports = User
