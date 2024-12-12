import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Authorization token missing',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        req.user = decoded; 
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({
            message: 'Invalid or expired token',
        });
    }
};
