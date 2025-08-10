import { Request, Response } from "express";
import CategoryRepo from "../../../database/repository/categoryRepo";
import APIResponse from "../../../utils/api";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

const deleteCategoryHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id: categoryId } = req.params;

    // Ensuring user is authenticated and has admin role
    if (!req.user || req.user.role !== "admin") {
      return APIResponse.error(
        "Forbidden: You do not have permission to delete categories",
        403
      ).send(res);
    }

    // Finding category before deletion
    const category = await CategoryRepo.findById(categoryId);
    if (!category) {
      return APIResponse.error("Category not found", 404).send(res);
    }

    // Deleting category
    await CategoryRepo.deleteCategory(categoryId);

    return APIResponse.success(
      { message: "Category deleted successfully", data: category },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default deleteCategoryHandler;
