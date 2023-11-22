const uploadFoto = require('../helpers/upload-files')
const {Router} = require('express')
const postImages = Router()
postImages.post('/upload', uploadFoto.any(), (req,res)=>{
    const foto = req.files
    console.log(foto)
})
module.exports = postImages