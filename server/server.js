/*import express from 'express';
import connect from './database/conn.js';

const app = express();
app.use(express.json());
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    try {
        res.json("Home route");
    } catch (error) {
        res.json({ error });
    }
});

connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}` );
        });
    } catch (error) {
        console.error("Cannot connect to the server");
    }
}).catch((error)=>{
    console.log("invalid database connection")
})
*/


/*

const mongoose = require('mongoose');



// MongoDB connection
mongoose
  .connect('mongodb://localhost:27017/Achuma')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

// Schema and Model
const userSchema = new mongoose.Schema({
  username: String,
  
});
const User = mongoose.model('User', userSchema);
*/
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
