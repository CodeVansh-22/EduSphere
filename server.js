// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------------------------------
// FIXED CORS — fully compatible with Express v5
// ------------------------------------------
app.use(cors({
    origin: "https://codevansh-22.github.io",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// ❗ REMOVE ALL app.options() ROUTES
// Express v5 automatically handles OPTIONS when CORS is enabled

app.use(bodyParser.json());
