const mysql = require('mysql')

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"",
    database:"percobaan"
})

con.connect((err)=>{
    if (err)throw err
    console.log("Database has connected")

})
module.exports = con