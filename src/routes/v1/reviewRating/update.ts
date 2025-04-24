import { updateReviewsAndRatingSchemaType } from './../../../validationSchema/reviewAndRating';
import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import mongoose from "mongoose";
import RatingAndReviewsRepo from '../../../database/repository/ratingAndReviewsRepo';

const updateReviewHandler = async (
  req: Request<
    updateReviewsAndRatingSchemaType["params"],
    {},
    updateReviewsAndRatingSchemaType["body"]
  >,
  res: Response
) => {
  try {
    const { id } = req.params; // renamed from bookId for clarity
    const updatedData = req.body;

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return APIResponse.error("Invalid Review ID", 400).send(res);
    }

    // Ensure that update data is not empty
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return APIResponse.error("No update data provided", 400).send(res);
    }

    const updatedReview = await RatingAndReviewsRepo.updateReviews(id, updatedData);
    if (!updatedReview) {
      return APIResponse.error("Review not found", 404).send(res);
    }

    return APIResponse.success(
      { message: "Review updated successfully", data: updatedReview },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default updateReviewHandler;
