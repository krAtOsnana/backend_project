//require('dotenv').config({path: './env'})

import dotenv from 'dotenv'
dotenv.config({
    path:'./env'
})

import connectDB from "./db/index.js";
connectDB().then(() => {
    
    app.on("error",() => {
        console.log(`on Listening Error: ${error}`);
        throw error;
    })
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running on port: ${process.env.PORT}`);
    }) 
}).catch((err) => {
    console.log("mongodb connection error!!!",err);
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