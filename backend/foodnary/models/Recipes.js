const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const recipeSchema = new mongoose.Schema({
  hearts: {
    type: Number,
    default: 0
  },
  liked: [
    {
      user: { type: String }
    }
  ],

  username: {
    type: String
  },
  mainCategory: {
    type: String,
    trim: true
  },

  subCatergory: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default:
      "https://th.bing.com/th/id/OIP.DRfFEHzNlR5Ee7WDh9gWJgHaD4?pid=ImgDet&rs=1"
  },
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true
  },
  description: {
    type: String,
    maxlength: 3000,
    trim: true
  },
  ingredients: [
    {
      id: {
        type: Number
      },
      amount: {
        type: String
      },
      measure: {
        type: String,

        trim: true
      },
      ingredient: {
        type: String,
        maxlength: 20,
        trim: true
      }
    }
  ],
  ratings:[
    {
      user: { type: String },
      rating:{
        type: Number}
        
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AllRecipes = mongoose.model("AllRecipes", recipeSchema);
module.exports = AllRecipes;
