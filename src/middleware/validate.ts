import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => 
  (request: Request, response: Response, next: NextFunction) => {
    try {
      request.body = schema.parse(request.body);
      next();
    } catch (err) {
      next(err);
    }
  };

export const validateQuery = (schema: ZodSchema) => {
  return (request: Request, response: Response, next: NextFunction) => {
    try {
      const parsedQuery = schema.parse(request.query);

      response.locals.query = parsedQuery;
      next();
    } catch (error) {
      next(error);
    }
  };
};


export const validateParams = (schema: ZodSchema) => {
  return (request: Request, response: Response, next: NextFunction) => {
    try {
      const parsedParams = schema.parse(request.params);
      response.locals.params = parsedParams; 
      next();
    } catch (error) {
      next(error);
    }
  };
};