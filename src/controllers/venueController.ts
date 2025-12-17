import { Request, Response, NextFunction } from "express";
import { findVenueById, getAllVenues, getUpcomingEventsByVenueId } from "../models/venueModel";


export const getAllVenuesController = async (request: Request, response: Response, next: NextFunction) => {
    const venues = await getAllVenues();

    return response.status(200).json({
      count: venues.length,
      venues,
    });
}

export const getVenueByIdController = async (request: Request, response: Response, next: NextFunction) => {
   const { id } = response.locals.params;

   const venue = await findVenueById(id);

   if (!venue) {
    return response.status(404).json({
        success: false,
        error: "Viðburðarstaður fannst ekki"
    });
   }

   const events = await getUpcomingEventsByVenueId(id);

   return response.status(200).json({
        ...venue,
        events,
    });
};

