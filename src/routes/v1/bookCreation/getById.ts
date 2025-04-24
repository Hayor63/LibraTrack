import { Request, Response } from "express";
import mongoose from "mongoose";
import BookCreationRepo from "../../../database/repository/bookCreationRepo";
import APIResponse from "../../../utils/api";

const getBookByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id: bookId } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return APIResponse.error("Invalid book ID", 400).send(res);
    }

    // Fetch book from database
    const book = await BookCreationRepo.getBookById(bookId);

    // Check if book exists
    if (!book) {
      return APIResponse.error("Book not found", 404).send(res);
    }

    // Return success response
    return APIResponse.success(
      { message: "Book retrieved successfully", data: book },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default getBookByIdHandler;
