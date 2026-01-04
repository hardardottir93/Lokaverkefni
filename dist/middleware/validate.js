export const validate = (schema) => (request, response, next) => {
    try {
        request.body = schema.parse(request.body);
        next();
    }
    catch (err) {
        next(err);
    }
};
export const validateQuery = (schema) => {
    return (request, response, next) => {
        try {
            const parsedQuery = schema.parse(request.query);
            response.locals.query = parsedQuery;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
export const validateParams = (schema) => {
    return (request, response, next) => {
        try {
            const parsedParams = schema.parse(request.params);
            response.locals.params = parsedParams;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
