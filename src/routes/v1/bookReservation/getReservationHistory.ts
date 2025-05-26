import { Request, Response } from "express";
import BorrowingRepo from "../../../database/repository/borrowRepo"; // ❗️Make sure you're importing the correct ReservationRepo
import APIResponse from "../../../utils/api";
import BookReservationRepo from "../../../database/repository/bookResevationRepo";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

const getAllReservationsHistoryHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Authentication check
    if (!req.user || !req.user._id) {
      return APIResponse.error("User not authenticated", 401).send(res);
    }

    // Parse query parameters
    const {
      pageNumber,
      pageSize,
      sortField,
      sortType,
      search,
      userId,
      ...restFilters
    } = req.query;

    // Set up filter
    const filter: any = {
      ...restFilters,
    };

    // Access control
    if (req.user.role === "admin") {
      if (userId) {
        filter.userId = userId;
      }
    } else {
      filter.userId = req.user._id;
    }

    // Pagination
    const page = Math.max(1, Number(pageNumber) || 1);
    const limit = Math.max(1, Number(pageSize) || 10);
    const skip = (page - 1) * limit;

    // Sorting
    const sortLogic =
      sortField && sortType
        ? { [sortField as string]: sortType }
        : undefined;

    // Fetch reservations history
    const history = await BookReservationRepo.getBookReservationHistory({ userId: req.user._id, skip, limit });
    const totalItems = await BookReservationRepo.getUserHistoryCount(req.user._id);


    if (!history || history.length === 0) {
      return APIResponse.error("No reservation history found", 404).send(res);
    }

    return APIResponse.success(
      {
        message: "Reservation history retrieved successfully",
        data: history,
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

export default getAllReservationsHistoryHandler;
