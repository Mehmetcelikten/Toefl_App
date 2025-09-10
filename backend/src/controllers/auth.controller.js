const UserService = require("../services/user.service");
const { hashPassword, verifyPassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");

class AuthController {
  // POST /auth/register
  static async register(req, res, next) {
    try {
      const { email, password, display_name } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      // email mevcut mu?
      const existing = await UserService.findByEmail(email);
      if (existing) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // şifre hashle
      const password_hash = await hashPassword(password);

      // kullanıcıyı oluştur
      const user = await UserService.create({
        email,
        password_hash,
        display_name,
      });

      // token oluştur
      const token = generateToken({ id: user.id, email: user.email });

      return res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          display_name: user.display_name,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  // POST /auth/login
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const user = await UserService.findByEmail(email);
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // şifre kontrolü
      const valid = await verifyPassword(password, user.password_hash);
      if (!valid) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // token oluştur
      const token = generateToken({ id: user.id, email: user.email });

      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          display_name: user.display_name,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /auth/me
  static async me(req, res, next) {
    try {
      // auth.middleware.js, req.user içine token bilgisini koyacak
      const user = await UserService.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({
        id: user.id,
        email: user.email,
        display_name: user.display_name,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
