const {Router} = require('express')
const m$storage = require('../helpers/storage')
const response=require('../helpers/response')
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

storageController.post("/uploadFile", handleFile.any(), async(req, res)=>{
    const data = await m$storage.uploadToGcs(req)
    response.sendResponse(data, res);
})
module.exports=storageController