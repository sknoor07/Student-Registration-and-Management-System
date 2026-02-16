import express from "express";
import { createCourse, getAllCourses, getAllResults, getAllStudents, getFullStudentsDetails } from "../controllers/admin.controller.ts";
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
    getAllResults
);
router.get(
    "/courses",
    authenticate,
    authorize(["admin"]),
    getAllCourses
);



router.get(
    "/students/details",
    authenticate,
    authorize(["admin"]),
    getFullStudentsDetails
);



