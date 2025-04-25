import { Request, Response } from "express";
import { updateBorrowSchemaType } from "../../../validationSchema/borrowing";
import mongoose from "mongoose";
import APIResponse from "../../../utils/api";
import BorrowingRepo from "../../../database/repository/borrowRepo";

const updateBorrowingHandler = async (
  req: Request<
    updateBorrowSchemaType["params"],
    {},
    Partial<updateBorrowSchemaType["body"]>
  >,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updatedData: Partial<updateBorrowSchemaType["body"]> = req.body;

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return APIResponse.error("Invalid Borrowing ID", 400).send(res);
    }

    // Ensure update data is not empty
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return APIResponse.error("No update data provided", 400).send(res);
    }

    // Check if the borrowing exists before updating
    const existingBorrowing = await BorrowingRepo.getBorrowingById(id);
    if (!existingBorrowing) {
      return APIResponse.error("Borrowing not found", 404).send(res);
    }

    const updatedBorrowing = await BorrowingRepo.updateBorrowing(id, updatedData);
    if (!updatedBorrowing) {
      return APIResponse.error("Failed to update borrowing", 500).send(res);
    }

    return APIResponse.success(
      { message: "Borrowing updated successfully", data: updatedBorrowing },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};


export default updateBorrowingHandler;