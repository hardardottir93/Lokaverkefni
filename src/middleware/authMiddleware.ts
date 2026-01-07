import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export const authenticateUser = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    const error: any = new Error("Óheimill aðgangur");
    error.status = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
    };

    response.locals.user = decoded;
    return next();
  } catch (err: any) {
    const error: any = new Error("Óheimill aðgangur");

    if (err?.name === "TokenExpiredError") {
      error.message = "jwt expired";
      error.status = 401;
      return next(error);
    }

    error.message = "Invalid token"; 
    error.status = 401;
    return next(error);
  }
};
