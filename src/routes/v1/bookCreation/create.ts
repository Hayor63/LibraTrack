import { Request, Response } from "express";
import mongoose from "mongoose";
import APIResponse from "../../../utils/api";
import userRepo from "../../../database/repository/userRepo";
import BookCreationRepo from "../../../database/repository/bookCreationRepo";
import GenreModel from "../../../database/models/genre"; // ✅ Import Genre model
import CategoryModel from "../../../database/models/category"; // ✅ Import Category model

interface AuthenticatedRequest extends Request {
  user?: { _id: string };
}

const createBookHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Check if the request body is empty
    if (Object.keys(req.body).length === 0) {
      return APIResponse.error("Book data is required", 400).send(res);
    }

    // Validate authenticated user
    const userId = req.user?._id;
    if (!userId) {
      return APIResponse.error("User not authenticated", 401).send(res);
    }

    // Validate user existence
    const user = await userRepo.findById(userId);
    if (!user) {
      return APIResponse.error("Invalid userId: User does not exist", 400).send(
        res
      );
    }

    // Extract book details from request body
    const {
      title,
      author,
      publicationYear,
      totalCopies,
      copiesAvailable,
      isReserved,
      genreId,
      categoryId,
    } = req.body;

    // Validate genreId is a valid ObjectId and exists in the database
    if (!mongoose.Types.ObjectId.isValid(genreId)) {
      return APIResponse.error("Invalid genre ID format", 400).send(res);
    }
    const genreExists = await GenreModel.findById(genreId);
    if (!genreExists) {
      return APIResponse.error("Genre not found", 404).send(res);
    }

    // Validate categoryId is a valid ObjectId and exists in the database
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return APIResponse.error("Invalid category ID format", 400).send(res);
    }
    const categoryExists = await CategoryModel.findById(categoryId);
    if (!categoryExists) {
      return APIResponse.error("Category not found", 404).send(res);
    }

    // Prepare book data for saving
    const bookData = {
      userId: new mongoose.Types.ObjectId(userId),
      genreId,
      categoryId,
      title,
      author,
      publicationYear,
      totalCopies,
      copiesAvailable,
      isReserved,
    };

    // Create the book in the database
    const book = await BookCreationRepo.createBook(bookData);

    return APIResponse.success(
      { message: "Book created successfully", data: book },
      201
    ).send(res);
  } catch (error) {
    console.error("Error creating book:", error);
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default createBookHandler;
