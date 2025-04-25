import { Request, Response } from "express";
import BorrowingRepo from "../../../database/repository/borrowRepo";
import APIResponse from "../../../utils/api";

const getAllBorrowingsHandler = async (req: Request, res: Response) => {
  try {
    const borrows = await BorrowingRepo.getAllBorrowings();

    if (!borrows || borrows.length === 0) {
      return APIResponse.error("No borrowings found", 404).send(res);
    }

    return APIResponse.success(
      { message: "Borrowings retrieved successfully", data: borrows },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default getAllBorrowingsHandler;
