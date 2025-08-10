import { Request, Response } from "express";
import RatingAndReviewsRepo from "../../../database/repository/ratingAndReviewsRepo";
import APIResponse from "../../../utils/api";

const getAllReviewsHandler = async (req: Request, res: Response) => {
  try {
    const {
      pageNumber,
      pageSize,
      sortField,
      sortType,
      userId,
      ...restFilters
    } = req.query;

    // Building filter object
    let filter = {
      ...restFilters, 
    };

    // Setting pagination parameters
    const page = Math.max(1, Number(pageNumber) || 1);
    const limit = Math.max(1, Number(pageSize) || 10);

    // Building sort logic
    const sortLogic =
      sortField && sortType
        ? {
            [sortField as string]: sortType as string | number,
          }
        : undefined;

    // Getting paginated reviews
    const { data: reviews, totalItems } =
      await RatingAndReviewsRepo.getAllReviews({
        pageNumber: page,
        pageSize: limit,
        filter,
        sortLogic,
      });
    // Handling the case where no reviews are found
    if (reviews.length === 0) {
      return APIResponse.error("No reviews or ratings found", 404).send(res);
    }

    return APIResponse.success(
      {
        message: "Reviews and ratings retrieved successfully",
        data: reviews,
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
        },
      },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default getAllReviewsHandler;
