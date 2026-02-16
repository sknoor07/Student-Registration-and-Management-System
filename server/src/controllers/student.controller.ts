import type { Request, Response } from "express";
import { pool } from "../config/db.ts";

interface AuthRequest extends Request {
    user?: any;
}

// ✅ Get Courses for Logged-in Student
export const getMyCourses = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const userId = req.user.id;

        // 1️⃣ Get student profile
        const profileResult = await pool.query(
            "SELECT department, year FROM student_profiles WHERE user_id = $1",
            [userId]
        );

        if (profileResult.rows.length === 0) {
            return res.status(404).json({
                message: "Student profile not found",
            });
        }

        const { department, year } = profileResult.rows[0];

        // 2️⃣ Fetch matching courses
        const coursesResult = await pool.query(
            `SELECT * FROM courses 
       WHERE department = $1 AND year = $2`,
            [department, year]
        );

        res.status(200).json({
            courses: coursesResult.rows,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
