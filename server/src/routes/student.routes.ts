import express from "express";
import { getMyCourses } from "../controllers/student.controller.ts";
import { authenticate, authorize } from "../middleware/auth.middleware.ts";
import { getMyResults } from "../controllers/student.controller.ts";

const router = express.Router();

router.get(
    "/courses",
    authenticate,
    authorize(["student"]),
    getMyCourses
);



router.get(
    "/results",
    authenticate,
    authorize(["student"]),
    getMyResults
);




export default router;
