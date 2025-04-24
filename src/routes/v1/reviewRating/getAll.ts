import { Request, Response } from "express";
import RatingAndReviewsRepo from "../../../database/repository/ratingAndReviewsRepo";
import APIResponse from "../../../utils/api";

const getAllReviewsHandler = async (req: Request, res: Response) => {
  try {
    const reviews = await RatingAndReviewsRepo.getAll();

    if (reviews.length === 0) {
      return APIResponse.error("No reviews or ratings found", 404).send(res);
    }

    return APIResponse.success(
      { message: "Reviews and ratings retrieved successfully", data: reviews },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default getAllReviewsHandler;
