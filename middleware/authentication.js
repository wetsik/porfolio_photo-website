const jwt = require("jsonwebtoken")

exports.authentcation = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    console.log(token);

    if (!token) {
      return res.status(401).json({ message: "Token mavjud emas" });
    }

    const isValidToken = jwt.verify(
      token,
      "MEN SENGA BIR SIR AYTAMAN, HECH KIM BILMASIN"
      
    );
    console.log(isValidToken);
    next()
  } catch (error) {
    console.log(error.message);
    res.status(403).send("Girgittonimizda nomaqbul nuqson yuzaga keldi");
  }
};