const pool = require("../db");

class WordService {
  // Tüm kelimeleri getir
  static async getAll(limit = 50, offset = 0) {
    const query = `
      SELECT id, term, meaning, example, level, created_at
      FROM words
      ORDER BY id ASC
      LIMIT $1 OFFSET $2
    `;
    const { rows } = await pool.query(query, [limit, offset]);
    return rows;
  }

  // ID'ye göre kelime getir
  static async getById(id) {
    const query = `
      SELECT id, term, meaning, example, level, created_at
      FROM words
      WHERE id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }

  // Yeni kelime ekle
  static async create({ term, meaning, example, level }) {
    const query = `
      INSERT INTO words(term, meaning, example, level)
      VALUES ($1, $2, $3, $4)
      RETURNING id, term, meaning, example, level, created_at
    `;
    const values = [term, meaning, example, level];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  // Kelime güncelle
  static async update(id, { term, meaning, example, level }) {
    const query = `
      UPDATE words
      SET term = $1, meaning = $2, example = $3, level = $4
      WHERE id = $5
      RETURNING id, term, meaning, example, level, created_at
    `;
    const values = [term, meaning, example, level, id];
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }

  // Kelime sil
  static async delete(id) {
    const query = `DELETE FROM words WHERE id = $1 RETURNING id`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }

  // Rastgele kelimeler (quiz için)
  static async getRandom(count = 10) {
    const query = `
      SELECT id, term, meaning, example, level
      FROM words
      ORDER BY RANDOM()
      LIMIT $1
    `;
    const { rows } = await pool.query(query, [count]);
    return rows;
  }
}

module.exports = WordService;
