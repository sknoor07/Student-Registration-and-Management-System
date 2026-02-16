import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { pool } from "./config/db.ts";

dotenv.config();

const app = express();

// 🧠 Allow frontend to talk to backend
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

// 🧠 Parse JSON body
app.use(express.json());

// 🧠 Parse cookies
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
    res.send("SRMS API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



pool.connect()
    .then(() => {
        console.log("Connected to PostgreSQL");
    })
    .catch((err) => {
        console.error("DB connection error:", err);
    });