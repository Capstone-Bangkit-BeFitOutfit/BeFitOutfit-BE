const authController = require('./controllers/authController')
const userController = require("./controllers/userController")
const postImagesController = require('./controllers/postImagesController')
const adminController = require("./controllers/adminController")
const storageController = require('./controllers/storageController')
// const routes = (app)=>{
//     app.use('/api', userController)
// }
const _routes=[
    ['', authController],
    ['user', userController],
    ['postImages', postImagesController],
    ['admin', adminController],
    ['storage', storageController]
]
const routes= (app)=>{
    _routes.forEach((route)=>{
        const [url, controller] = route
        app.use(`/${url}`, controller)
    })
}
module.exports=routes