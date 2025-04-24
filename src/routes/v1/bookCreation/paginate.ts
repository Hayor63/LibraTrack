import { Request, Response } from "express";
import BookCreationRepo from "../../../database/repository/bookCreationRepo";
import APIResponse from "../../../utils/api";


const fetchBooksHandler: (
    req: Request,
    res: Response
  ) => Promise<void> = async (req, res) => {
    try {
      const { pageNumber, pageSize, sortField, sortType, search, ...rest } =
        req.query;
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
  
      const books = await BookCreationRepo.getPaginatedBook({
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
        { message: "books retrieved successfully", data: books },
        200
      ).send(res);
    } catch (error) {
        APIResponse.error((error as Error).message, 500).send(res);
    }
  };
  export default fetchBooksHandler;
  