import { Router } from "express";
import { getSteps, upsertSteps } from "../controllers/steps.controller.js";
import protect from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/error.middleware.js";

const router = Router();

router.post("/", protect, asyncHandler(upsertSteps));
router.get("/", protect, asyncHandler(getSteps));

export default router;
