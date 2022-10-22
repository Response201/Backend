const AllRecipes = require("../models/Recipes");
const User = require("../models/User");

/* all Recipes */

exports.allRecipes = async (req, res) => {
  try {
    const response = await AllRecipes.find().sort({ createdAt: -1 }).exec();
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
};

/* 50 newest Recipes */

exports.newestRecipes = async (req, res) => {
  try {
    const response = await AllRecipes.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
};


/* 3 newest Recipes */

exports.threenewestRecipes = async (req, res) => {
  try {
    const response = await AllRecipes.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .exec();
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
};



/* Filter out one user Recipes */

exports.userRecipe = async (req, res) => {
  try {
    const { username } = req.body;
    const response = await AllRecipes.find({ username: username })
      .sort({ createdAt: -1 })
      .exec();

    if (response.length <= 0) {
      res
        .status(201)
        .json({ message: "user have no recipt yet", success: true });
    } else {
      res.status(201).json(response);
    }
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
};

/* Filter out Following users Recipes */

exports.followRecipts = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findOne({ username });

    if (user) {
      const following = [];
      user.follow.forEach((e) => {
        following.push(e.username);
      });

      let recipesFollowing = [];

      for (let i = 0; i < following.length; i++) {
        let recipes = await AllRecipes.find({ username: following[i] });

        recipesFollowing.push(recipes);
      }

      res.status(201).json(recipesFollowing);
    } else {
      res.status(400).json({
        message: "the users you follow have not create anny recipes yet"
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
};

/* Filter by Main and Sub category Recipes */

exports.mainAndsub = async (req, res) => {
  try {
    const { subCatergory, mainCategory } = req.body;
    const responset = await AllRecipes.find({ mainCategory: mainCategory })
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();
    const data = [...responset];

    const response = await data.filter(
      (item) => item.subCatergory === subCatergory
    );
    if (response.length <= 0) {
      res
        .status(201)
        .json({ message: "No item in this category", success: true });
    } else {
      res.status(201).json(response);
    }
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
};

/* Filter by Main category Recipes */

exports.mainCategory = async (req, res) => {
  try {
    const { mainCategory } = req.body;
    const response = await AllRecipes.find({ mainCategory: mainCategory })
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();

    if (response.length <= 0) {
      res
        .status(201)
        .json({ message: "No item in this category", success: true });
    } else {
      res.status(201).json(response);
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
};

/* Filter by Main and Sub category Recipes */

exports.subCatergory = async (req, res) => {
  try {
    const { subCatergory } = req.body;
    const response = await AllRecipes.find({ subCatergory: subCatergory })
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();

    if (response.length <= 0) {
      res
        .status(201)
        .json({ message: "No item in this category", success: true });
    } else {
      res.status(201).json(response);
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
};

/* New Recipe */

exports.createRecipe = async (req, res) => {
  const {
    title,
    description,
    ingredients,
    username,
    mainCategory,
    subCatergory,
    image
  } = req.body;

  const recipes = await new AllRecipes({
    title,
    description,
    ingredients,
    mainCategory,
    subCatergory,
    username,
    image
  }).save();

  try {
    const response = await recipes;
    if (response) {
      res.status(201).json({
        response,
        success: true
      });
    } else {
      res.status(404).json({ message: "oh no something went wrong" });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
};

/* change Recipe */

exports.changeRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const {
      title,
      mainCategory,
      subCatergory,
      description,
      ingredients,
      image
    } = req.body;

    const response = await AllRecipes.findOneAndUpdate(
      { _id: recipeId },
      {
        title: title,
        mainCategory: mainCategory,
        subCatergory: subCatergory,
        description: description,
        ingredients: ingredients,
        image: image
      },
      {
        new: true
      }
    );

    if (response) {
      return res
        .status(200)
        .json({ response, message: "recipt  have been change" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
};

/* delete recipe */

exports.deleteRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const deleter = await AllRecipes.findByIdAndDelete({ _id: recipeId });

    if (deleter) {
      return res.status(200).json({ message: "recipt  have been deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
};

/* Like Recipe */

exports.likeRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { username } = req.body;

    const findRecipt = await AllRecipes.findOne({ _id: recipeId });
    const find = findRecipt.liked.filter((e) => e.user === username);

    if (find.length === 0) {
      const likeUpdate = await AllRecipes.findByIdAndUpdate(
        { _id: recipeId },

        {
          $push: {
            liked: { user: username }
          },

          $inc: {
            hearts: 1
          }
        },
        { new: true }
      );

      if (likeUpdate) {
        res.json(likeUpdate);
      }
    } else {
      const likeUpdate = await AllRecipes.findByIdAndUpdate(
        { _id: recipeId },
        {
          $pull: {
            liked: { user: username }
          },

          $inc: {
            hearts: -1
          }
        },
        { new: true }
      );

      if (likeUpdate) {
        res.json(likeUpdate);
      }
    }
  } catch (error) {
    res.status(400).json({ response: error.message, success: false });
  }
};

/* average-rating Recipe */

exports.ratingRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { username, value } = req.body;

    const findRecipt = await AllRecipes.findOne({ _id: recipeId });
    const find = findRecipt.ratings.filter((e) => e.user === username);

    if (find.length === 0) {
      const ratingUpdate = await AllRecipes.findByIdAndUpdate(
        { _id: recipeId },

        {
          $push: {
            ratings: { user: username, rating: value }
          }
        },
        { new: true }
      );

      if (ratingUpdate) {
        res.json(ratingUpdate);
      }
    } else {
      const ratingUpdate = await AllRecipes.findByIdAndUpdate(
        { _id: recipeId },

        {
          $pull: {
            ratings: { user: username }
          }
        },

        { new: true }
      );

      if (ratingUpdate) {
        if (value) {
          const fix = await AllRecipes.findByIdAndUpdate(
            { _id: recipeId },

            {
              $push: {
                ratings: { user: username, rating: value }
              }
            },

            { new: true }
          );
          res.json(fix);
        } else {
          res.json(ratingUpdate);
        }
      }
    }
  } catch (error) {
    res.status(400).json({ response: error.message, success: false });
  }
};

/* Filter out one Recipes */

exports.oneRecipe = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await AllRecipes.findOne({ _id: id });

    if (!response) {
      res.status(201).json({ message: "no recipe", success: true });
    } else {
      res.status(201).json(response);
    }
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
};
