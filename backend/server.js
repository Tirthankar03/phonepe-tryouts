// const express = require("express");

// const app =  express();

// const port= 5000;

// const cors = require("cors");

// app.use(express.json());

// app.use(cors());

// // Phone Pe Route
// const phonepeRoute = require("./routes/PhonePeRoute")


// app.use("/api/phonepe", phonepeRoute);

// // Starting Server

// app.listen(port, () => {
// console.log(`Example app listening on port ${port}`);
// });

import express from 'express';
import cors from 'cors';
import phonepeRoute from './routes/PhonePeRoute.js';

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

// Phone Pe Route
app.use("/api/phonepe", phonepeRoute);

// Starting Server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
