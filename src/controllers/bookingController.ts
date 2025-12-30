import { Request, Response, NextFunction } from "express";
import { cancelBooking, createBooking, getBookingById, getBookingsByUserId } from "../models/bookingModel";


export const createBookingController = async (request: Request, response: Response) => {
    const userId = response.locals.user.id;
    const { eventId, quantity, paymentMethod } = request.body;

    const booking = await createBooking(userId, eventId, quantity, paymentMethod);

    return response.status(201).json({
        bookingId: booking.id,
    });
}


export const getBookingsByUserIdController = async (request: Request, response: Response) => {
    const userId = response.locals.user.id;
    const bookings = await getBookingsByUserId(userId);

    const mappedBookings = (bookings ?? []).map((b) => ({
      booking_id: b.id,
      quantity: b.quantity,
      total_price: b.total_price,
      event: {
        id: b.event_id,
        name: b.event_name,
        date: b.event_date,
      },
    }));

    return response.status(200).json(mappedBookings);
}


export const cancelBookingController = async (request: Request, response: Response, next: NextFunction) => {
    const bookingId = Number(request.params.id);
    const userId = response.locals.user.id;

    const booking = await getBookingById(bookingId);
    
    if (!booking) {
        return next({
            status: 404,
            message: 'Bókun fannst ekki',
        });
    }

    if (booking.user_id !== userId) {
        return next({
            status: 403,
            message: 'Þú hefur ekki aðgang að þessari bókun',
        });
    }

    const eventDate = new Date(booking.event_date);
    const now = new Date();
    const diffHours = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
        return next({
            status: 400,
            message: 'Ekki er hægt að hætta við bókun innan 24 klst',
        });
    }


    await cancelBooking(booking);

    return response.status(200).json({
        message: 'Bókun hefur verið afpöntuð',
    });
}
