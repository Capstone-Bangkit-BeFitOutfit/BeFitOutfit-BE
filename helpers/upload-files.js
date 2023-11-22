const multer = require('multer')

const filterFile = (req, file, cb) => {
    if (file.mimetype.includes("jpg") || file.mimetype.includes("png")|| file.mimetype.includes("jpeg")) {
        cb(null, true);
    } else {
        cb(null, false);
        return {
            status: false,
            code: 404
        }
    }
}

const multerDiskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './assets')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})
const uploadFoto = multer({ storage: multerDiskStorage, fileFilter: filterFile })
module.exports = uploadFoto