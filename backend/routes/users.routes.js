import { Router } from "express";
import { getMe } from "../controllers/users.controller.js";
import protect from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/error.middleware.js";

const router = Router();

router.get("/me", protect, asyncHandler(getMe));

export default router;
