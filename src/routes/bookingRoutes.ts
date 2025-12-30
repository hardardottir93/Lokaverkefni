import express from "express";
import { cancelBookingController, createBookingController, getBookingsByUserIdController } from "../controllers/bookingController";
import { validate, validateParams, validateQuery } from "../middleware/validate";
import { CancelBookingParamsSchema, CreateBookingSchema } from "../schemas/bookingSchemas";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticateUser, validate(CreateBookingSchema), createBookingController);
router.get("/my", authenticateUser, getBookingsByUserIdController);
router.delete('/:id', authenticateUser, validateParams(CancelBookingParamsSchema), cancelBookingController);

export default router;