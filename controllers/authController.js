const m$auth = require('../modules/auth.module')
const response = require('../helpers/response')
const {Router} = require('express')
const  authController = Router()
//url endpoint "http://localhost:8000/api/login"
authController.post('/loginUser', async(req, res)=>{
    const data = await m$auth.loginUser(req.body)
    response.sendResponse(data, res)
})

module.exports = authController