import { Request, Response } from "express";
import CategoryRepo from "../../../database/repository/categoryRepo";
import APIResponse from "../../../utils/api";
import CategoryModel from "../../../database/models/category";

const createCategoryHandler = async (req: Request, res: Response) => {
    try {
         // Extract name from request body
        const { name } = req.body;

        if (!name) {
            return APIResponse.error("Category name is required", 400).send(res);
        }

        // Check if category already exists
        const existingCategory = await CategoryModel.findOne({ name });
        if (existingCategory) {
            return APIResponse.error("Category already exists", 400).send(res);
        }

        // Create the category
        const newCategory = await CategoryRepo.createCategory(req.body);
        return APIResponse.success(
            { message: "Category created successfully", data: newCategory },
            201
        ).send(res);
        
    } catch (error) {
        return APIResponse.error((error as Error).message, 500).send(res);
    }
};

export default createCategoryHandler;
