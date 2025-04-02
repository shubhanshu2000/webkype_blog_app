import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next({
        statusCode: 401,
        message: "No token, Authorization failed",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = decode;
      next();
    } catch (error) {
      next({
        statusCode: 400,
        message: "Invalid token",
      });
    }
  } catch (error) {
    next(error);
  }
};

export { verifyToken };
