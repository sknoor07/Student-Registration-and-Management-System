import express from "express";
import { getMyCourses } from "../controllers/student.controller.ts";
import { authenticate, authorize } from "../middleware/auth.middleware.ts";

const router = express.Router();

router.get(
    "/courses",
    authenticate,
    authorize(["student"]),
    getMyCourses
);

export default router;
