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
//url endpoint "http://localhost:8000/api/users/updateUser"
userController.post('/updateUser', async(req, res)=>{
    const data = await m$user.updateUser(req.body)
    response.sendResponse(data, res)
})
module.exports = userController