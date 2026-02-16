import express from "express";
import { createCourse, createStudent, deleteCourse, deleteStudent, getAllCourses, getAllResults, getAllStudents, getFullStudentsDetails, getResults, updateCourse, updateStudent } from "../controllers/admin.controller.ts";
import { authenticate, authorize } from "../middleware/auth.middleware.ts";

const router = express.Router();

// Admin Only Route
router.post(
    "/courses",
    authenticate,
    authorize(["admin"]),
    createCourse
);

export default router;

import { createStudentProfile } from "../controllers/admin.controller.ts";

router.post(
    "/students/profile",
    authenticate,
    authorize(["admin"]),
    createStudentProfile
);

import { addResult } from "../controllers/admin.controller.ts";

router.post(
    "/results",
    authenticate,
    authorize(["admin"]),
    addResult
);




router.get(
    "/results",
    authenticate,
    authorize(["admin"]),
    getResults
);


router.get(
    "/students/details",
    authenticate,
    authorize(["admin"]),
    getFullStudentsDetails
);

router.get(
    "/allResults",
    authenticate,
    authorize(["admin"]),
    getAllResults
);

import { updateResult, deleteResult } from "../controllers/admin.controller.ts";

router.put(
    "/results/:id",
    authenticate,
    authorize(["admin"]),
    updateResult
);

router.delete(
    "/results/:id",
    authenticate,
    authorize(["admin"]),
    deleteResult
);

//Courses

router.get(
    "/courses",
    authenticate,
    authorize(["admin"]),
    getAllCourses
);

router.put(
    "/courses/:id",
    authenticate,
    authorize(["admin"]),
    updateCourse
);

router.delete(
    "/courses/:id",
    authenticate,
    authorize(["admin"]),
    deleteCourse
);
//student
router.put(
    "/students/:id",
    authenticate,
    authorize(["admin"]),
    updateStudent
);

router.delete(
    "/students/:id",
    authenticate,
    authorize(["admin"]),
    deleteStudent
);
router.post(
    "/students",
    authenticate,
    authorize(["admin"]),
    createStudent
);
router.get(
    "/students",
    authenticate,
    authorize(["admin"]),
    getAllStudents
);





