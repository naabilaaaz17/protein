const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/familyCard");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + "." + ext);
  },
});

const upload = multer({ storage });
module.exports = upload;
