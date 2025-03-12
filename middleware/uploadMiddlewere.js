//* Модуль для работы с медиафайлами (фотографиями)
const  multer = require('multer')

//* Настройка хранилища для загруженных фотографий
const storage = multer.diskStorage({
    //* Сохранение файла в папку uploads    
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    //* Переименование файла при сохранении
    filename: (req, file,cb) => {
        cb(null, Date.now() + "_" + file.originalname)
    }
})

//* Экспортируем middleware для загрузки фотографий
const upload = multer({ storage })

//* Экспортируем middleware для загрузки одной фотографии (single('photo'))
const uploadMiddleware = upload.single('photo')

//* Экспортируем экземпляр медиафайлового хранилища
module.exports = uploadMiddleware;