import mongoose from "mongoose";
import APIResponse from "../../../utils/api";
import { updateBookReservationSchemaType } from "./../../../validationSchema/bookReservation";
import { Request, Response } from "express";
import BookReservationRepo from "../../../database/repository/bookResevationRepo";

const updateBookReservationHandler = async (
  req: Request<
    updateBookReservationSchemaType["params"],
    {},
    Partial<updateBookReservationSchemaType["body"]>
  >,
  res: Response
) => {
  const { id } = req.params;
  const updatedData: Partial<updateBookReservationSchemaType["body"]> = req.body;

  try {
    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return APIResponse.error("Invalid Reservation ID", 400).send(res);
    }

    // Ensure update data is not empty
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return APIResponse.error("No update data provided", 400).send(res);
    }

    // Check if the status is "fulfilled" or "canceled", and update expirationDate accordingly
    if (updatedData.status === "fulfilled" || updatedData.status === "canceled") {
      updatedData.expirationDate = new Date(); 
    }

    // Check if the reservation exists before updating
    const existingReservation = await BookReservationRepo.getReservationById(id);
    if (!existingReservation) {
      return APIResponse.error("Reservation not found", 404).send(res);
    }

    // Perform the update
    const updatedReservation = await BookReservationRepo.updateReservation(id, updatedData);
    if (!updatedReservation) {
      return APIResponse.error("Failed to update Reservation", 500).send(res);
    }

    // Return the success response with the updated data
    return APIResponse.success(
      {
        message: "Book reservation updated successfully",
        data: updatedReservation,
      },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error(
      (error as Error).message || "Internal Server Error",
      500
    ).send(res);
  }
};

export default updateBookReservationHandler;
