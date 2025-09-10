const pool = require("../db");

class WritingService {
  static async createAttempt(data) {
    const { rows } = await pool.query(
      `INSERT INTO writing_attempts
       (user_id, question, response, score_content, score_grammar, score_vocabulary, feedback)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [
        data.user_id,
        data.question,
        data.response,
        data.score_content || null,
        data.score_grammar || null,
        data.score_vocabulary || null,
        data.feedback || null,
      ]
    );
    return rows[0];
  }

  static async getAttemptsByUser(userId) {
    const { rows } = await pool.query(
      `SELECT * FROM writing_attempts
       WHERE user_id=$1
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async getAttemptById(id) {
    const { rows } = await pool.query(
      "SELECT * FROM writing_attempts WHERE id=$1",
      [id]
    );
    return rows[0] || null;
  }
}

module.exports = WritingService;
