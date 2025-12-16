import { Request, Response, NextFunction } from "express";
import { findEventById, getAllEvents, getEventsByFilter } from "../models/eventModel";

export const getEventByIdController = async (request: Request, response: Response, next: NextFunction) => {
   const { id } = response.locals.params;

   const event = await findEventById(id);

   if (!event) {
    return response.status(404).json({
        success: false,
        error: "Viðburður fannst ekki"
    });
   }

   return response.status(200).json(event); 
};


export const getAllEventsController = async (request: Request, response: Response, next: NextFunction) => {
    
   const events = (await getAllEvents()) ?? [];

   if(events.length === 0) {
    return response.status(200).json({
        message: "Engir viðburðir fundust",
        events: []
    });
   }

   return response.status(200).json({
    count: events.length,
    events
   })

};


export const getEventsByFilterController = async (request: Request, response: Response, next: NextFunction) => {

    const filters = response.locals.query ?? {};

    getEventsByFilter(filters)
        .then(events => {
        response.status(200).json({
            count: events.length,
            events,
        });
        })
        .catch(next);
};
