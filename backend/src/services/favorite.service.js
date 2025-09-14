const pool = require("../db");

class FavoriteService {
  static async getUserFavorites(userId) {
    const query = `
      SELECT w.*, TRUE as is_favorite
      FROM favorites f
      JOIN words w ON w.id = f.word_id
      WHERE f.user_id = $1
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }

  static async addFavorite(userId, wordId) {
    const query = `
      INSERT INTO favorites(user_id, word_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, word_id) DO NOTHING
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [userId, wordId]);
    return rows[0] || null;
  }

  static async removeFavorite(userId, wordId) {
    const query = `
      DELETE FROM favorites
      WHERE user_id = $1 AND word_id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [userId, wordId]);
    return rows[0] || null;
  }
}

module.exports = FavoriteService;
