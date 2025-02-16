const dotenv = require('dotenv');
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require('cloudinary').v2;

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const upload = multer({ dest: "uploads/" });

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB Connected Successfully"))
    .catch((err) => {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profilePics: [{ type: String, default: [] }]
});

const User = mongoose.model("User", UserSchema);

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer")) return res.status(401).json({ message: "No token, authorization denied" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

app.get("/api/auth/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/upload", authMiddleware, upload.single("image"), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const result = await cloudinary.uploader.upload(req.file.path);
        fs.unlinkSync(req.file.path);

        user.profilePics.push(result.secure_url);
        await user.save();

        res.json({ imageUrl: result.secure_url, message: "Image uploaded successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error uploading image" });
    }
});

app.post("/api/auth/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "Username already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, profilePics: [] });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ token, username: newUser.username, profilePics: newUser.profilePics });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
});

app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Invalid username or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid username or password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, username: user.username, profilePics: user.profilePics });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
