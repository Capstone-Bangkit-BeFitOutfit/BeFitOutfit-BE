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

const uploadFoto = multer({ storage: multer.memoryStorage(), fileFilter: filterFile })
module.exports = uploadFoto