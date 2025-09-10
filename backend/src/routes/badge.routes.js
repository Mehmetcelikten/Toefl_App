const express = require("express");
const router = express.Router();
const BadgeController = require("../controllers/badge.controller");
const authMiddleware = require("../middleware/auth.middleware");


router.get("/", authMiddleware, BadgeController.getUserBadges);

module.exports = router;
