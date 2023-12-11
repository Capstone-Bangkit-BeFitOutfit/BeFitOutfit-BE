const express = require('express')
const cors = require('cors');
const routes = require('./routes');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.get('/', async (req, res) => {
    res.status(200).json({
        message: 'Welcome to BeFitOutfit'
    })
})
 routes(app)

app.listen(port,()=>{
    console.log(`Your application running in http://localhost:${port}`)
})