import type { Request, Response } from "express";
import { pool } from "../config/db.ts";
import bcrypt from "bcrypt";


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
        console.log("Profile: " + req.body);

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


// get all students (Admin Only)
export const getAllStudents = async (req: Request, res: Response) => {
    try {
        const students = await pool.query("SELECT * FROM users WHERE role = 'student'");

        res.status(200).json({
            message: "Students fetched successfully",
            count: students?.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// get all courses (Admin Only)
export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const courses = await pool.query("SELECT * FROM courses");

        res.status(200).json({
            message: "Courses fetched successfully",
            courses: courses?.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// get all results (Admin Only)
export const getResults = async (req: Request, res: Response) => {
    try {
        const results = await pool.query("SELECT * FROM results");

        res.status(200).json({
            message: "Results fetched successfully",
            count: results?.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// get all results (Admin Only)
export const getFullStudentsDetails = async (req: Request, res: Response) => {
    try {
        const results = await pool.query("SELECT * FROM users WHERE role = 'student' ");
        console.log("All students: " + results);

        res.status(200).json({
            message: "Results fetched successfully",
            student: results?.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAllResults = async (req: Request, res: Response) => {
    try {
        const query = `
      SELECT 
        r.id,
        r.student_id,
        u.name AS student_name,
        r.course_id,
        c.name AS course_name,
        r.marks,
        r.grade
      FROM results r
      JOIN users u ON r.student_id = u.id
      JOIN courses c ON r.course_id = c.id
      ORDER BY r.id DESC
    `;
        const result: any = await pool.query(query);

        res.status(200).json({
            message: "Results fetched successfully",
            results: result.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" })
    }
}


export const updateResult = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { student_id, course_id, marks, grade } = req.body;

        const result = await pool.query(
            `UPDATE results 
             SET student_id = $1, course_id = $2, marks = $3, grade = $4
             WHERE id = $5
             RETURNING *`,
            [student_id, course_id, marks, grade, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Result not found" });
        }

        res.json({
            message: "Result updated successfully",
            result: result.rows[0],
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const deleteResult = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM results WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Result not found" });
        }

        res.json({ message: "Result deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const updateCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, code, credits, department, year } = req.body;

        const result = await pool.query(
            `UPDATE courses 
             SET name = $1, code = $2, credits = $3, department = $4, year = $5
             WHERE id = $6
             RETURNING *`,
            [name, code, credits, department, year, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({
            message: "Course updated successfully",
            course: result.rows[0],
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM courses WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({ message: "Course deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        const result = await pool.query(
            `UPDATE users 
             SET name = $1, email = $2, role = $3
             WHERE id = $4
             RETURNING *`,
            [name, email, role, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({
            message: "Student updated successfully",
            student: result.rows[0],
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM users WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const createStudent = async (req: Request, res: Response) => {
    try {
        const { name, email, role } = req.body;

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }
        // 2️⃣ Hash password
        const hashedPassword = await bcrypt.hash("123456", 10);

        // 3️⃣ Insert user into DB
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, role",
            [name, email, hashedPassword, role]
        );

        res.json({
            message: "Student created successfully",
            student: newUser.rows[0],
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};




// ================= ENROLLMENTS =================

export const assignCourses = async (req: Request, res: Response) => {
    try {
        const { studentProfileId, courseIds } = req.body;
        // studentProfileId here is actually users.id from frontend

        if (!studentProfileId || !courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
            return res.status(400).json({
                message: "Invalid student or courses data",
            });
        }

        // ✅ 1️⃣ Convert user_id → student_profile.id
        const profileRes = await pool.query(
            `SELECT id FROM student_profiles WHERE user_id = $1`,
            [studentProfileId]
        );

        if (profileRes.rows.length === 0) {
            return res.status(404).json({
                message: "Student profile not found",
            });
        }

        const profileId = profileRes.rows[0].id;

        // ✅ 2️⃣ Insert courses safely (avoid duplicates)
        for (const courseId of courseIds) {
            await pool.query(
                `INSERT INTO enrollments (student_profile_id, course_id)
                 VALUES ($1, $2)
                 ON CONFLICT (student_profile_id, course_id) DO NOTHING`,
                [profileId, courseId]
            );
        }

        return res.status(201).json({
            message: "Courses assigned successfully",
        });

    } catch (error) {
        console.error("Assign Courses Error:", error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};


export const getStudentEnrollments = async (req: Request, res: Response) => {
    try {
        const { studentProfileId } = req.params; // user.id
        const { year } = req.query;

        if (!studentProfileId || !year) {
            return res.status(400).json({ message: "Missing student or year" });
        }

        // 1️⃣ Convert user_id → profile_id
        const profileRes = await pool.query(
            `SELECT id, department 
             FROM student_profiles 
             WHERE user_id = $1`,
            [studentProfileId]
        );

        if (profileRes.rows.length === 0) {
            return res.status(404).json({ message: "Student profile not found" });
        }

        const profileId = profileRes.rows[0].id;
        const department = profileRes.rows[0].department;

        // 2️⃣ Assigned courses (FILTER BY YEAR)
        const assigned = await pool.query(
            `SELECT c.*
             FROM enrollments e
             JOIN courses c ON e.course_id = c.id
             WHERE e.student_profile_id = $1
             AND c.year = $2`,
            [profileId, year]
        );

        // 3️⃣ Available courses
        const available = await pool.query(
            `SELECT *
             FROM courses
             WHERE department = $1
             AND year = $2
             AND id NOT IN (
                 SELECT e.course_id
                 FROM enrollments e
                 WHERE e.student_profile_id = $3
             )`,
            [department, year, profileId]
        );

        res.status(200).json({
            assignedCourses: assigned.rows,
            availableCourses: available.rows,
        });

    } catch (error) {
        console.error("Get Enrollments Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const removeEnrollment = async (req: Request, res: Response) => {
    try {
        const { studentProfileId, courseId } = req.body;

        if (!studentProfileId || !courseId) {
            return res.status(400).json({ message: "Missing data" });
        }

        // Convert user_id → profile_id
        const profileRes = await pool.query(
            `SELECT id FROM student_profiles WHERE user_id = $1`,
            [studentProfileId]
        );

        if (profileRes.rows.length === 0) {
            return res.status(404).json({ message: "Student profile not found" });
        }

        const profileId = profileRes.rows[0].id;

        await pool.query(
            `DELETE FROM enrollments
             WHERE student_profile_id = $1
             AND course_id = $2`,
            [profileId, courseId]
        );

        res.json({ message: "Course removed successfully" });

    } catch (error) {
        console.error("Remove Enrollment Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};




///-----Student profile-----
export const getStudentsWithoutProfile = async (
    req: Request,
    res: Response
) => {
    try {
        const result = await pool.query(`
      SELECT u.id, u.name, u.email
      FROM users u
      WHERE u.role = 'student'
      AND NOT EXISTS (
        SELECT 1 FROM student_profiles sp
        WHERE sp.user_id = u.id
      )
    `);

        res.status(200).json({
            students: result.rows,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const getStudentProfiles = async (
    req: Request,
    res: Response
) => {
    try {
        const result = await pool.query(`
      SELECT 
        sp.id,
        sp.roll_number,
        sp.department,
        sp.year,
        u.name,
        u.email
      FROM student_profiles sp
      JOIN users u ON sp.user_id = u.id
    `);

        res.status(200).json({
            profiles: result.rows,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
