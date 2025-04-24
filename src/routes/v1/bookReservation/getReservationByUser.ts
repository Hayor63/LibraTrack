import { Request, Response } from "express";
import userRepo from "../../../database/repository/userRepo";
import APIResponse from "../../../utils/api";
import BookReservationRepo from "../../../database/repository/bookResevationRepo";

const getUserReservationHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await userRepo.findById(id);
    if (!user) {
      return APIResponse.error("User not found", 404).send(res);
    }
    const reservations = await BookReservationRepo.getReservationsByUser(
      id
    );
    if (!reservations || reservations.length === 0) {
        return APIResponse.error("No reservations found", 404).send(res); // Fixed message
      }

    // Return success response
    return APIResponse.success(
      { message: "Reservations retrieved successfully", data: reservations },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};


export default getUserReservationHandler