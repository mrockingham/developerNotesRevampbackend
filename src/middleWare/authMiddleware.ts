import jwt from "jsonwebtoken"
import User from "../models/userModel";
import express, { Request, Response } from 'express';
import asyncHandler from "express-async-handler"

// Extend the Request interface to include the user property
declare global {
    namespace Express {
        interface Request {
            user?: any; // Adjust the type based on your user model
        }
    }
}

export const protect = asyncHandler(async (req: Request, res: Response, next: Function) => {
    try {
        const token = req.header("authorization");
        if (!token)
            return res.status(401).json({ msg: "No authentication token, access denied" });

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified)
            return res.status(401).json({ msg: "Token verification failed, authorization denied" });

        // Assign the user to the request object using req.user
        req.user = verified;

        // Explicitly return next() to fix the type issue
        return next();
    } catch (error) {
        res.status(401).json({ message: "Auth failed!" });
    }
});
