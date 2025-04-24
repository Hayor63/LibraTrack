import { NextFunction, Request, Response } from "express";
import APIResponse from "../utils/api";

interface AuthenticatedUser {
  id: string;
  role: string;
  email: string;
}

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!res.locals.user) {
    return APIResponse.error("Access token is required").send(res);
  }

  req.user = res.locals.user; // Ensuring req.user has a proper type
  next();
};

export default authenticateUser;
