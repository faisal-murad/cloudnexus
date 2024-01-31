import dotenv from 'dotenv/config.js';
import express from "express";
import { connect } from "./database/connection.js";
import jwt from "jsonwebtoken";
import path from "path"
import { fileURLToPath } from "url";
const _filename = fileURLToPath(import.meta.url); 
import cron from 'node-cron'
import morgan from "morgan";
import cors from "cors";
import userRouter from "./routes/user.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import bodyParser from 'body-parser';
import './auth.js'
import passport from 'passport';
import session from 'express-session'
import { getAllUsersAndServers, login } from './controllers/user.js';
import User from './database/modals/user.js';

// import multer from 'multer';
// const upload = require("./routes/categoryRoute.js");
// const Grid = require('gridfs-stream'); 


function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

const app = express();
// setup file path
const _dirname = path.dirname(_filename);
console.log("directory-name--> ", _dirname);

// create express app

// middleware to parse JSON request bodies
// app.use(express.text());
app.use(express.json());
app.use(express.text());
app.use(morgan("dev"));
app.use(cors());
app.use(express.static("public"));
app.use(errorHandler);

// app.use('/file',upload);
// app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// Configure express-session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

//create database connection
connect();

app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
})

app.get('/auth/google/',
    passport.authenticate('google', { scope: ['email', 'profile'] })
)

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/protected',
        failureRedirect: '/failure'
    })
);

app.get('/auth/failure', (req, res) => {
    res.send('something went wrong..');
});

app.get('/protected', isLoggedIn, async (req, res) => {



    // Data to send to the login API 
    // Add the necessary data for login, such as email and password 


    // console.log('loginData = ', loginData);

    try {
        // Call the handleLogin function
        let user = await User.findOne({ googleId: req.user._json.sub });

        // If user doesn't exist, create a new one
        if (!user) {
            user = new User({
                user_id: user._id,
                googleId: req.user._json.sub,
                firstname: req.user._json.given_name,
                lastname: req.user._json.family_name,
                email: req.user._json.email,
                picture: req.user._json.picture
            });
            await user.save();
        }

        // Generate JWT token 
        // const token = jwt.sign({ userId: user._id }, 'secret_key', {
        //     expiresIn: '1h'
        // });

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: '1h'
        });

        // res.redirect(`http://localhost:5500/frontend/index.html?token=${req.user.sub}`);
        res.redirect(`http://localhost:5500/frontend/index.html?user_id=${token}`);

    } catch (error) {
        console.error("Login failed:", error);

    }

    // // Configuration for the fetch request
    // const fetchOptions = {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         // Add any other headers if required
    //     },
    //     body: JSON.stringify(loginData), // Convert data to JSON string
    // };

    // // Make the fetch request to the login API
    // fetch(login, fetchOptions)
    //     .then(response => {
    //         // Check if response is successful
    //         console.log(response.user);
    //         if (!response.ok) {
    //             throw new Error('Failed to login');
    //         } 


    //         res.redirect(`http://localhost:5500/frontend/index.html?user_id=${req.user.sub}`);
    //     })
    //     .catch(error => {
    //         // Handle errors
    //         console.error('Login error:', error);
    //         res.status(500).send('Failed to login');
    //     });
})

// API Routes
app.get("/status", (req, res, next) => {
    res.status(200).json({ message: "server is connected" });
});

// await getAllUsersAndServers()0;
// Schedule the getAllUsersAndServers function to run every 10 minutes
cron.schedule('* * * * *', getAllUsersAndServers);

// use the userRouter for the '/auth' path
app.use("/api/user", userRouter);

// start server
const PORT = process.env.PORT;
app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${PORT} port`);
});
console.log(`Server is running on ${PORT} port`);