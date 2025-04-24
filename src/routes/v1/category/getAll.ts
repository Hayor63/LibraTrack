import { Request, Response } from "express";
import CategoryRepo from "../../../database/repository/categoryRepo";
import APIResponse from "../../../utils/api";

const getAllCategoriesHandler = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryRepo.getAllCategories();
    if (!categories || categories.length === 0){
      return APIResponse.error("No categories found", 404).send(res);
    }
    return APIResponse.success(
      { message: "Categories retrieved successfully", data: categories },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default getAllCategoriesHandler;
