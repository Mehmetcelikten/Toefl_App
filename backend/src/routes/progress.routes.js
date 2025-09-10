const express = require("express");
const router = express.Router();
const ProgressController = require("../controllers/progress.controller");
const authMiddleware = require("../middleware/auth.middleware");


router.get("/", authMiddleware, ProgressController.getUserProgress);
router.post("/update", authMiddleware, ProgressController.updateProgress);

module.exports = router;
