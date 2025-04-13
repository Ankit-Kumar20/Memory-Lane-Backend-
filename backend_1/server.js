const express = require('express')
const axios = require('axios')
const cors = require('cors')
const connection_db = require('./DB/DB_connection')
const auth = require('./Auth/auth')
const { toNodeHandler } = require("better-auth/node");
const audio_upload = require('./routes/upload_audio')
require('dotenv').config()

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

app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json())

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