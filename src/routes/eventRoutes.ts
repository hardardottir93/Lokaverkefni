import express from "express";
import { getAllEventsController, getEventByIdController, getEventsByFilterController } from "../controllers/eventController";
import { validate, validateQuery } from "../middleware/validate";
import { EventFilterQuery } from "../schemas/eventSchemas";

const router = express.Router();

router.get("/", getAllEventsController);

router.get("/search", validateQuery(EventFilterQuery),getEventsByFilterController);
router.get("/:id", getEventByIdController);

export default router;