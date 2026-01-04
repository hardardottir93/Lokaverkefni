import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
export const authenticateUser = (request, response, next) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        const error = new Error('Óheimill aðgangur');
        error.status = 401;
        return next(error);
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    response.locals.user = decoded;
    next();
};
