const pool = require("../config/db");
const jwt = require("jsonwebtoken");

exports.addPhoto = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId talab qilinadi" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Fayl yuklanmadi" });
    }

    const filepath = req.file.path;
    console.log("Добавление фото:", { userId, filepath });

    const result = await pool.query(
      "INSERT INTO photos (filepath, userId) VALUES ($1, $2) RETURNING *",
      [filepath, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Ошибка в addPhoto:", error.message, error.stack);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi");
  }
};

exports.myPhotos = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("Получен userId для myPhotos:", userId);

    if (!userId) {
      return res.status(400).json({ message: "userId talab qilinadi" });
    }

    const result = await pool.query(
      `SELECT 
          photos.id, 
          photos.filepath,   
          users.firstname,  
          users.lastname,  
          COUNT(likes.photoId) AS likeCount,
          EXISTS (
              SELECT 1 FROM likes WHERE likes.photoId = photos.id AND likes.userId = $1
          ) AS isLikes
      FROM photos
      INNER JOIN users ON photos.userId = users.id
      LEFT JOIN likes ON likes.photoId = photos.id
      WHERE photos.userId = $1
      GROUP BY photos.id, users.id, users.firstname, users.lastname`,
      [userId]
    );

    console.log("Результат запроса myPhotos:", result.rows);

    const photos = result.rows.map(photo => {
      return { ...photo, url: 'https://portfolio-photo-website-1.onrender.com/' + photo.filepath };
    });

    res.status(200).json(photos);
  } catch (error) {
    console.error("Ошибка в myPhotos:", error.message, error.stack);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi");
  }
};

exports.getPhotos = async (req, res) => {
  try {
    const { userId } = req.query;

    console.log("Получен userId для getPhotos:", userId);

    if (!userId) {
      return res.status(400).json({ message: "userId talab qilinadi" });
    }

    const result = await pool.query(
      `SELECT 
          photos.id, 
          photos.filepath,   
          users.firstname,  
          users.lastname,  
          COUNT(likes.photoId) AS likeCount,
          EXISTS (
              SELECT 1 FROM likes WHERE likes.photoId = photos.id AND likes.userId = $1
          ) AS isLikes
      FROM photos
      INNER JOIN users ON photos.userId = users.id
      LEFT JOIN likes ON likes.photoId = photos.id
      GROUP BY photos.id, users.id, users.firstname, users.lastname`,
      [userId]
    );

    console.log("Результат запроса getPhotos:", result.rows);

    const photos = result.rows.map(photo => {
      return { ...photo, url: 'https://portfolio-photo-website-1.onrender.com/' + photo.filepath };
    });

    res.status(200).json(photos);
  } catch (error) {
    console.error("Ошибка в getPhotos:", error.message, error.stack);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi");
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    const { id } = req.params;

    console.log("Удаление фото, id:", id, "token:", token);

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    jwt.verify(token, "MEN SENGA BIR SIR AYTAMAN, HECH KIM BILMASIN");

    const del = await pool.query("DELETE FROM photos WHERE id = $1", [id]);

    console.log("Результат удаления:", del.rowCount);

    res.status(200).json({
      message: "Rasm o'chirildi",
    });
  } catch (error) {
    console.error("Ошибка в deletePhoto:", error.message, error.stack);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi");
  }
};