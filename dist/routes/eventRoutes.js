import express from "express";
import { getAllEventsController, getEventByIdController, getEventsByFilterController } from "../controllers/eventController.js";
import { validateParams, validateQuery } from "../middleware/validate.js";
import { EventFilterQuery, EventIdParams } from "../schemas/eventSchemas.js";
const router = express.Router();
router.get("/", getAllEventsController);
router.get("/search", validateQuery(EventFilterQuery), getEventsByFilterController);
router.get("/:id", validateParams(EventIdParams), getEventByIdController);
export default router;
