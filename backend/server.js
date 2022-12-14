const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
dotenv.config();
const app = express();
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true
  })
);

/* Routes */

/* Portfolio */

const {Send } = require("./portfolio/helper/constrollers/Send")

/* Foodnary */
/* recipes */
const {
  allRecipes,
  userRecipe,
  createRecipe,
  newestRecipes,
  likeRecipe,
  ratingRecipe,
  mainCategory,
  mainAndsub,
  subCatergory,
  changeRecipe,
  followRecipts,
  deleteRecipe,
  oneRecipe,
  threenewestRecipes
} = require("./foodnary/controllers/recipes");
/* user */
const {
  register,
  activateAccount,
  login,
  auth,
  reSendVerification,
  resetPassword,
  validateCode,
  changePassword,
  follow
} = require("./foodnary/controllers/user");
/* upload */
const { uploadimg } = require("./foodnary/controllers/upload");
const { authUser, authRole } = require("./foodnary/middwares/auth");
const imageUpload = require("./foodnary/middwares/imageUpload");

/* todo-app */

const {createTodo, postTodoList, changeTodo, deleteTodo} = require("./todo-app/controllers/todo");

/* coffee app */
const {
  likeCoffee,
  newCoffee,
  postCoffee
} = require("./coffee-app/controllers/coffeeApp");


const mongoUrl =
  process.env.MONGO_URL || "https://backend-recipe-ect.herokuapp.com";

mongoose.connect(
  mongoUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to MongoDB!!!");
  }
);

const port = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());

// Start
app.get("/", (req, res) => {
  res.send("Welcome to this API, it's used for Recipe-dictionary");
});

/* Portfolio */

app.post("/send", Send)

/* todo-app */

app.get("/list", postTodoList);

app.post("/newTask", createTodo);

app.put("/updateTodo", changeTodo)

app.post("/deleteTodo", deleteTodo)

/* Coffee app */

/* Create a new post*/

app.post("/newCoffee", newCoffee);

/* Get all posts*/

app.get("/postCoffee", postCoffee);

/* update post if its get a like */

app.post("/post/:postId/likeCoffee", likeCoffee);

/* Recipe-dictionary-app */

/* User-routes */

/*  sign up */
app.post("/signup", register);

/* user activation */
app.post("/activate", activateAccount);

/* sign in */
app.post("/signin", login);

/* auth */
app.post("/auth", authUser, auth);

/* resend verification mail */
app.post("/reSendVerification", authUser, reSendVerification);

/* reset password => send validation code*/
app.post("/reset", resetPassword);

/* validate code */
app.post("/validate", validateCode);

/*  update password */
app.post("/change", changePassword);

/* Follow/ UnFollow */

app.post("/:followThisUser/follow", follow);

/* Recipe-routes */

/* get all recipes */

app.get("/allRecipes", allRecipes);

/* Get 50 newest recipes*/
app.get("/newestRecipes", newestRecipes);

/* Get 3 newest recipes*/
app.get("/threenewestRecipes", threenewestRecipes);

/* One users recipes */
app.post("/userRecipe", userRecipe);

/* Recipes from popole user follows */

app.post("/followRecipts", followRecipts);

/* update recipe-post if its get a like */
app.post("/:recipeId/likeRecipe", authUser, likeRecipe);

/* rating Recipe */
app.post("/:recipeId/ratingRecipe", /* authUser, */ ratingRecipe);

/* Filter out by main & sub category */

app.post("/mainAndsub", mainAndsub);

/* Filter out by main category */
app.post("/mainCategory", mainCategory);

/* Filter out by main category */
app.post("/subCatergory", subCatergory);

/* Create a new recipe*/
app.post("/createRecipe", authUser, createRecipe);

/* change a Recipt */
app.post("/:recipeId/changeRecipe", authUser, changeRecipe);

/* delete a recipe */

app.post("/:recipeId/deleteRecipe", authUser, deleteRecipe);

/* get singel recipe */

app.post("/oneRecipe", oneRecipe);

/* Upload Images */

app.post("/uploadimg", authUser, imageUpload, uploadimg);

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
