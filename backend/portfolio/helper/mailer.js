const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const oauth_link = "https://developers.google.com/oauthplayground";
const dotenv = require("dotenv");
dotenv.config();
const { EMAIL, MAILING_ID, MAILING_REFRESH, MAILING_SECRET, EMAILHOME } =
  process.env;

const auth = new OAuth2(
  MAILING_ID,
  MAILING_SECRET,
  MAILING_REFRESH,
  oauth_link
);

exports.sendEmail = (email, message, title) => {
  auth.setCredentials({
    refresh_token: MAILING_REFRESH
  });
  const accessToken = auth.getAccessToken();
  const stmp = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: EMAIL,
      clientId: MAILING_ID,
      clientSecret: MAILING_SECRET,
      refreshToken: MAILING_REFRESH,
      accessToken
    }
  });
  const mailOptions = {
    from: email,
    to: EMAILHOME,
    subject: `${title}`,
    html: `<body><h1> ${title} </h1>  <p> ${message}  </p> <p> Från ${email} </p> </body>`
  };
  stmp.sendMail(mailOptions, (err, res) => {
    if (err) return err;
    return res;
  });
};
