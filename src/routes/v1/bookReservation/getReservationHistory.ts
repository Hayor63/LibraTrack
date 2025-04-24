import { Request, Response } from "express";
import userRepo from "../../../database/repository/userRepo";
import APIResponse from "../../../utils/api";
import BookReservationRepo from "../../../database/repository/bookResevationRepo";

const getReservationHistoryHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await userRepo.findById(id);
    if (!user) {
      return APIResponse.error("User not found", 404).send(res);
    }

    const history = await BookReservationRepo.getBookHistory(id);

    if (!history || history.length === 0) {
      return APIResponse.error("No reservation history found", 404).send(res);
    }

    return APIResponse.success(
      {
        message: "Reservation history retrieved successfully",
        data: history,
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

export default getReservationHistoryHandler;
