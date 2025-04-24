import { NextFunction, Request, Response } from "express";
import APIResponse from "../utils/api";

const authorizedRoles = (...allowedRoles: Array<string>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user || !user.role || !allowedRoles.includes(user.role)) {
      return APIResponse.error(
        "Forbidden: You do not have permission to access this resource",
        403
      ).send(res);
    }

    next();
  };
};

export default authorizedRoles;
