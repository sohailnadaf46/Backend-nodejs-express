import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" })); //this is used to allow the backend to recieve data i.e json

app.use(express.urlencoded({ extended: true, limit: "20kb" })); //this is used to allow the backend to recive the data from URL

app.use(express.static("public")); //this allows the backend to store particular assets

app.use(cookieParser()); //setting up the cookies

//routes
//since you have sqeperated the router in another folder to get the router here you have to use .use instead of get, put etc

//routes imports
import userRouter from "./routes/user.router.js";

//routes declaration 

app.use("/api/v1/users", userRouter);


export default app;
