import express from "express";
import { signupController, loginController } from "../controllers/authController.js";
import { loginSchema, signupSchema } from "../schemas/userSchema.js";
import { validate } from "../middleware/validate.js";
const router = express.Router();
router.post("/signup", validate(signupSchema), signupController);
router.post("/login", validate(loginSchema), loginController);
export default router;
