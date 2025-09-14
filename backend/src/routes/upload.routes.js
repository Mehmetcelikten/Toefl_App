const express = require("express");
const router = express.Router();
const UploadController = require("../controllers/upload.controller");
const upload = require("../middleware/upload");

// POST /upload/audio
router.post("/audio", upload.single("file"), UploadController.uploadAudio);

module.exports = router;
