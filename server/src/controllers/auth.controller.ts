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



export const updateProfile = async (req: any, res: Response) => {
    try {
        const userId = req.user.id; // from auth middleware
        const { name, email } = req.body;

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        const existingEmail = await existingUser?.rows[0]?.email;
        if (existingEmail && existingUser.rows[0].id !== userId) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const updatedUser = await pool.query(
            "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
            [name, email, userId]
        );

        res.json({ user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};

export const changePassword = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [userId]
        );

        const user = await existingUser.rows[0];
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query(
            "UPDATE users SET password = $1 WHERE id = $2",
            [hashedPassword, userId]
        );

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Password change failed" });
    }
};




