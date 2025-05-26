import { Request, Response } from "express";
import BookCreationRepo from "../../../database/repository/bookCreationRepo";
import APIResponse from "../../../utils/api";

const fetchBooksHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pageNumber, pageSize, sortField, sortType, search, ...rest } = req.query;

    const filter = {
      ...(rest && rest),
    };

    const page = Math.max(1, Number(pageNumber) || 1);
    const limit = Math.max(1, Number(pageSize) || 10);

    const sortLogic =
      sortField && sortType
        ? {
            [sortField as string]: sortType as string | number,
          }
        : undefined;

    const { data: books, totalItems } = await BookCreationRepo.getPaginatedBook({
      pageNumber: page,
      pageSize: limit,
      filter,
      search: search as string,
      sortLogic,
    });

    if (!books || books.length === 0) {
      return APIResponse.error("No books found", 404).send(res);
    }

    return APIResponse.success(
      {
        message: "Books retrieved successfully",
        data: books,
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
    APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default fetchBooksHandler;
