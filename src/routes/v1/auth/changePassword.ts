import argon2 from "argon2";
import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import userRepo from "../../../database/repository/userRepo";
import UserModel from "../../../database/models/user";

const changePasswordHandler = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return APIResponse.error("Old and new password are required", 400).send(
        res
      );
    }
    const user = await userRepo.findById(userId);
    if (!user) {
      return APIResponse.error("User not found", 404).send(res);
    }

    //verify old password
    const isPasswordValid = await user.verifyPassword(oldPassword);
    if (!isPasswordValid) {
      return APIResponse.error("Incorrect old password", 400).send(res);
    }

    //hash new password and update user
    const hashedPassowrd = await argon2.hash(newPassword);
    await UserModel.updateOne({ _id: user._id }, { password: hashedPassowrd });

    return APIResponse.success("Password changed successfully", 200).send(res);
  } catch (error) {
    console.error("Change password error:", error);
    return APIResponse.error(
      "Something went wrong, please try again",
      500
    ).send(res);
  }
};


export default changePasswordHandler