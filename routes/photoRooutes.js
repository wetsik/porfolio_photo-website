const express = require("express");
const { addPhoto, myPhotos, getPhotos, deletePhoto } = require("../controllers/photoController");
const { authentication } = require("../middleware/authentication");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const router = express.Router();

router.post("/add", authentication, uploadMiddleware, addPhoto);
router.get("/my-photos/:userId", authentication, myPhotos);
router.get("/all", authentication, getPhotos);
router.delete("/:id", authentication, deletePhoto);

module.exports = router;