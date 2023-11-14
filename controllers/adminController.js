const {Router} = require('express')
const adminController = Router()

adminController.get('/', (req, res)=>{
    res.status(200).json({
        message: 'Welcome to Backend SI DCS'
    })})
module.exports=adminController