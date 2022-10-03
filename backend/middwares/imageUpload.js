/* check if the image meet the requirements */
const fs = require("fs");
module.exports = async function (req, res, next) {
  try {
    /* Objects.value() to make an array of the obj, then use falt to remove the 'dubble' array   */
    if (!req.files || Object.values(req.files).flat().length === 0) {
      return res
        .status(200)
        .json({ message: "no files selected", success: true });
    }

    if (Object.values(req.files).flat().length >= 2) {
      return res
        .status(200)
        .json({ message: "select only one file", success: true });
    }

    let files = Object.values(req.files).flat();

    files.forEach((file) => {
      if (file.mimetype.substr(0,5) !== "image") {
        removeTmp(file.tempFilePath);
        throw new Error("Error! unsupported fromat") 
      }

      /* 1024 * 1024 = 1 megabyte  */
      if (file.size > 1024 * 1024 ) {
        removeTmp(file.tempFilePath);
        throw new Error("Error! file size it too large") 
      }
    });

    next();
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};
