import { Request, Response } from "express";
import BorrowingRepo from "../../../database/repository/borrowRepo";
import APIResponse from "../../../utils/api";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

const getAllBorrowingsHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Authentication check
    if (!req.user || !req.user._id) {
      return APIResponse.error("User not authenticated", 401).send(res);
    }

    // Parsing query parameters
    const { pageNumber, pageSize, sortField, sortType, search, userId, ...restFilters } = req.query;

    // Building filter object
    let filter = {
      ...restFilters, // Other filters like status, date ranges, etc.
    };

    // Accessing control logic:
    if (req.user.role === "admin") {
      // Admins can filter by specific userId if provided
      if (userId) {
        filter.userId = userId;
      }
      // Otherwise, admin sees all borrowings (no userId filter)
    } else {
      // Regular users can ONLY see their own borrowings, regardless of query params
      filter.userId = req.user._id;
    }

    // Setting pagination parameters
    const page = Math.max(1, Number(pageNumber) || 1);
    const limit = Math.max(1, Number(pageSize) || 10);
    
    // Building sort logic
    const sortLogic =
    sortField && sortType
      ? {
          [sortField as string]: sortType as string | number,
        }
      : undefined;
    
    // Getting paginated borrowings
    const { data: borrows, totalItems } = await BorrowingRepo.getAllBorrowings({
      pageNumber: page,
      pageSize: limit,
      filter,
      search: search as string,
      sortLogic,
    });

    // Checking if any borrowings found
    if (!borrows || borrows.length === 0) {
      return APIResponse.error("No borrowings found", 404).send(res);
    }

    // Return successful response with pagination info
    return APIResponse.success(
      { 
        message: "Borrowings retrieved successfully", 
        data: borrows,  
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
        }
      },
      200
    ).send(res);
    
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default getAllBorrowingsHandler;