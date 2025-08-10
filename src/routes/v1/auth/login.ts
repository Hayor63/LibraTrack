import { Request, Response } from "express";
import userRepo from "../../../database/repository/userRepo";
import APIResponse from "../../../utils/api";
import JWTRepo from "../../../database/repository/JWTRepo";

const loginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Checking if user exists
    const existingUser = await userRepo.findByEmail(email);
    if (!existingUser) {
      return APIResponse.error("User with this email does not exist", 404).send(res);
    }

    // Verifying password
    const isUserPassword = await existingUser.verifyPassword(password);
    if (!isUserPassword) {
      return APIResponse.error("Invalid email or password!!", 400).send(res);
    }

    // Generating JWT token
    const { password: _, ...userData } = existingUser.toObject();
    const accessToken = JWTRepo.signAccessToken(userData);

    // Return success response
    return APIResponse.success({ accessToken, ...userData }, 200).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

export default loginHandler;
