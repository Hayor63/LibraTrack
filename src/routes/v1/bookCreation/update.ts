import { Request, Response } from "express";
import { updateBookSchemaType } from "../../../validationSchema/bookCreation";
import APIResponse from "../../../utils/api";
import mongoose from "mongoose";
import BookCreationRepo from "../../../database/repository/bookCreationRepo";

const updateBookHandler = async (
  req: Request<
    updateBookSchemaType["params"],
    {},
    Partial<updateBookSchemaType["body"]>
  >,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updatedData: Partial<updateBookSchemaType["body"]> = req.body;

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return APIResponse.error("Invalid Book ID", 400).send(res);
    }

    // Ensure update data is not empty
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return APIResponse.error("No update data provided", 400).send(res);
    }

    // Check if the book exists before updating
    const existingBook = await BookCreationRepo.getBookById(id);
    if (!existingBook) {
      return APIResponse.error("Book not found", 404).send(res);
    }

    const updatedBook = await BookCreationRepo.updateById(id, updatedData);
    if (!updatedBook) {
      return APIResponse.error("Failed to update book", 500).send(res);
    }

    return APIResponse.success(
      { message: "Book updated successfully", data: updatedBook },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default updateBookHandler;
