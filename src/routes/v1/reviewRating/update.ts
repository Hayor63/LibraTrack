import { updateReviewsAndRatingSchemaType } from './../../../validationSchema/reviewAndRating';
import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import mongoose from "mongoose";
import RatingAndReviewsRepo from '../../../database/repository/ratingAndReviewsRepo';


interface AuthenticatedRequest extends Request {
  user?: { _id: string };
  isAdmin?: boolean;  
}

const updateReviewHandler = async (
  req: AuthenticatedRequest,  
  res: Response
) => {
  try {
    const { id } = req.params;  
    const updatedData = req.body;  
    const userId = req.user?._id;  

    // Checking if the user is authenticated
    if (!userId) {
      return APIResponse.error("User not authenticated", 401).send(res);
    }

    // Validating if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return APIResponse.error("Invalid Review ID", 400).send(res);
    }

    // Ensuring that update data is not empty
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return APIResponse.error("No update data provided", 400).send(res);
    }

    // Retrieving the review to check if the logged-in user is allowed to update it
    const review = await RatingAndReviewsRepo.findById(id);

    if (!review) {
      return APIResponse.error("Review not found", 404).send(res);
    }

    // Checking if the logged-in user is the creator of the review or an admin
    if (review.userId.toString() !== userId.toString() && !req.isAdmin) {
      return APIResponse.error("You are not authorized to update this review", 403).send(res);
    }

    // Then Proceed to update the review if authorized
    const updatedReview = await RatingAndReviewsRepo.updateReviews(id, updatedData);
    
    return APIResponse.success(
      { message: "Review updated successfully", data: updatedReview },
      200
    ).send(res);

  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default updateReviewHandler;
