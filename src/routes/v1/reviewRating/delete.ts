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
    const { id } = req.params;

    const review = await RatingAndReviewsRepo.findById(id);
    if (!review) {
      return APIResponse.error("Review not found", 404).send(res);
    }

    // Check permission: only the owner or admin can delete
    if (
      review.userId.toString() !== req.user?._id &&
      req.user?.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ error: "You can only delete your own review or be an admin" });
    }

    await RatingAndReviewsRepo.deleteReview(id);

    return APIResponse.success(
      { message: "Review deleted successfully", data: review },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default deleteReviewHandler;
