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

  // Get all categories
  static async getAllCategories(): Promise<CategoryType[]> {
    return CategoryModel.find();
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
