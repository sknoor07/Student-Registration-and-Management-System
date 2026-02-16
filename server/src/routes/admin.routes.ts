import express from "express";
import { createCourse } from "../controllers/admin.controller.ts";
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
