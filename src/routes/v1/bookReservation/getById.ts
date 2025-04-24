import { Request, Response } from "express";
import mongoose from "mongoose";
import APIResponse from "../../../utils/api";
import BookReservationRepo from "../../../database/repository/bookResevationRepo";

const getBookReservationByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return APIResponse.error("Invalid reservation ID", 400).send(res);
    }

    // Fetch reservation from database
    const reservation = await BookReservationRepo.getReservationById(id);

    // Check if reservation exists
    if (!reservation) {
      return APIResponse.error("Reservation not found", 404).send(res);  
    }

    // Return success response
    return APIResponse.success(
      { message: "Reservation retrieved successfully", data: reservation },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default getBookReservationByIdHandler;
