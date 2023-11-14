const { Router } = require('express')
const m$user = require('../modules/user.module')
const response = require('../helpers/response')
// const db = require("../config/mysql")
const userController = Router()

//url endpoint "http://localhost:8000/api/users/userData"
userController.post('/addData', async(req, res)=>{
    const data = await m$user.addUser(req.body)
    response.sendResponse(data, res)
})
//url endpoint "http://localhost:8000/api/users/login"
userController.post('/login', async (req, res)=>{
    const data = await m$user.loginUser(req.body)
    response.sendResponse(data, res)
})

module.exports = userController