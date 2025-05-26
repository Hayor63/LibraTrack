import { Request, Response } from "express";
import BorrowingRepo from "../../../database/repository/borrowRepo";
import APIResponse from "../../../utils/api";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

const getAllBorrowingsHistoryHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Authentication check
    if (!req.user || !req.user._id) {
      return APIResponse.error("User not authenticated", 401).send(res);
    }

    // Parse query parameters
    const { pageNumber, pageSize, sortField, sortType, search, userId, ...restFilters } = req.query;

    // Build filter object
    let filter = {
      ...restFilters, 
    };

    // Access control logic:
    if (req.user.role === "admin") {
      // Admins can filter by specific userId if provided in the query
      if (userId) {
        filter.userId = userId;
      }
    } else {
      // Regular users can ONLY see their own borrowings, regardless of query params
      filter.userId = req.user._id;
    }

    // Set pagination parameters
    const page = Math.max(1, Number(pageNumber) || 1);
    const limit = Math.max(1, Number(pageSize) || 10);

    // Build sort logic
    const sortLogic =
      sortField && sortType
        ? {
            [sortField as string]: sortType as string | number,
          }
        : undefined;

    // Get paginated borrowings
    const { data: borrows, totalItems } = await BorrowingRepo.getAllBorrowingsHistory({
      pageNumber: page,
      pageSize: limit,
      filter,
      search: search as string,
      sortLogic,
    });

    // Check if any borrowings found
    if (!borrows || borrows.length === 0) {
      return APIResponse.error("No Borrowing History found", 404).send(res);
    }

    // Return successful response with pagination info
    return APIResponse.success(
      {
        message: "Borrowing History retrieved successfully",
        data: borrows,
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

export default getAllBorrowingsHistoryHandler;
