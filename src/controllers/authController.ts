import { NextFunction, Request, Response } from 'express';
import { createUser, CreateUser, findUserByEmail, UserTokenPayload } from '../models/userModel';
import bcrypt  from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

const SALT_ROUNDS = 12;

export const signupController = async (
    request: Request, 
    response: Response, 
    next: NextFunction
) => {
  
    const { name, email, password } = request.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        return next({
            status: 400,
            message: "Notandi þegar til með þetta netfang"
        });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser: CreateUser = {
      name,
      email,
      password_hash: hashedPassword,
    };

    const createdUser = await createUser(newUser);

    return response.status(201).json({
        success: true,
        user: {
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
        }
    });
};


export const loginController = async (request: Request, response: Response, next: NextFunction) => {
    const { email, password } = request.body;
   
     if (!email || !password) {
        return next({
            status: 400,
            message: "Netfang eða lykilorð vantar"
        });
    }

    const user = await findUserByEmail(email);
    if (!user) throw { 
        status: 401, 
        message: "Rangt netfang eða lykilorð." 
    };

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
        return next({
            status: 401,
            message: "Rangt netfang eða lykilorð."
    });
}

    const payload: UserTokenPayload = {
        sub: user.id,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '1h',
    });

    return response.status(200).json({
        token,
        message: "Innskráning tókst."
    })
};
