const express = require("express");
const app = express();
const cors = require("cors");

// Middleware
app.use(cors());
app.use(express.json());

// Статическая папка для uploads
app.use("/uploads", express.static("uploads"));

// Импорт маршрутов
const userRouter = require("./routes/userRoutes");
const photoRouter = require("./routes/photoRoutes"); // Исправлена опечатка
const likeRouter = require("./routes/likeRoutes");

// Использование маршрутов
app.use("/", userRouter);
app.use("/photos", photoRouter);
app.use("/like", likeRouter);

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi");
});

// Запуск сервера
const port = process.env.PORT || 4000; // Используем порт из переменной окружения или 4000
app.listen(port, () => {
  console.log(`Server ${port}-portda ishga tushdi`);
});