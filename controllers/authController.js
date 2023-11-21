const m$auth = require('../modules/auth.module')
const response = require('../helpers/response')
const {Router} = require('express')
const  authController = Router()
//url endpoint "http://localhost:8000/login"
authController.post('/login', async(req, res)=>{
    const data = await m$auth.login(req.body)
    response.sendResponse(data, res)
})
//url endpoint "http://localhost:8000/register"
authController.post('/register', async(req, res)=>{
    const data = await m$auth.register(req.body)
    response.sendResponse(data, res)
})


module.exports = authController