import { Request, Response } from "express";
import CategoryRepo from "../../../database/repository/categoryRepo";
import APIResponse from "../../../utils/api";

const getSingleCategoryHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const getSingleCategory = await CategoryRepo.findById(id);

    // Check if the category exists
    if (!getSingleCategory) {
      return APIResponse.error("Category not found", 404).send(res);
    }

    return APIResponse.success(
      { message: "Category retrieved successfully", data: getSingleCategory },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default getSingleCategoryHandler;
