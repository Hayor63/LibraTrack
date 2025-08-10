import argon2 from "argon2";
import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import userRepo from "../../../database/repository/userRepo";
import TokenModel from "../../../database/models/token";
import UserModel from "../../../database/models/user";

const resetPasswordHandler = async (req: Request, res: Response) => {
  try {
    const { id:userId, token } = req.params;
    const { password } = req.body;
    if (!token || !password) {
      return APIResponse.error(
        "invalid parameter, token may be broken",
        400
      ).send(res);
    }

    const user = await userRepo.findById(userId);
    if (!user) {
      return APIResponse.error("User not found", 404).send(res);
    }

    // checking if the token exists and it's valid
    const getToken = await TokenModel.findOne({ userId, token });
    if (!getToken) {
      return APIResponse.error("Invalid or expired token", 400).send(res);
    }

    const hashedPassword = await argon2.hash(password);

    //updating user's password
    await UserModel.updateOne({ _id: user._id }, { password: hashedPassword });
    return APIResponse.success("Password updated successfully").send(res);
  } catch (error) {
    console.error("Recover password error:", error);
    return APIResponse.error(
      "Something went wrong, please try again",
      500
    ).send(res);
  }
};


export default resetPasswordHandler