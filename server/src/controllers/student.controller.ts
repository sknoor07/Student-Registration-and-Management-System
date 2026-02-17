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

        // 1️⃣ Get student profile ID
        const profileResult = await pool.query(
            "SELECT id FROM student_profiles WHERE user_id = $1",
            [userId]
        );

        if (profileResult.rows.length === 0) {
            return res.status(404).json({
                message: "Student profile not found",
            });
        }

        const studentProfileId = profileResult.rows[0].id;

        // 2️⃣ Fetch courses from enrollments
        const coursesResult = await pool.query(
            `
      SELECT c.*
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.student_profile_id = $1
      `,
            [studentProfileId]
        );

        res.status(200).json({
            courses: coursesResult.rows,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// ✅ Get Logged-in Student Results
export const getMyResults = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const userId = req.user.id;

        const results = await pool.query(
            `
      SELECT 
        r.id,
        r.marks,
        r.grade,
        c.name AS course_name,
        c.code AS course_code,
        c.credits
      FROM results r
      JOIN courses c ON r.course_id = c.id
      WHERE r.student_id = $1
      `,
            [userId]
        );

        res.status(200).json({
            results: results.rows,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
