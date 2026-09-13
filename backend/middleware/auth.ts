import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


interface TokenPayLoad {
  userId: string;
}


export interface AuthRequest extends Request {
  userId?: string;
}
export const auth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({
        message: "Token missing"
      });
    }

    const token = header.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid token",
      })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as unknown as TokenPayLoad;

    req.userId = decoded.userId;

    next();
  } catch {
    res.status(401).json({
      message: "Unauthorized"
    });
  }
};