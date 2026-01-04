import express from "express";
import { VenueIdParams } from "../schemas/venueSchemas.js";
import { getAllVenuesController, getVenueByIdController } from "../controllers/venueController.js";
import { validateParams } from "../middleware/validate.js";
const router = express.Router();
router.get("/", getAllVenuesController);
router.get("/:id", validateParams(VenueIdParams), getVenueByIdController);
export default router;
