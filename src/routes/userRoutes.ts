import express from "express";
import { updateUserController } from "../controllers/userController";
import { validate } from "../middleware/validate";
import { authenticateUser } from "../middleware/authMiddleware";
import { updateUserSchema } from "../schemas/userSchema";



const router = express.Router();

router.patch("/update", authenticateUser, validate(updateUserSchema), updateUserController);
//router.delete("/delete", );


export default router;