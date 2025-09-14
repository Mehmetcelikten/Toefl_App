class UploadController {
  // POST /upload/audio
  static async uploadAudio(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Burada DB'ye kaydetmek istersen: req.file.filename
      return res.status(201).json({
        message: "Audio uploaded successfully",
        audio_key: `audio/${req.file.filename}`, // client için geri dönen key
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UploadController;
