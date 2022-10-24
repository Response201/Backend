const User = require("../models/User");
const AllRecipes = require("../models/Recipes");
const { validateEmail, validateLength } = require("../helpers/validation");
const jwt = require("jsonwebtoken");
const { now } = require("mongoose");
const { generateToken } = require("../helpers/tokens");
const {
  sendVerificationEmail,
  sendPasswordCodeMailer
} = require("../helpers/mailer");
const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");
const Code = require("../models/Code");
const generateCode = require("../helpers/generateCode");

/* New user */
/* Registrering av en användare */

exports.register = async (req, res) => {
  const { email, password, username, firstname, lastname } = req.body;
  try {
    /* validateEmail > take in value("email"), if the value not meet the req > if-statment fires   ( återfinns i validaton.js) */

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "invaild email adress" });
    }
    const checkEmail = await User.findOne({ email: email });
    if (checkEmail) {
      return res.status(400).json({
        message:
          "This email adress already exist, please try with a diffrent email adress"
      });
    }
    const checkUsername = await User.findOne({ username: username });
    if (checkUsername) {
      return res.status(400).json({
        message: "This username already exist, please try with a diffrent one"
      });
    }
    /* validateLength > take in value("password"), if the value not meet the req(value, minLength, maxLength) > if-statment fires ( återfinns i validaton.js) */

    if (!validateLength(password, 6, 40)) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }

    /* krypeterar användarens lösenord innan det sparas i databasen */
    const crypted = await bcrypt.hash(password, 12);

    const user = await new User({
      firstname: firstname,
      lastname: lastname,
      password: crypted,
      username: username,
      email: email
    }).save();

    /* Set up a email verification function   */
    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "60m"
    );
    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.firstname, url);

    const token = generateToken({ id: user._id.toString() }, "7d");

    res.status(200).json({
      response: {
        id: user._id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        token: token,
        verified: user.verified,
        message:
          "registration successful! Please activate your account to start"
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*  Aktivera användare efter registrering, länk skickas från aktiveringsmail, helpers => mailer(accessToken) */

exports.activateAccount = async (req, res) => {
  try {
    const { token } = req.body;
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    const check = await User.findById(user.id);
    if (check.verified === true) {
      return res
        .status(400)
        .json({ message: "This email-adress is already activated" });
    } else {
      await User.findByIdAndUpdate(user.id, { verified: true });
      return res.status(200).json({
        response: {
          id: user._id,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          token: token,
          verified: user.verified,
          message: "Your account is now activated"
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "No user connected to this email-adress" });
    }

    if (!user.verified) {
      const token = generateToken({ id: user.id.toString() }, "7d");
      return res.status(400).json({
        message: "Account not verified",
        email: user.email,
        token: token,
        firstname: user.firstname
      });
    }

    const check = await bcrypt.compareSync(password, user.password);

    if (check) {
      const token = generateToken({ id: user._id.toString() }, "7d");

      res.status(200).json({
        response: {
          id: user._id,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
          followers: user.followers,
          follow: user.follow,
          token: token,
          verified: user.verified,
          message: "Log in successful!"
        }
      });

      /* Email verifikation och tid som aktiverings mail är aktivt  */
      const emailVerificationToken = generateToken(
        { id: user._id.toString() },
        "30m"
      );
    } else {
      return res.status(400).json({
        message: "Password is incorrect",
        email: user.email,
        firstname: user.firstname,
        token: ""
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.auth = async (req, res) => {
  return res.status(200).json({ message: "Authentication successful" });
};

exports.reSendVerification = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);

    if (user.verified === true) {
      return res
        .status(400)
        .json({ message: "This email-adress is already activated" });
    }
    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "60m"
    );

    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.firstname, url);

    res.status(200).json({
      message: "Email verification has been sent"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    await Code.findOneAndRemove({ user: user._id });
    const code = generateCode(5);
    const saveCode = await new Code({
      code,
      user: user._id
    }).save();

    if (user) {
      const url = `${process.env.BASE_URL}/reset`;
      sendPasswordCodeMailer(user.email, user.firstname, code, url);

      res.status(200).json({
        message: "Email to reset password has been sent"
      });
    }
    if (!user) {
      return res.status(400).json({
        message: "No user connected to this email-adress",
        next: false
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.validateCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    const codeDB = await Code.findOne({ user: user._id });

    if (codeDB.code !== code) {
      return res
        .status(400)
        .json({ message: "The verficiation code is not correct", next: false });
    }

    res.status(200).json({
      message: "ok",
      next: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, next: false });
  }
};

exports.changePassword = async (req, res) => {
  const { email, password } = req.body;

  const crypted = await bcrypt.hash(password, 12);

  await User.findOneAndUpdate({ email }, { password: crypted });

  return res.status(200).json({ message: "password have been change" });
};

/* Follwo / UnFollow */

exports.follow = async (req, res) => {
  try {
    const { username } = req.body;
    const { followThisUser } = req.params;

    const findUser = await User.findOne({ username: followThisUser });

    const find = findUser.followers.filter((e) => {
      return e.username === username;
    });

    if (findUser.username === username) {
      res.status(400).json({
        message: "sorry you can not follow your self"
      });
    }

    if (find.length <= 0) {
      const likeUpdateFollowers = await User.findByIdAndUpdate(
        { _id: findUser._id },

        {
          $push: {
            followers: { username: username }
          }
        },
        { new: true }
      );
      const likeUpdateFollowing = await User.findOneAndUpdate(
        { username: username },

        {
          $push: {
            follow: { username: findUser.username }
          }
        },
        { new: true }
      );
      if (likeUpdateFollowers && likeUpdateFollowing) {
        res.json({
          Following: likeUpdateFollowing,
          Followers: likeUpdateFollowers,
          message: "working"
        });
      }
    } else {
      const likeUpdateFollowers = await User.findByIdAndUpdate(
        { _id: findUser._id },

        {
          $pull: {
            followers: { username: username }
          }
        },

        { new: true }
      );

      const likeUpdateFollowing = await User.findOneAndUpdate(
        { username: username },

        {
          $pull: {
            follow: { username: findUser.username }
          }
        },
        { new: true }
      );

      if (likeUpdateFollowers && likeUpdateFollowing) {
        res.json({
          Following: likeUpdateFollowing,
          Followers: likeUpdateFollowers,
          message: "working"
        });
      }
    }
  } catch (error) {
    res.status(400).json({ response: error.message, success: false });
  }
};
