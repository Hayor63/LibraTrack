import { Request, Response } from "express";
import BookReservationRepo from "../../../database/repository/bookResevationRepo";
import APIResponse from "../../../utils/api";

const cancelReservationHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const reservation = await BookReservationRepo.getReservationById(id);

    if (!reservation) {
      return APIResponse.error("Reservation not found", 404).send(res);
    }

    // Optional: Prevent canceling already canceled reservation
    if (reservation.status === "canceled") {
      return APIResponse.error("Reservation is already canceled", 400).send(res);
    }

    if (reservation.status !== "pending") {
        return APIResponse.error("Reservations that are not pending cannot be canceled.", 400).send(res);
      }

    reservation.status = "canceled";
    reservation.expirationDate = new Date()
    await reservation.save() 

    return APIResponse.success(
      { message: "Reservation canceled successfully", data: reservation },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default cancelReservationHandler;
