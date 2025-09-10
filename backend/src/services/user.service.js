const pool = require("../db");

class UserService {
  // Yeni kullanıcı oluştur
  static async create({ email, password_hash, display_name }) {
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, display_name)
       VALUES ($1, $2, $3)
       RETURNING id, email, display_name`,
      [email, password_hash, display_name]
    );
    return result.rows[0];
  }

  // Email ile kullanıcı bul
  static async findByEmail(email) {
    const result = await pool.query(
      `SELECT id, email, password_hash, display_name
       FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  }

  // ID ile kullanıcı bul
  static async findById(id) {
    const result = await pool.query(
      `SELECT id, email, display_name
       FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }
}

module.exports = UserService;
