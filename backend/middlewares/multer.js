const multer = require("multer");
const uuid = require("uuid");

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "uploads");
  },
  filename(req, file, callback) {
    const id = uuid.v4();
    const extName = file.originalname.split(".").pop();
    callback(null, `${id}.${extName}`);
  },
});

const fileUpload = multer({ storage });

module.exports.multiUpload = fileUpload.fields([
    {name: "photo", maxCount: 1},
    {name: "certifications", maxCount: 1}
]);