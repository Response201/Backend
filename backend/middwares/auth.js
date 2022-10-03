const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const AllRecipes = require("../models/Recipes");
dotenv.config();

exports.authUser = async (req, res, next) => {
  try {
    let tmp = req.header("Authorization");

    const token = tmp ? tmp.slice(7, tmp.length) : "";

    if (!token) {
      return res
        .status(403)
        .json({ message: "Invalid Authorisation please try to log in" });
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Invalid Authorisation please try to log in" });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.authRole = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    let { role, username} = req.body;
    const recipeOwner = AllRecipes.findById({ recipeId });
    if (role === "admin" || username === recipeOwner.username){
      
      next();
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
