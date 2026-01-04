import express from "express";
import { deleteUserController, updateUserController } from "../controllers/userController.js";
import { validate } from "../middleware/validate.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { updateUserSchema } from "../schemas/userSchema.js";
const router = express.Router();
router.patch("/update", authenticateUser, validate(updateUserSchema), updateUserController);
router.delete("/delete", authenticateUser, deleteUserController);
export default router;
