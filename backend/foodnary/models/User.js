const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    minlenght: 2,
    maxlenght: 10,
    required: [true, "firstname is required"]
  },
  lastname: {
    type: String,
    minlenght: 2,
    maxlenght: 10,
    required: [true, "lastname is required"]
  },
  username: {
    type: String,
    minlenght: 2,
    maxlenght: 10,
    unique: true,
    required: [true, "username is required"]
  },
  email: {
    type: String,
    sparse: true,
    trim: true,
    unique: true,
    text: true,
    required: [true, "email is required"]
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlenght: 6
  },

  verified: {
    type: Boolean,
    default: false
  },

  follow: [
    {
      username: { type: String }
    }
  ],

  followers: [
    {
      username: { type: String }
    }
  ],



  role: {
    type: String,
    default: "basic"
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
