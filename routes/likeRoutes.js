const express = require("express");
const { likes } = require("../controllers/likeController");
const { authentication } = require("../middleware/authentication");
const router = express.Router();

router.post("/", authentication, likes);

module.exports = likeRouter;