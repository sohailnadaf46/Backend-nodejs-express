// require ('dotenv').config({Path:"./env"}
// )
import dotenv from "dotenv"
import express from "express";
import connectDB from "./db/index.js";
const app =express();

dotenv.config({
path: "./env"
})

connectDB();


//first approach 1: connecting database in the main file of index js

// (async() =>{
//   try {
//      await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//      app.on("error", (error) =>{
//       console.log(error, "errror");
//       throw error

//       app.listen(process.env.PORT, () =>{
//         console.log(`app is listening on port ${process.env.PORT}`)
//       })
//      })
    
//   } catch (error) {
//     console.log(error, "errror occured")
    
//   }
// })()