import { Request, Response } from "express";
import { updateCategorySchemaType } from "../../../validationSchema/category";
import CategoryRepo from "../../../database/repository/categoryRepo";
import APIResponse from "../../../utils/api";
import mongoose from "mongoose";

const updateCategoryHandler = async (
  req: Request<
    updateCategorySchemaType["params"],
    {},
    updateCategorySchemaType["body"]
  >,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Validating if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return APIResponse.error("Invalid Category ID", 400).send(res);
    }

    // Ensuring that update data is not empty
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return APIResponse.error("No update data provided", 400).send(res);
    }

    const updatedCategory = await CategoryRepo.updateCategory(id, updatedData);
    if (!updatedCategory) {
      return APIResponse.error("Category not found", 404).send(res);
    }
    return APIResponse.success(
      { message: "Category updated successfully", data: updatedCategory },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default updateCategoryHandler;
