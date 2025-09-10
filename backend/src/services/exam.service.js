const pool = require("../db");

class ExamService {
  // GET /exams?type=reading|listening
  static async getAll(type) {
    if (type) {
      const { rows } = await pool.query(
        `SELECT id, type, title, time_seconds, created_at
         FROM exams
         WHERE type = $1
         ORDER BY id ASC`,
        [type]
      );
      return rows;
    }

    const { rows } = await pool.query(
      `SELECT id, type, title, time_seconds, created_at
       FROM exams
       ORDER BY id ASC`
    );
    return rows;
  }

  static async getById(id) {
    const { rows } = await pool.query("SELECT * FROM exams WHERE id = $1", [id]);
    return rows[0] || null;
  }

  static async submit(examId, userId, answers) {
    if (!answers || !Array.isArray(answers)) {
      throw new Error("Answers must be an array");
    }

    // Exam sorularını getir
    const { rows } = await pool.query("SELECT * FROM exams WHERE id = $1", [examId]);
    const exam = rows[0];
    if (!exam) return null;

    // JSONB parse (string dönebilir)
    const questions =
      typeof exam.questions === "string"
        ? JSON.parse(exam.questions)
        : exam.questions;

    let rawScore = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.answerIndex) {
        rawScore++;
      }
    });

    const maxScore = questions.length;
    const scaledScore = Math.round((rawScore / maxScore) * 30); // 0–30 ölçeği

    // scores tablosuna kaydet
    const { rows: scoreRows } = await pool.query(
      `INSERT INTO scores(user_id, exam_id, type, raw_score, max_score, scaled_score) 
       VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [userId, examId, exam.type, rawScore, maxScore, scaledScore]
    );

    return {
      exam_id: examId,
      user_id: userId,
      raw_score: rawScore,
      max_score: maxScore,
      scaled_score: scaledScore,
      saved_score: scoreRows[0],
    };
  }
}

module.exports = ExamService;
