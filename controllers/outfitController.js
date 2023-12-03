const {Router} = require('express')
const uploadFoto = require('../helpers/upload-files')
const m$storage = require('../helpers/storage')
const m$outfit = require('../modules/outfit.module')
const middleware = require('../helpers/midleware')
const response = require('../helpers/response')
const outfitController = new Router()
outfitController.post('/add', middleware,uploadFoto.single('photo'), m$storage.uploadToGcs, async(req, res)=>{
    // console.log(req.file)
    const data = await m$outfit.addOutfit(req)
    response.sendResponse(data, res)
})


module.exports=outfitController