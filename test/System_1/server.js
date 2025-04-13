const express = require('express');
const { toNodeHandler } = require("better-auth/node");
const  auth  = require("./auth");
const cors = require('cors')
require('dotenv').config();
const app = express();

app.use(
    cors({
      origin: "http://localhost:5173", // Replace with your frontend's origin
      methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
      credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
  );
console.log("Auth handler:", typeof auth, auth?.handler ? "has handler" : "missing handler");
console.log(Object.keys(auth));

app.all("/api/auth/*", toNodeHandler(auth));

console.log(auth)

// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth
app.use(express.json());

const authenticate = (req, res, next) => {
    // Check if user is authenticated (e.g., by verifying a session cookie)
    if (!req.session?.user) {
      return res.redirect('/login'); // Redirect to login if not authenticated
    }
    else{
        console.log(req.session.user);
    }
    next(); // Proceed to the next handler
  };


app.get('/', authenticate, async (req, res)=>{
    res.status(201).send("hello")
})


app.listen(process.env.PORT, ()=>{
    console.log(
        `listening to port ${process.env.PORT}
http://127.0.0.1:3000/`
    )
})

// import express, { Request, Response } from 'express';
// import { toNodeHandler } from 'better-auth/node';
// import {auth} from './auth'; // Assuming you are exporting `auth` in `auth.ts`
// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();

// // CORS configuration
// app.use(
//   cors({
//     origin: 'http://localhost:5173', // Replace with your frontend's origin
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
//     credentials: true, // Allow credentials (cookies, authorization headers, etc.)
//   })
// );

// // Debug logs for the auth handler
// // console.log('Auth handler:', typeof auth, auth?.handler ? 'has handler' : 'missing handler');
// console.log(Object.keys(auth));

// // Mount Better Auth handler
// app.all('/api/auth/*', toNodeHandler(auth));

// // Mount express JSON middleware after Better Auth handler
// // or only apply it to routes that don't interact with Better Auth
// app.use(express.json());

// // Example route
// app.get('/', async (req: Request, res: Response) => {
//   res.status(201).send('hello');
// });

// // Start the server
// app.listen(process.env.PORT, () => {
//   console.log(
//     `listening to port ${process.env.PORT}
//     http://127.0.0.1:3000/`
//   );
// });