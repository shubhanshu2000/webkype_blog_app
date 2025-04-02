import { NextFunction, Request, Response } from "express";

const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next({ statusCode: 403, message: "Access Denied" });
    }
    next();
  };
};

export { authorizeRoles };
