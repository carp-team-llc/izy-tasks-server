import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../../connection/connection";

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const AccountMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  try {
    const token = req.headers["authorization"]
      .split(" ")[1]
      .replace("Bearer ", "");
    if (!token) {
      throw new Error();
    }
    const decoded = jwt.verify(token, ACCESS_TOKEN);
    const reqEmail = decoded?.email;
    if (!reqEmail) {
      return res.status(400).json({ message: "Invalid token!" });
    }
    const checkAcivated = await prisma.user.findFirst({
      where: {
        email: reqEmail,
      },
      select: {
        isVerify: true,
      }
    })
    if (!checkAcivated?.isVerify) {
      return res.status(400).json({message: "This account is not activate, please activate this account before trying!"})
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
};

export default AccountMiddleware;