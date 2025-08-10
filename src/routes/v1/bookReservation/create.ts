import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import userRepo from "../../../database/repository/userRepo";
import BookCreationRepo from "../../../database/repository/bookCreationRepo";
import BookReservationRepo from "../../../database/repository/bookResevationRepo";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
  user?: { _id: string };
}

const createReservationHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { bookId } = req.params;
  const { status } = req.body;
  const userId = req.user?._id;

  try {
    // Validating authenticated user
    if (!userId) {
      return APIResponse.error("User not authenticated", 401).send(res);
    }

    // Validating user existence
    const user = await userRepo.findById(userId);
    if (!user) {
      return APIResponse.error("Invalid userId: User does not exist", 400).send(
        res
      );
    }

    // Finding the book
    const book = await BookCreationRepo.getBookById(bookId);
    if (!book) {
      return APIResponse.error("Book not found", 400).send(res);
    }

    // Checking if the book is available
    if (book.copiesAvailable <= 0) {
      return APIResponse.error("Book not available", 400).send(res);
    }

    // Checking if the user already has an active reservation for the book
    const existingReservation =
      await BookReservationRepo.getReservationByUserAndBook(userId, bookId);

    // If the user already has a pending reservation, prevent creating a new one
    if (existingReservation && existingReservation.status === "pending") {
      return APIResponse.error(
        "You already have an active reservation for this book",
        400
      ).send(res);
    }

    // Proceeding to create reservation if the book is available and no active reservation exists
    const reservationData = {
      bookId: new mongoose.Types.ObjectId(bookId),
      userId: new mongoose.Types.ObjectId(userId),
      reservationDate: new Date(),
      expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Set expiration to 3 days
      status: status || "pending", // Default status to 'pending'
    };

    const reservation = await BookReservationRepo.createReservation(
      reservationData
    );

    // Updating book status to reserved
    await BookCreationRepo.updateById(bookId, { isReserved: true });

    return APIResponse.success(
      { message: "Book reserved successfully", data: reservation },
      201
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default createReservationHandler;
