const {Router} = require('express')
const m$storage = require('../helpers/storage')
const multer = require('multer')
const storageController = Router()
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
const handleFile = multer({storage:multer.memoryStorage(),fileFilter:filterFile})

storageController.post("/uploadFile", handleFile.single('file'),m$storage.uploadToGcs, async(req, res)=>{
    console.log(req.file.originalname)
})
module.exports=storageController