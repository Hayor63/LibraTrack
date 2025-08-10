import { Request, Response } from "express";
import CategoryRepo from "../../../database/repository/categoryRepo";
import APIResponse from "../../../utils/api";

const getAllCategoriesHandler = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.pageNumber) || 1);
    const limit = Math.max(1, Number(req.query.pageSize) || 10);
    const skip = (page - 1) * limit;

    // Fetching paginated data and total count
    const [categories, totalItems] = await Promise.all([
      CategoryRepo.getAllCategories({ skip, limit }),
      CategoryRepo.getTotalCategoryCount(),
    ]);

    if (!categories || categories.length === 0) {
      return APIResponse.error("No categories found", 404).send(res);
    }

    return APIResponse.success(
      {
        message: "Categories retrieved successfully",
        data: categories,
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

export default getAllCategoriesHandler;
