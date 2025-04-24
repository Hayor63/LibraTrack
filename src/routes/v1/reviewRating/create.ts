import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import userRepo from "../../../database/repository/userRepo";
import RatingAndReviewsRepo from "../../../database/repository/ratingAndReviewsRepo";
import mongoose from "mongoose";
import BookCreationModel from "../../../database/models/bookCreation";
import { createReviewSchemaType } from "../../../validationSchema/reviewAndRating";

interface AuthenticatedRequest extends Request {
  user?: { _id: string };
}

const createReviewsAndRating = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { bookId, review, rating } = req.body;

  try {
    // Get and validate user ID
    const userId = req.user?._id;
    console.log("Authenticated user:", req.user);
    if (!userId) {
      return APIResponse.error("User not authenticated", 401).send(res);
    }

    const user = await userRepo.findById(userId);
    if (!user) {
      return APIResponse.error("User does not exist", 400).send(res);
    }

    // Validate bookId format
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return APIResponse.error("Invalid book ID format", 400).send(res);
    }

    // Check book existence
    const bookExists = await BookCreationModel.findById(bookId);
    if (!bookExists) {
      return APIResponse.error("Book not found", 404).send(res);
    }

    const existingReview = await RatingAndReviewsRepo.findByUserAndBook(
      userId,
      bookId
    );

    if (existingReview) {
      return APIResponse.error("You have already reviewed this book", 400).send(
        res
      );
    }

    // Prepare review data
    const reviewsAndRatingData = {
      bookId,
      review,
      rating,
      userId: req.user?._id, // from the token (you get this from middleware)
    };

    const reviewsAndRating = await RatingAndReviewsRepo.createReviewsAndRating(
      reviewsAndRatingData
    );

    return APIResponse.success(
      {
        message: "Review and rating created successfully",
        data: reviewsAndRating,
      },
      201
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default createReviewsAndRating;
