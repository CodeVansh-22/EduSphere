// -------------------------------------------
// DEBUG HANDLERS (must be FIRST)
// -------------------------------------------
process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT ERROR:", err);
});
process.on("unhandledRejection", (reason) => {
    console.error("UNHANDLED REJECTION:", reason);
});

// -------------------------------------------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Razorpay = require("razorpay");

const app = express();
const PORT = process.env.PORT || 5000;

// -------------------------------------------
// CORS FIX (Express v5 compatible)
// -------------------------------------------
app.use(
    cors({
        origin: "https://codevansh-22.github.io",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    })
);

app.use(bodyParser.json());

// -------------------------------------------
// MongoDB Connection
//--------------------------------------------
const MONGO_URI =
    "mongodb+srv://vanshchauhan_db_user:vansh2206@cluster0.amelidd.mongodb.net/edusphere";

mongoose
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected ✔"))
    .catch((err) => console.error("MongoDB Error ❌:", err));

// -------------------------------------------
// Mongoose Schema
// -------------------------------------------
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
});

const User = mongoose.model("User", UserSchema);

// -------------------------------------------
// Razorpay Config
//--------------------------------------------
const razorpay = new Razorpay({
    key_id: "rzp_test_RnqzlJgS6MFe2M",
    key_secret: "12nYyjrzt1QQ4nYtXUUPE8UY",
});

// -------------------------------------------
// Health Check
//--------------------------------------------
app.get("/", (req, res) => {
    res.send("EduSphere Backend is Running ✔");
});

// -------------------------------------------
// Register Route
//--------------------------------------------
app.post("/api/register", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.json({ message: "User Registered Successfully!" });
    } catch (err) {
        res.status(400).json({ error: "Email already exists" });
    }
});

// -------------------------------------------
// Login Route
//--------------------------------------------
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
        return res.status(401).json({ error: "Invalid Credentials" });
    }

    res.json({ message: "Login Success", name: user.name });
});

// -------------------------------------------
// Razorpay Order API
//--------------------------------------------
app.post("/api/create-order", async (req, res) => {
    try {
        const amount = req.body.amount * 100;

        const order = await razorpay.orders.create({
            amount,
            currency: "INR",
            receipt: `edusphere_${Date.now()}`,
        });

        res.json(order);
    } catch (err) {
        console.error("Razorpay Error:", err);
        res.status(500).json({ error: "Order creation failed" });
    }
});

// -------------------------------------------
// START SERVER
//--------------------------------------------
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT} ✔`);
});
