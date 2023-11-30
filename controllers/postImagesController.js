const uploadFoto = require('../helpers/upload-files')
const {Router} = require('express')
const postImages = Router()
postImages.post('/upload', uploadFoto.any(), (req,res)=>{
    const foto = req.files
    const username = req.body.username
    const event = req.body.event
    console.log(foto)
    console.log(username)
    console.log(event)
})
module.exports = postImages