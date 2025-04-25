import { Request, Response } from "express";
import BorrowingRepo from "../../../database/repository/borrowRepo";
import APIResponse from "../../../utils/api";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

const deleteBorrowingHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Find borrowing before deletion
    const borrowing = await BorrowingRepo.getBorrowingById(id);
    if (!borrowing) {
      return APIResponse.error("Borrowing not found", 404).send(res);
    }

    // Delete borrowing
    await BorrowingRepo.deleteBorrowing(id);

    return APIResponse.success(
      { message: "Borrowing deleted successfully" },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default deleteBorrowingHandler;
