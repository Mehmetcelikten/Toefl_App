const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Upload klasörü yoksa oluştur
const uploadDir = path.join(__dirname, "..", "uploads", "audio");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".m4a";
    cb(null, `audio_${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
