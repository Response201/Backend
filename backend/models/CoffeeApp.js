
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
  hearts: {
    type: Number,
    default: 0
  },

  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 120,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  postId: {
    type: Number
  }
});

const AllCoffes = mongoose.model("AllCoffes", postSchema);
module.exports = AllCoffes;