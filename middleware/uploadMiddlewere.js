const multer = require("multer");
const path = require("path");

// Настройка хранилища
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/")); // Абсолютный путь
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

const uploadMiddleware = upload.single("photo");

module.exports = uploadMiddleware;