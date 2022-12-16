const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const todoSchema = new mongoose.Schema({
  id: {
    type: Date,
    default: Date.now()
  },
  title: String,
  description: String,
  project: String,
  type: String,
  who: String,
  what: String,
  priority: String,
  status: {
    type: String,
    default: ""
  },
  done:{
    type: Boolean,
    default: false
  },
});

const AllTodos = mongoose.model("AllTodos", todoSchema);
module.exports = AllTodos;
