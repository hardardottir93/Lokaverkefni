import { findEventById, getAllEvents, getEventsByFilter } from "../models/eventModel.js";
export const getEventByIdController = async (request, response) => {
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
export const getAllEventsController = async (request, response) => {
    const events = (await getAllEvents()) ?? [];
    if (events.length === 0) {
        return response.status(200).json({
            message: "Engir viðburðir fundust",
            events: []
        });
    }
    return response.status(200).json({
        count: events.length,
        events
    });
};
export const getEventsByFilterController = async (request, response) => {
    const filters = response.locals.query;
    const events = await getEventsByFilter(filters);
    return response.status(200).json({
        count: events.length,
        events,
    });
};
