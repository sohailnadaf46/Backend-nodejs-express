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

app.use(cookieParser); //setting up the cookies

export default app;
