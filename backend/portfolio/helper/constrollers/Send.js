const { sendEmail } = require("../mailer");

exports.Send = (req, res) => {
  const { email, title, message } = req.body;
  try {
    if (email && title && message) {
      sendEmail(email, title, message);
      res.status(200).json({
        response: {
          message: " successful!"
        }
      });
    } else {
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
