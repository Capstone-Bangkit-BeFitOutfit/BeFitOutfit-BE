const {Router} = require('express')
const m$storage = require('../helpers/storage')
const m$outfit = require('../modules/outfit.module')
const uploadFoto = require('../helpers/upload-files')
const response = require('../helpers/response')
const storageController = Router()

storageController.post("/uploadFile", uploadFoto.single('file'),m$storage.uploadToGcs, async(req, res)=>{
    const data = await m$outfit.addOutfit(req)
    response.sendResponse(data, res)
})
module.exports=storageController