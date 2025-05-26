import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import RatingAndReviewsRepo from "../../../database/repository/ratingAndReviewsRepo";


interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

const deleteReviewHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id: reviewId } = req.params;

    // Ensure authenticated user exists
    if (!req.user) {
      return APIResponse.error("User not authenticated", 401).send(res);
    }

    // Get the review from the repository
    const review = await RatingAndReviewsRepo.findById(reviewId);
    if (!review) {
      return APIResponse.error("Review not found", 404).send(res);
    }

    // Check if the authenticated user is the owner of the comment
    if (review.userId.toString() !== req.user._id &&  req.user?.role !== "admin") {
      return APIResponse.error("You can only delete your own review or be an admin", 403).send(res);
    }

    // Delete the review
    await RatingAndReviewsRepo.deleteReview(reviewId);

    return APIResponse.success(
      { message: "review deleted ", data: review },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default deleteReviewHandler;
