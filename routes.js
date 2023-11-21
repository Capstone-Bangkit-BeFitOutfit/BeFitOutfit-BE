const userController = require("./controllers/userController")
const adminController = require("./controllers/adminController")
const authController = require('./controllers/authController')
// const routes = (app)=>{
//     app.use('/api', userController)
// }
const _routes=[
    ['', authController],
    ['users', userController],
    ['admin', adminController]
]
const routes= (app)=>{
    _routes.forEach((route)=>{
        const [url, controller] = route
        app.use(`${url}`, controller)
    })
}
module.exports=routes