// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------------------------------
// FIXED CORS (Important for GitHub Pages)
// ------------------------------------------
app.use(cors({
    origin: "https://codevansh-22.github.io",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// EXPRESS v5 SAFE OPTIONS HANDLER
app.options("/api/*", (req, res) => {
    res.sendStatus(200);
});

// ------------------------------------------
app.use(bodyParser.json());

// ------------------------------------------
// MongoDB Connection
// ------------------------------------------
const MONGO_URI = "mongodb+srv://vanshchauhan_db_user:vansh2206@cluster0.amelidd.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.log("MongoDB Error:", err));

// ------------------------------------------
// User Schema
// ------------------------------------------
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// ------------------------------------------
// Razorpay Config
// ------------------------------------------
const razorpay = new Razorpay({
    key_id: "rzp_test_RnqzlJgS6MFe2M",
    key_secret: "12nYyjrzt1QQ4nYtXUUPE8UY"
});

// ------------------------------------------
// Health Check Route
// ------------------------------------------
app.get('/', (req, res) => {
    res.send("EduSphere Backend is Running ✔");
});

// ------------------------------------------
// Authentication Routes
// ------------------------------------------
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: "User Registered Successfully!" });

    } catch (err) {
        res.status(400).json({ error: "Email already exists or error occurred." });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });

        if (user) {
            res.json({ message: "Login Success", name: user.name });
        } else {
            res.status(401).json({ error: "Invalid Credentials" });
        }

    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

// ------------------------------------------
// Razorpay Order API
// ------------------------------------------
app.post('/api/create-order', async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: "receipt_" + Date.now()
        };

        const order = await razorpay.orders.create(options);
        res.json(order);

    } catch (error) {
        console.error("Order creation failed:", error);
        res.status(500).json({ error: "Failed to create Razorpay order" });
    }
});

// ------------------------------------------
// Start Server
// ------------------------------------------
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
