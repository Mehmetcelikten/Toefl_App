const pool = require("../db");

class SpeakingService {
  static async getPrompts() {
    const { rows } = await pool.query(
      "SELECT * FROM speaking_prompts ORDER BY id ASC"
    );
    return rows;
  }

  static async getPromptById(id) {
    const { rows } = await pool.query(
      "SELECT * FROM speaking_prompts WHERE id=$1",
      [id]
    );
    return rows[0] || null;
  }

  static async createAttempt(data) {
    // feedback objeyse stringe çevir
    const feedbackJson =
      typeof data.feedback_json === "object"
        ? JSON.stringify(data.feedback_json)
        : data.feedback_json;

    const { rows } = await pool.query(
      `INSERT INTO speaking_attempts 
       (user_id, prompt_id, audio_key, transcript, wpm,
        score_fluency, score_pronunciation, score_grammar,
        score_vocabulary, score_task, scaled_score, feedback_json) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) 
       RETURNING *`,
      [
        data.user_id,
        data.prompt_id,
        data.audio_key,
        data.transcript,
        data.wpm,
        data.score_fluency,
        data.score_pronunciation,
        data.score_grammar,
        data.score_vocabulary,
        data.score_task,
        data.scaled_score,
        feedbackJson,
      ]
    );

    const attempt = rows[0];

    // scores tablosuna da kaydet (skilller arası tutarlılık için)
    await pool.query(
      `INSERT INTO scores (user_id, exam_id, type, raw_score, max_score, scaled_score) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        data.user_id,
        data.prompt_id, // burada prompt_id'yi exam_id gibi kaydediyoruz
        "speaking",
        null, // raw_score yok
        null, // max_score yok
        data.scaled_score,
      ]
    );

    return attempt;
  }

  static async getAttemptsByUser(userId) {
    const { rows } = await pool.query(
      `SELECT sa.*, sp.title, sp.task_type
       FROM speaking_attempts sa
       JOIN speaking_prompts sp ON sa.prompt_id = sp.id
       WHERE sa.user_id=$1
       ORDER BY sa.taken_at DESC`,
      [userId]
    );
    return rows;
  }
}

module.exports = SpeakingService;
