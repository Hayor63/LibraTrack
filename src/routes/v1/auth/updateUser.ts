import { Request, Response } from "express";
import { UpdateUserSchema } from "../../../validationSchema/user"; // Ensure correct import
import APIResponse from "../../../utils/api";
import userRepo from "../../../database/repository/userRepo";

const updateUserHandler = async (
  req: Request<UpdateUserSchema["params"], {}, UpdateUserSchema["body"]>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Ensure at least one valid field is provided
    if (!Object.values(updatedData).some(value => value !== undefined)) {
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
