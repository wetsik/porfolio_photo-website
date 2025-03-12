const express = require('express');
const { getPhotos, addPhoto, deletePhoto, myPhotos } = require('../controllers/photoController');
const { authentcation } = require('../middleware/authentication');
const uploadMiddleware = require('../middleware/uploadMiddlewere');
const photoRouter = express.Router();

photoRouter.get('/', authentcation, getPhotos);
photoRouter.get('/:userId', authentcation, myPhotos);
photoRouter.post('/', authentcation, uploadMiddleware, addPhoto);
photoRouter.delete('/:id', authentcation, deletePhoto);

module.exports = photoRouter;