import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const ACCESS_TOKEN = process.env.ACCESS_TOKEN

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ 
            message: 'Your session has expired, please log in again!', 
            viMessage: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!' 
        });
    }
    try {
        const token = req.headers['authorization'].split(' ')[1].replace('Bearer ', '');
        if (!token) {
            throw new Error();
        }
        const decoded = jwt.verify(token, ACCESS_TOKEN);
        (req as CustomRequest).token = decoded;
        next();
    } catch (err: any) {
        console.error(err)
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Your session has expired, please log in again!', 
                viMessage: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!' 
            });
        }
        res.status(401).json({ 
            message: 'Your session has expired, please log in again!', 
            viMessage: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!' 
        });
    }
};

export default authMiddleware;
