import { Request, Response } from "express";
import mongoose from "mongoose";
import APIResponse from "../../../utils/api";
import BookCreationRepo from "../../../database/repository/bookCreationRepo";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

const deleteBookHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: bookId } = req.params;

    // Validating ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return APIResponse.error("Invalid Book ID", 400).send(res);
    }

    // Finding book before deletion
    const book = await BookCreationRepo.getBookById(bookId);
    if (!book) {
      return APIResponse.error("Book not found", 404).send(res);
    }

    // Deleting book
    await BookCreationRepo.deleteBook(bookId);

    return APIResponse.success(
      { message: "Book deleted successfully", data: book },
      200
    ).send(res);
    
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default deleteBookHandler;
