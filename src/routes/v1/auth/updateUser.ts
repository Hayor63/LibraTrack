import { Request, Response } from "express";
import userRepo from "../../../database/repository/userRepo";
import APIResponse from "../../../utils/api";
import { UpdateUserSchema } from "../../../validationSchema/user";

interface AuthenticatedRequest extends Request {
  user?: { _id: string; role: string }; // Add role here
}

const updateUserHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const user = req.user;

    if (!user || !user._id) {
      return APIResponse.error("User not authenticated", 401).send(res);
    }

    const isAdmin = user.role === "admin";
    const isOwner = user._id === id;

    // Only admin or the user themself can update
    if (!isAdmin && !isOwner) {
      return APIResponse.error("Unauthorized to update this user", 403).send(res);
    }

    // If user is not admin, remove restricted fields
    if (!isAdmin) {
      delete updatedData.role;
      delete updatedData.email; // Optional depending on your rules
    }

    if (!updatedData || Object.keys(updatedData).length === 0) {
      return APIResponse.error("No update data provided", 400).send(res);
    }

    if (!Object.values(updatedData).some((value) => value !== undefined)) {
      return APIResponse.error("At least one field must be provided for update", 400).send(res);
    }

    const updatedUser = await userRepo.updateUser(id, updatedData);
    if (!updatedUser) {
      return APIResponse.error("User not found", 404).send(res);
    }

    return APIResponse.success(
      { message: "User updated successfully", data: updatedUser },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default updateUserHandler;
