const pool = require("../config/db");
const jwt = require("jsonwebtoken");

exports.addPhoto = async (req, res) => {
  try {
    const { userId } = req.body;
    const filepath = req.file.path;
    const result = await pool.query(
      "INSERT INTO photos (filepath, userId) VALUES ($1, $2) RETURNING *",
      [filepath, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi");
  }
};

exports.myPhotos = async (req, res) => {
  try {
    const { userId } = req.params;

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
              SELECT 1 FROM likes WHERE likes.userId = $1 AND likes.photoId = photos.id
          ) AS isLikes
      FROM photos
      LEFT JOIN likes ON likes.photoId = photos.id
      INNER JOIN users ON photos.userId = users.id
      WHERE photos.userId = $1  -- Add this line to filter by the user's photos
      GROUP BY photos.id, users.id;`,
      [userId]
    );

    const photos = result.rows.map(photo => {
      return {...photo, url: 'http://localhost:4000/' + photo.filepath}
    })

    res.status(200).json(photos);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi");
  }
};

exports.getPhotos = async (req, res) => {
  try {
    const { userId } = req.query;

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
              SELECT 1 FROM likes WHERE likes.userId = $1 AND likes.photoId = photos.id
          ) AS isLikes
      FROM photos
      LEFT JOIN likes ON likes.photoId = photos.id
      INNER JOIN users ON photos.userId = users.id
      GROUP BY photos.id, users.id;`,
      [userId]
    );

    const photos = result.rows.map(photo => {
      return {...photo, url: 'http://localhost:4000/' + photo.filepath}
    })

    res.status(200).json(photos);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi");
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    const { id } = req.params;

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }
    jwt.verify(token, "MEN SENGA BIR SIR AYTAMAN, HECH KIM BILMASIN");
    const del = await pool.query("DELETE FROM photos WHERE id = $1", [id]);

    res.status(200).json({
      message: "Rasm o'chirildi",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi");
  }
};
