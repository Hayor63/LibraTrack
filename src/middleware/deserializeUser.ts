import { NextFunction, Request, Response } from "express";
import APIResponse from "../utils/api";
import { verifyjwt } from "../utils/jwt";

const deserialize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = (req.headers.authorization || "").replace(/^Bearer\s/, "");

    if (!accessToken) {
      return next(); // No token provided, proceed without authentication
    }

    // Verify the JWT token
    const decodedToken = await verifyjwt(accessToken, "accessTokenPrivateKey");

    if (!decodedToken) {
      return APIResponse.error("Invalid or expired token", 401).send(res);
    }

    res.locals.user = decodedToken; // Attach decoded user info to `res.locals`
    next(); // Move to the next middleware
  } catch (error) {
    return APIResponse.error("Unauthorized: Invalid token", 401).send(res);
  }
};

export default deserialize;
