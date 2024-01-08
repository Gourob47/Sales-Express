const app = require("./app");

//import dotenv
const dotenv=require("dotenv");

//use dotenv
dotenv.config({path:'./config.env'});

app.listen(process.env.RUNNING_PORT,()=>{
    console.log(`Server Listion on Port ${process.env.RUNNING_PORT}`);
})