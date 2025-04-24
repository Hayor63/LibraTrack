import { Request, Response } from "express";
import userRepo from "../../../database/repository/userRepo";
import APIResponse from "../../../utils/api";

const deleteUserHandler = async (req: Request, res: Response) => {
  const { id: userId } = req.params;
  try {
     // Find user before attempting to delete
    const user = await userRepo.findById(userId);
    if (!user) {
      return APIResponse.error("User not found", 404).send(res);
    }
    //perform deletion
    await userRepo.deleteUser(userId);
    return APIResponse.success(
      { message: "User deleted successfully" },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default deleteUserHandler;
