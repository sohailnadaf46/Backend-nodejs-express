// require ('dotenv').config({Path:"./env"}
// )
import dotenv from "dotenv"
import express from "express";
import connectDB from "./db/index.js";
import app from "./app.js"; 
dotenv.config({
path: "./.env"
})

connectDB()
.then(() =>{
    app.listen(process.env.PORT || 8000, () =>{
      console.log(`port is running on port ${process.env.PORT}`)
    });
})
.catch((error) =>{
  console.log("connection failed",error)
})


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