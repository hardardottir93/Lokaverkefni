import express from "express";
import { VenueIdParams } from "../schemas/venueSchemas";
import { getAllVenuesController, getVenueByIdController } from "../controllers/venueController";
import { validateParams } from "../middleware/validate";

const router = express.Router();

router.get("/", getAllVenuesController);
router.get("/:id", validateParams(VenueIdParams), getVenueByIdController);

export default router;