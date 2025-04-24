import { Request, Response } from "express";
import mongoose from "mongoose";
import APIResponse from "../../../utils/api";
import RatingAndReviewsRepo from "../../../database/repository/ratingAndReviewsRepo";

const ReviewsByIdHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // ✅ Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return APIResponse.error("Invalid Review and Rating ID", 400).send(res);
    }

    const review = await RatingAndReviewsRepo.findById(id);

    if (!review) {
      return APIResponse.error("Review and rating not found", 404).send(res);
    }

    return APIResponse.success(
      {
        message: "Review and rating retrieved successfully",
        data: review,
      },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default ReviewsByIdHandler;
