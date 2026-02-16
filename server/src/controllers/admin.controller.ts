import type { Request, Response } from "express";
import { pool } from "../config/db.ts";

// ✅ Create Course (Admin Only)
export const createCourse = async (req: Request, res: Response) => {
    try {
        const { name, code, credits, department, year } = req.body;

        if (!name || !code || !credits || !department || !year) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newCourse = await pool.query(
            `INSERT INTO courses (name, code, credits, department, year)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [name, code, credits, department, year]
        );

        res.status(201).json({
            message: "Course created successfully",
            course: newCourse.rows[0],
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// ✅ Create Student Profile (Admin Only)
export const createStudentProfile = async (req: Request, res: Response) => {
    try {
        const { userId, rollNumber, department, year } = req.body;

        if (!userId || !rollNumber || !department || !year) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existing = await pool.query(
            "SELECT * FROM student_profiles WHERE user_id = $1",
            [userId]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ message: "Profile already exists" });
        }

        const profile = await pool.query(
            `INSERT INTO student_profiles (user_id, roll_number, department, year)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [userId, rollNumber, department, year]
        );

        res.status(201).json({
            message: "Student profile created",
            profile: profile.rows[0],
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Add Result (Admin Only)
export const addResult = async (req: Request, res: Response) => {
    try {
        const { studentId, courseId, marks, grade } = req.body;

        if (!studentId || !courseId || !marks || !grade) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Optional: prevent duplicate result for same course
        const existing = await pool.query(
            `SELECT * FROM results 
       WHERE student_id = $1 AND course_id = $2`,
            [studentId, courseId]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({
                message: "Result already exists for this course",
            });
        }

        const result = await pool.query(
            `INSERT INTO results (student_id, course_id, marks, grade)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [studentId, courseId, marks, grade]
        );

        res.status(201).json({
            message: "Result added successfully",
            result: result.rows[0],
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
