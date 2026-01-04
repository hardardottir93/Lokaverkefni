import z from 'zod';
export const errorHandler = (error, request, response, next) => {
    if (response.headersSent)
        return next(error);
    // Zod villur
    if (error instanceof z.ZodError) {
        return response.status(400).json({
            success: false,
            error: error.issues[0].message,
        });
    }
    // Aðrar villur
    const status = error.status || 500;
    const message = error.message || 'Server Error';
    response.status(status).json({
        success: false,
        error: message,
    });
};
