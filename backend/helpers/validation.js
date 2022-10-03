const User = require("../models/User");

/* check so the input "email" is correct buils, follows email-adress req */

exports.validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/);
};

exports.validateLength = (text, min, max) => {
  return text.length < min || text.length > max ? false : true;
};
