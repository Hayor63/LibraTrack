import { Request, Response } from "express";
import userRepo from "../../../database/repository/userRepo";
import APIResponse from "../../../utils/api";
import JWTRepo from "../../../database/repository/JWTRepo";
import TokenModel from "../../../database/models/token";
import sendEmail from "../../../services/sendMail";
import config from "../../../../config/default";

const recoverPasswordhandler = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    //fiind user
    const user = await userRepo.findByEmail(email);
    if (!user) {
      return APIResponse.error("user not found", 404).send(res);
    }

    //Generate reset token
    const resetToken = JWTRepo.signResetToken(user._id.toString());

    //store token in the database
    const stored = await TokenModel.create({
      userId: user._id,
      token: resetToken,
      expiresAt: Date.now() + 3600000,
    });
 

    // Send email with reset link
    const resetLink = `${config.baseUrl}/reset-password/${user._id}/${resetToken}`;
    const emailSent = await sendEmail({
      userName: user.userName,
      from: config.userMailLogin,
      to: user.email,
      subject: "Password Reset",
      text: `Click the link to reset your password: ${resetLink}`,
    });

    // Ensure email was sent
    if (!emailSent?.success) {
      return APIResponse.error("Failed to send reset email").send(res);
    }

    return APIResponse.success("Password reset link sent to email", 200).send(
      res
    );
  } catch (error) {
    return APIResponse.error("Something went wrong, please try again").send(
      res
    );
  }
};

export default recoverPasswordhandler