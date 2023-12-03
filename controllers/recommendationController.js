const {Router}=require('express')
const m$recommendation = require('../modules/recommendation.module')
const response = require('../helpers/response')
const recommendationController = new Router()
recommendationController.get('', async(req, res)=>{
    const data = await m$recommendation.getRecommendation(req)
    response.sendResponse(data, res)
})
module.exports = recommendationController