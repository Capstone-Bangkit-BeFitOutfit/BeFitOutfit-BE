const express = require('express')
const cors = require('cors');
const routes = require('./routes');
const morgan = require('morgan');
const db = require('./config/mysql')
// const userController = require('./userController')
const app = express();
const port = 8000;

app.use(cors());
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/', async (req, res) => {
    res.status(200).json({
        message: 'Welcome to Backend SI DCS'
    })
})
// app.use('/login', userController)
 routes(app)

app.listen(port,()=>{
    console.log(`Your application running in http://localhost:${port}`)
})