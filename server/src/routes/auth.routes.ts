import express from "express";
import { signup } from "../controllers/auth.controller.ts";
import { signin } from "../controllers/auth.controller.ts";
import { updateProfile, changePassword } from "../controllers/auth.controller.ts";
import { authenticate } from "../middleware/auth.middleware.ts";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.put("/update-profile", authenticate, updateProfile);
router.put("/change-password", authenticate, changePassword);

export default router;
