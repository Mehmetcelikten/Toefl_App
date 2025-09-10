const WordService = require("../services/word.service");

class WordController {
  // GET /words
  static async getAll(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;
      const words = await WordService.getAll(limit, offset);
      return res.json(words);
    } catch (err) {
      next(err);
    }
  }

  // GET /words/:id
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const word = await WordService.getById(id);
      if (!word) {
        return res.status(404).json({ error: "Word not found" });
      }
      return res.json(word);
    } catch (err) {
      next(err);
    }
  }

  // POST /words
  static async create(req, res, next) {
    try {
      const { term, meaning, example, level } = req.body;

      if (!term || !meaning) {
        return res.status(400).json({ error: "Term and meaning are required" });
      }

      const newWord = await WordService.create({
        term,
        meaning,
        example,
        level,
      });

      return res.status(201).json(newWord);
    } catch (err) {
      next(err);
    }
  }

  // PUT /words/:id
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { term, meaning, example, level } = req.body;

      const updatedWord = await WordService.update(id, {
        term,
        meaning,
        example,
        level,
      });

      if (!updatedWord) {
        return res.status(404).json({ error: "Word not found" });
      }

      return res.json(updatedWord);
    } catch (err) {
      next(err);
    }
  }

  // DELETE /words/:id
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await WordService.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: "Word not found" });
      }

      return res.json({ success: true, id: deleted.id });
    } catch (err) {
      next(err);
    }
  }

  // GET /words/random?count=10
  static async getRandom(req, res, next) {
    try {
      const count = parseInt(req.query.count) || 10;
      const words = await WordService.getRandom(count);
      return res.json(words);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = WordController;
