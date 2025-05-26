import { CategoryType } from "../../validationSchema/category";
import CategoryModel, { Category } from "../models/category";

export default class CategoryRepo {
  // Create Category
  static async createCategory(category: CategoryType): Promise<Category> {
    return await CategoryModel.create(category);
  }

  // Find by ID
  static async findById(categoryId: string): Promise<CategoryType | null> {
    return CategoryModel.findById(categoryId);
  }

  // Get all categories with pagination
  static async getAllCategories({
    skip = 0,
    limit = 10,
  }: {
    skip?: number;
    limit?: number;
  }): Promise<Category[]> {
    return CategoryModel.find().skip(skip).limit(limit);
  }

  // Count for total documents
  static async getTotalCategoryCount(): Promise<number> {
    return CategoryModel.countDocuments();
  }

  // Delete category
  static async deleteCategory(
    categoryId: string
  ): Promise<CategoryType | null> {
    return CategoryModel.findByIdAndDelete(categoryId);
  }

  // Update category
  static async updateCategory(
    id: string,
    updateParams: Partial<CategoryType>
  ): Promise<CategoryType | null> {
    return CategoryModel.findByIdAndUpdate(id, updateParams, { new: true });
  }
}
