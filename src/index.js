//require('dotenv').config({path: './env'})

import dotenv from 'dotenv'

import connectDB from "./db/index.js";
connectDB();

dotenv.config({
    path:'./env'
})







































































//generally ; are used before starting iffe, only for cleaning purposes
// import  express  from "express";
// const app= express()

// ;( async () => {
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//        app.on("error", (error ) => {
//         console.log("ERROR: ",error);
//         throw error
//        })
//        app.listen(process.env.PORT, ( ) => {
//         console.log("app is listening on PORT: ", process.env.PORT);
//        })
//     } catch (error) {
//         console.error("ERROR: ",error)
//     }
// })()