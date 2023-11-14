const userController = require("./controllers/userController")
const adminController = require("./controllers/adminController")
// const routes = (app)=>{
//     app.use('/api', userController)
// }
const _routes=[
    ['users', userController],
    ['admin', adminController]
]
const routes= (app)=>{
    _routes.forEach((route)=>{
        const [url, controller] = route
        app.use(`/api/${url}`, controller)
    })
}
module.exports=routes