import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { findUserByEmail, findUserById, updateUserById} from "../models/userModel";

const SALT_ROUNDS = 12;


export const updateUserController = async (request: Request, response: Response, next: NextFunction
) => {
    const userId = response.locals.user.id as number;
    const { name, email, password } = request.body as {
        name?: string;
        email?: string;
        password?: string;
    };

    const currentUser = await findUserById(userId);
    if (!currentUser) {
        return next({ status: 404, message: "Notandi fannst ekki" });
    }

    // Athuga hvort netfang sé til
    if (email && email !== currentUser.email) {
        const existing = await findUserByEmail(email);
        if (existing && existing.id !== userId) {
            return next({ status: 400, message: "Netfang er þegar í notkun" });
        }
    }

    const updates: { name?: string; email?: string; password_hash?: string } = {};

    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;

    if (password !== undefined) {
        updates.password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const updated = await updateUserById(userId, updates);

    if (!updated) {
        return next({ status: 400, message: "Engar breytingar sendar" });
    }

    return response.status(200).json({
        success: true,
        user: updated,
    });
};
