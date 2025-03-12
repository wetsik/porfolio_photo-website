const express = require("express");
const { signup, login, getUsers } = require("../controllers/userController");
const router = express.Router();

router.get("/users", getUsers);
router.post("/signup", signup);
router.post("/login", login);

module.exports = userRouter; // Исправлено на userRouter