import dotenv from 'dotenv/config.js';
import express from "express";
import { connect } from "./database/connection.js";
import path from"path"
import { fileURLToPath } from "url";
const _filename = fileURLToPath(import.meta.url);
import morgan from "morgan";
import cors from "cors"; 
import userRouter from "./routes/user.js"; 
import { errorHandler } from "./middlewares/errorMiddleware.js";
import categoryRouter from "./routes/categoryRoute.js"
import productRouter from "./routes/productRoute.js"  
// import multer from 'multer';
// const upload = require("./routes/categoryRoute.js");
// const Grid = require('gridfs-stream'); 

const app = express();
// setup file path
const _dirname = path.dirname(_filename);
console.log("directory-name--> ", _dirname);

// create express app

// middleware to parse JSON request bodies
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(express.static("public"));
app.use(errorHandler);

// app.use('/file',upload);
 
 
//create database connection
connect();

// API Routes
app.get("/status" , (req, res, next) => {
    res.status(200).json({ message: "server is connected"});
});

// use the userRouter for the '/auth' path
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter); 

// start server
const PORT = process.env.PORT;
app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on ${PORT} port`);
});
console.log(`Server is running on ${PORT} port`);