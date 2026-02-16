import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.ts";

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        // 1️⃣ Check if user already exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3️⃣ Insert user into DB
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, role",
            [name, email, hashedPassword, role]
        );

        const user = newUser.rows[0];

        // 4️⃣ Generate JWT
        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        // 5️⃣ Send JWT in httpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "lax",
        });

        res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const userResult = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        // 🔹 Case 1: User does not exist
        if (userResult.rows.length === 0) {
            return res.status(404).json({
                message: "User does not exist"
            });
        }

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        // 🔹 Case 2: Wrong password
        if (!isMatch) {
            return res.status(401).json({
                message: "Wrong password"
            });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        res.status(200).json({ message: "Login successful" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


