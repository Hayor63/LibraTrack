import { Request, Response } from "express";
import userRepo from "../../../database/repository/userRepo";
import APIResponse from "../../../utils/api";
import mongoose from "mongoose";
import BookCreationModel from "../../../database/models/bookCreation";
import BorrowingRepo from "../../../database/repository/borrowRepo";

interface AuthenticatedRequest extends Request {
  user?: { _id: string };
}

const createBorrowingHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id: bookId } = req.params;

    // Validate authenticated user
    const userId = req.user?._id;
    if (!userId) {
      return APIResponse.error("User not authenticated", 401).send(res);
    }

    // Validate user existence
    const user = await userRepo.findById(userId);
    if (!user) {
      return APIResponse.error("Invalid userId: User does not exist", 400).send(res);
    }

    // Checking user active borrowings 
    const activeBorrows = await BorrowingRepo.getUserActiveBorrowings(userId);
    const BorrowLimit = 5;
    if (activeBorrows.length >= BorrowLimit) {
      return APIResponse.error(
        "Borrowing limit reached. Please return some books first.",
        403
      ).send(res);
    }

    // Extracting borrowDate and dueDate from request body
    const { borrowDate, dueDate } = req.body;

    // Validating bookId is a valid ObjectId and exists in the database
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return APIResponse.error("Invalid book ID format", 400).send(res);
    }

    const bookExists = await BookCreationModel.findById(bookId);
    if (!bookExists) {
      return APIResponse.error("Book not found", 404).send(res);
    }

    // Check book availability
    if (bookExists.copiesAvailable <= 0) {
      return APIResponse.error(
        "This book is currently unavailable for borrowing",
        400
      ).send(res);
    }

    // Checking if user already borrowed the same book and hasn't returned it
    const existingBorrow = await BorrowingRepo.findActiveBorrow(userId, bookId);
    if (existingBorrow) {
      return APIResponse.error(
        "You have already borrowed this book and haven't returned it yet.",
        400
      ).send(res);
    }

    // Prepare the borrow data
    const borrowData = {
      bookId: new mongoose.Types.ObjectId(bookId), 
      userId: new mongoose.Types.ObjectId(userId),
      borrowDate: borrowDate || new Date(),
      dueDate: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Default 14 days
      isReturned: false,
      lateFee: 0,
    };

    // Decrease the book's available copies atomically to prevent race conditions
    const updatedBook = await BookCreationModel.findOneAndUpdate(
      { _id: bookId, copiesAvailable: { $gt: 0 } },
      { $inc: { copiesAvailable: -1 } },
      { new: true }
    );

    if (!updatedBook) {
      return APIResponse.error(
        "The book is no longer available for borrowing.",
        400
      ).send(res);
    }

    // Create the borrow record
    const newBorrow = await BorrowingRepo.createBorrowing(borrowData);

    return APIResponse.success(
      { message: "Book borrowed successfully", data: newBorrow },
      201
    ).send(res);
  } catch (error) {
    console.error("Error creating borrow record:", error);
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default createBorrowingHandler;
