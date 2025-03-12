const pool = require("../config/db");

exports.likes = async (req, res) => {
  try {
    const { userId, photoId } = req.body;

    if (!userId || !photoId) {
      return res.status(400).json({ message: "userId va photoId talab qilinadi" });
    }

    // Проверяем, есть ли уже лайк
    const isLiked = await pool.query(
      "SELECT * FROM likes WHERE userId = $1 AND photoId = $2",
      [userId, photoId]
    );

    if (isLiked.rows.length > 0) {
      await pool.query("DELETE FROM likes WHERE userId = $1 AND photoId = $2", [
        userId,
        photoId,
      ]);
      return res.status(200).json({ message: "Like o`chirildi", isLiked: false });
    }

    // Добавляем новый лайк
    await pool.query(
      "INSERT INTO likes (userId, photoId) VALUES ($1, $2) RETURNING *",
      [userId, photoId]
    );

    res.status(201).json({ message: "Like qilindi", isLiked: true });
  } catch (error) {
    console.error("Ошибка в likes:", error.message, error.stack);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi");
  }
};