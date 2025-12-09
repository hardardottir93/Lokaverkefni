import express from "express";
import { signupController, loginController } from "../controllers/authController";
import { signupSchema } from "../schemas/userSchema";
import { validate } from "../middleware/validate";

const router = express.Router();

router.post("/signup", validate(signupSchema), signupController);
router.post("/login", loginController);

export default router;