const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");


// Kullanıcı kayıt
// Body: { email, password, display_name }
router.post("/register", AuthController.register);

// Kullanıcı giriş
// Body: { email, password }
router.post("/login", AuthController.login);

// Giriş yapan kullanıcının profilini getir
// Header: Authorization: Bearer <token>
router.get("/me", authMiddleware, AuthController.me);

module.exports = router;
