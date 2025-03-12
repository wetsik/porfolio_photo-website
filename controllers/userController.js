const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi");
  }
};

exports.signup = async (req, res) => {
  try {
    const { firstname, lastname, username, password } = req.body;

    const test = await pool.query(
      `SELECT * FROM users WHERE username = '${username}' LIMIT 1`
    );

    if (test.rows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `insert into users( firstname, lastname, username, password ) values($1, $2, $3, $4) returning *`,
      [firstname, lastname, username, encryptedPassword]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi");
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      `SELECT * FROM users WHERE username = $1 LIMIT 1`,
      [username]
    );
    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }
    
    //* Пароль проверяется с помошью bycript 
    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    //* Если пароль не правельный
    if (!isValidPassword) {
      return res
       .status(401)
       .json({ message: "Incorrect username or password" });
    }

    //* Генерация токена
    const token = jwt.sign(
      { id: user.id, username: user.username },
      "MEN SENGA BIR SIR AYTAMAN, HECH KIM BILMASIN",
      { expiresIn: "30m"}
    );

    //* Если пароль и логин правельные
    res.status(200).json({ user , token });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi");
  }
};
