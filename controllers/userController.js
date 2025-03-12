const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Ошибка в getUsers:", error.message, error.stack);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi");
  }
};

exports.signup = async (req, res) => {
  try {
    const { firstname, lastname, username, password } = req.body;

    if (!firstname || !lastname || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const test = await pool.query(
      "SELECT * FROM users WHERE username = $1 LIMIT 1",
      [username]
    );

    if (test.rows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO users (firstname, lastname, username, password) VALUES ($1, $2, $3, $4) RETURNING *`,
      [firstname, lastname, username, encryptedPassword]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.error("Ошибка в signup:", error.message, error.stack);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi");
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 LIMIT 1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Incorrect username or password" });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Incorrect username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      "MEN SENGA BIR SIR AYTAMAN, HECH KIM BILMASIN",
      { expiresIn: "30m" }
    );

    res.status(200).json({ user, token });
  } catch (error) {
    console.error("Ошибка в login:", error.message, error.stack);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi");
  }
};