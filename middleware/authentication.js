const jwt = require("jsonwebtoken");

exports.authentication = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    console.log("Получен токен:", token);

    if (!token) {
      return res.status(401).json({ message: "Token mavjud emas" });
    }

    const isValidToken = jwt.verify(
      token,
      "MEN SENGA BIR SIR AYTAMAN, HECH KIM BILMASIN"
    );
    console.log("Проверенный токен:", isValidToken);
    next();
  } catch (error) {
    console.error("Ошибка авторизации:", error.message, error.stack);
    res.status(403).send("Girgittonimizda nomaqbul nuqson yuzaga keldi");
  }
};