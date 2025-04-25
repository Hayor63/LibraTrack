import { Request, Response } from "express";
import mongoose from "mongoose";
import APIResponse from "../../../utils/api";
import BorrowingRepo from "../../../database/repository/borrowRepo";
import BookCreationModel from "../../../database/models/bookCreation";

const returnBookHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate Borrowing ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return APIResponse.error("Invalid Borrowing ID", 400).send(res);
    }

    // Fetch borrowing record
    const existingBorrowing = await BorrowingRepo.getBorrowingById(id);
    if (!existingBorrowing) {
      return APIResponse.error("Borrowing record not found", 404).send(res);
    }

    // Check if already returned
    if (existingBorrowing.isReturned) {
      return APIResponse.error("Book has already been returned", 400).send(res);
    }

    // Set return date
    const returnDate = new Date();

    // Calculate late fee
    const oneDay = 24 * 60 * 60 * 1000;
    const dueDate = new Date(existingBorrowing.dueDate);
    const daysLate = Math.max(
      Math.ceil((returnDate.getTime() - dueDate.getTime()) / oneDay),
      0
    );
    const lateFee = daysLate * 1; // 1 unit per late day

    // Update borrowing record with return info
    const updatedBorrowing = await BorrowingRepo.updateBorrowing(id, {
      isReturned: true,
      returnDate,
      lateFee,
    });

    if (!updatedBorrowing) {
      return APIResponse.error("Failed to update borrowing record", 500).send(
        res
      );
    }

    // Increase book copiesAvailable
    const book = await BookCreationModel.findById(existingBorrowing.bookId);
    if (!book) {
      return APIResponse.error("Book not found", 404).send(res);
    }

    book.copiesAvailable += 1;
    await book.save();

    // Return response
    return APIResponse.success(
      {
        message: "Book returned successfully",
        data: {
          borrowingId: id,
          returnDate,
          lateFee,
        },
      },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error(
      (error as Error).message || "An error occurred while returning the book",
      500
    ).send(res);
  }
};

export default returnBookHandler;

