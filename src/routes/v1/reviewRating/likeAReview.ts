import { Request, Response } from "express";
import mongoose from "mongoose";
import APIResponse from "../../../utils/api";
import RatingAndReviewsRepo from "../../../database/repository/ratingAndReviewsRepo";
import ReviewsAndRatingModel from "../../../database/models/reviewsAndRating";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const likeAReviewHandler = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?._id;
  const { id: reviewId } = req.params;

  if (!userId) {
    return APIResponse.error("User not authenticated", 401).send(res);
  }

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    return APIResponse.error("Invalid review ID", 400).send(res);
  }

  try {
    const review = await RatingAndReviewsRepo.findById(reviewId);

    if (!review) {
      return APIResponse.error("Review not found", 404).send(res);
    }

    if (review.likes?.includes(userId)) {
      return APIResponse.error("You already liked this review", 400).send(res);
    }

    //updating the review by adding the userId to the likes and incrementing the likes count
    const updatedReview = await ReviewsAndRatingModel.findByIdAndUpdate(
      reviewId,
      { $addToSet: { likes: userId }, 
      $inc: { likeCount: 1 } 
    },
      { new: true }
    );

   


    return APIResponse.success(
      { message: "Review liked", data: updatedReview },
      200
    ).send(res);
  } catch (error) {
    console.error("Like Review Error:", error); // Optional logging
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default likeAReviewHandler;
