import express from "express";
import { getAllEventsController, getEventByIdController, getEventsByFilterController } from "../controllers/eventController";
import { validateParams, validateQuery } from "../middleware/validate";
import { EventFilterQuery, EventIdParams } from "../schemas/eventSchemas";

const router = express.Router();

router.get("/", getAllEventsController);
router.get("/search", validateQuery(EventFilterQuery),getEventsByFilterController);
router.get("/:id", validateParams(EventIdParams), getEventByIdController);


export default router;