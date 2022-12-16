const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const oauth_link = "https://developers.google.com/oauthplayground";
const dotenv = require("dotenv");
dotenv.config();
const { EMAIL, MAILING_ID, MAILING_REFRESH, MAILING_SECRET } = process.env;

const auth = new OAuth2(
  MAILING_ID,
  MAILING_SECRET,
  MAILING_REFRESH,
  oauth_link
);

exports.sendVerificationEmail = (email, name, url) => {
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
    from: EMAIL,
    to: email,
    subject: "Foodnary email verification",
    html: `<body style="padding: 5px 10px"><div style="max-width:700px;margin-bottom:1.5rem;display:flex; align-items:center; gap:20px; font-family:'Gill Sans','Gill Sans MT',Calibri,'Trebuchet MS',sans-serif;font-weight:600;color:#ed1a59; "> <img src="https://cdn.icon-icons.com/icons2/131/PNG/256/cherry_food_fruit_20613.png" alt="icon" style="width:40px; background-color:#ed1a59; padding:5px; border-radius:50%;"> <span style="margin-left:5px; font-size:clamp(1.3em, 2.5vw, 2em);">Activate your foodnary account</span> </div><div style="max-width:900px;margin-bottom:1rem;font-family:'Gill Sans','Gill Sans MT',Calibri,'Trebuchet MS',sans-serif;font-size:clamp(1.1em, 2vw, 1.2em); font-weight:700; color:#181818;"> <span>Hello ${name}</span> <p>You recently created an account on Foodnary.<br> To complete your registration, please comfirm your account.</p></div><a href=${url} style=" max-height:fit-content; text-align: center; max-width:fit-content;margin-bottom:1.5rem;padding:0px 10px;display:flex;text-decoration:none;justify-content:center;align-items:center;align-content:center;font-family:'Gill Sans','Gill Sans MT',Calibri,'Trebuchet MS',sans-serif;font-weight:600;color:#121314;background-color:#ed1a59;box-shadow:2px 3px 0 #121314"> <p style="font-size:clamp(10px, 2vw, 13px);" > Confirm your account </p> </a><div style="color:#5f4522;font-family:'Gill Sans','Gill Sans MT',Calibri,'Trebuchet MS',sans-serif;font-size:1rem"> <p>Foodnary help you to remember all of your favorite meals!</p></div> </body>`
  };
  stmp.sendMail(mailOptions, (err, res) => {
    if (err) return err;
    return res;
  });
};

/* Reset password - get a code */
exports.sendPasswordCodeMailer = (email, name, code, url) => {
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
    from: EMAIL,
    to: email,
    subject: "Foodnary - reset password",
    html: `<body style="padding: 5px 10px"><div style="max-width:700px;margin-bottom:1.5rem;display:flex; align-items:center; gap:20px; font-family:'Gill Sans','Gill Sans MT',Calibri,'Trebuchet MS',sans-serif;font-weight:600;color:#ed1a59; "> <img src="https://cdn.icon-icons.com/icons2/131/PNG/256/cherry_food_fruit_20613.png" alt="icon" style="width:40px; background-color:#ed1a59; padding:5px; border-radius:50%;"> <span style="margin-left:5px; font-size:clamp(1.3em, 2.5vw, 1.9em);">Reset reset your Foodnary password</span> </div><div style="max-width:900px;margin-bottom:1rem;font-family:'Gill Sans','Gill Sans MT',Calibri,'Trebuchet MS',sans-serif;font-size:clamp(1.1em, 2vw, 1.2em); font-weight:700; color:#181818;"> <span>Hello ${name}</span> <p>Somebody recently asked to reset your Foodnary password.<br> <span style="font-size:clamp(0.7em, 2.5vw, 0.9em);" ><a href=${url}>Click here to change your password</a> and use this verification code:</span></p></div><a style=" max-height:fit-content; text-align: center; max-width:fit-content;margin-bottom:1.5rem;padding:0px 10px;display:flex;text-decoration:none;justify-content:center;align-items:center;align-content:center;font-family:'Gill Sans','Gill Sans MT',Calibri,'Trebuchet MS',sans-serif;font-weight:600;color:#121314;background-color:#ed1a59;box-shadow:2px 3px 0 #121314"> <p style="font-size:clamp(13px, 2vw, 17px);" > ${code} </p> </a><div style="color:#5f4522;font-family:'Gill Sans','Gill Sans MT',Calibri,'Trebuchet MS',sans-serif;font-size:1rem"> <p>Foodnary help you to remember all of your favorite meals!</p></div> </body>`
  };
  stmp.sendMail(mailOptions, (err, res) => {
    if (err) return err;
    return res;
  });
};
