import { Request, Response } from "express";
import BookReservationModel from "../../../database/models/bookReservation";
import BookReservationRepo from "../../../database/repository/bookResevationRepo";
import APIResponse from "../../../utils/api";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

const deleteReservationHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    //find Reservation before deletion
    const reservation = await BookReservationRepo.getReservationById(id);
    if (!reservation) {
      return APIResponse.error("Reservation not found", 404).send(res);
    }
    //Delete Book
    await BookReservationRepo.deleteReservation(id);

    return APIResponse.success(
      { message: "Reservation deleted successfully" }, // No need to return the deleted reservation object
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default deleteReservationHandler;
