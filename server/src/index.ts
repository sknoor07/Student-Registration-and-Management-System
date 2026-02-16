import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/auth.routes.ts";
import { pool } from "./config/db.ts";
import { authenticate, authorize } from "./middleware/auth.middleware.ts";

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

app.get(
    "/api/admin/test",
    authenticate,
    authorize(["admin"]),
    (req, res) => {
        res.json({ message: "Welcome Admin" });
    }
);
app.get(
    "/api/student/test",
    authenticate,
    authorize(["student"]),
    (req, res) => {
        res.json({ message: "Welcome Student" });
    }
);

app.get(
    "/api/auth/me",
    authenticate,
    (req: any, res) => {
        res.json({
            id: req.user.id,
            role: req.user.role,
            name: req.user.name,   // 👈 add this
        });
    }
);

app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});


app.use("/api/auth", router)

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