import { Request, Response } from "express";
import userRepo from "../../../database/repository/userRepo";
import APIResponse from "../../../utils/api";
import BookReservationRepo from "../../../database/repository/bookResevationRepo";

const getUserReservationHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const page = Math.max(1, Number(req.query.pageNumber) || 1);
    const limit = Math.max(1, Number(req.query.pageSize) || 10);
    const skip = (page - 1) * limit;

    const user = await userRepo.findById(id);
    if (!user) {
      return APIResponse.error("User not found", 404).send(res);
    }

    // Fetching paginated user-specific reservations and count
    const [reservations, totalItems] = await Promise.all([
      BookReservationRepo.getReservationsByUser({ userId: id, skip, limit }),
      BookReservationRepo.getUserReservationCount(id),
    ]);

    if (!reservations || reservations.length === 0) {
      return APIResponse.error("No reservations found", 404).send(res);
    }

    return APIResponse.success(
      {
        message: "Reservations retrieved successfully",
        data: reservations,
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
        },
      },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default getUserReservationHandler;
