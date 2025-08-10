import { Request, Response } from "express";
import BookReservationRepo from "../../../database/repository/bookResevationRepo";
import APIResponse from "../../../utils/api";

// Define the AuthenticatedRequest interface extending Express's Request
interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

const getAllReservationHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Authentication check
    if (!req.user || !req.user._id) {
      return APIResponse.error("User not authenticated", 401).send(res);
    }

    // Extracting query params
    const { pageNumber, pageSize, sortField, sortType, search, userId, ...restFilters } = req.query;

    // Building filter object for reservations
    let filter = {
      ...restFilters, 
    };

    // Accessinig control logic:
    if (req.user.role === "admin") {
      // Admins can filter by userId if provided
      if (userId) {
        filter.userId = userId;
      }
      // Admins can view all reservations if no userId filter is given
    } else {
      // Regular users can only see their own reservations
      filter.userId = req.user._id;
    }

    // Setting pagination parameters
    const page = Math.max(1, Number(pageNumber) || 1);
    const limit = Math.max(1, Number(pageSize) || 10);
    const skip = (page - 1) * limit;

    // Building sort logic based on query parameters
    const sortLogic =
      sortField && sortType
        ? {
            [sortField as string]: sortType as string | number,
          }
        : undefined;

    // Fetching paginated reservations
    const { data: reservations, totalItems } = await BookReservationRepo.getAllReservations({
      pageNumber: page,
      pageSize: limit,
      filter,
      search: search as string,
      sortLogic,
    });

    // Handling the case where no reservations are found
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
    // Handle unexpected errors
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default getAllReservationHandler;
