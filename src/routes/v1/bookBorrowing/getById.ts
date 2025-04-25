import { Request, Response } from "express";
import mongoose from "mongoose";
import APIResponse from "../../../utils/api";
import BorrowingRepo from "../../../database/repository/borrowRepo";

const getBorrowByIdHandler = async (req: Request, res: Response) => {
  const { id: borrowId } = req.params;
  try {
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(borrowId)) {
      return APIResponse.error("Invalid borrow ID", 400).send(res);
    }

    // fetch book from database
    const borrow = await BorrowingRepo.getBorrowingById(borrowId);
    if (!borrow) {
      return APIResponse.error("Borrow record not found", 404).send(res);
    }

    // Return success response
    return APIResponse.success(
      { message: "Borrow record retrieved successfully", data: borrow },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default getBorrowByIdHandler 