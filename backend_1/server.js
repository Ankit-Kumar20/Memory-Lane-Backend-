import express from 'express';
import axios from 'axios';
import cors from 'cors';
import connection_db from './DB/DB_connection.js';
import auth from './Auth/auth.js';
import user_id from './API_backend/user_id.js'
import { toNodeHandler } from 'better-auth/node';
import audio_upload from './routes/upload_audio.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express()

app.use(
    cors({
      origin: "http://localhost:5173", // Replace with your frontend's origin
      methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
      credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
);

console.log("Auth handler:", typeof auth, auth?.handler ? "has handler" : "missing handler");
console.log(Object.keys(auth));
console.log(typeof(auth))

app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json())
app.use('/api', user_id)

connection_db();

app.use('/audio', audio_upload)

app.get('/', async function (req, res) {
    res.status(201).send("hello")
})

app.listen(process.env.PORT, ()=>{
    console.log(
        `listening to port ${process.env.PORT}
http://127.0.0.1:3000/`
    )
})