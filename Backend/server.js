// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;   // ✅ Render Fix

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- DATABASE CONNECTION ---
const MONGO_URI = "mongodb+srv://vanshchauhan_db_user:vansh2206@cluster0.amelidd.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB Connected Successfully"))
.catch(err => console.log(err));

// ---------- MODELS ----------
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// ---------- ROUTES ----------

// 🟢 FIX: Root Route for Render
app.get('/', (req, res) => {
    res.send("EduSphere Backend is Running ✔");
});

// Register
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

// Login
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

// ---------- START SERVER ----------
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
