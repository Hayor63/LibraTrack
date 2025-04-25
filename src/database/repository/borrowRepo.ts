import BorrowModel from "../models/borrowing";
import { Borrow } from "../models/borrowing"; // Assuming this is the Typegoose class

export default class BorrowingRepo {
  // Create borrowing
  static async createBorrowing(borrowing: Partial<Borrow>): Promise<Borrow> {
    return await BorrowModel.create(borrowing);
  }

  // Get all borrowings
  static async getAllBorrowings(): Promise<Borrow[]> {
    return await BorrowModel.find()
      .populate("userId", "name email")
      .populate("bookId", "title author")
      .lean()
      .exec();
  }

  // Get borrowing by ID
  static async getBorrowingById(id: string): Promise<Borrow | null> {
    return await BorrowModel.findById(id)
      .populate("userId", "name email")
      .populate("bookId", "title author")
      .lean()
      .exec();
  }

  // Delete borrowing by ID
  static async deleteBorrowing(id: string): Promise<Borrow | null> {
    return await BorrowModel.findByIdAndDelete(id).lean().exec();
  }

  // Update borrowing by ID
  static async updateBorrowing(
    id: string,
    updateParams: Partial<Borrow>
  ): Promise<Borrow | null> {
    return await BorrowModel.findByIdAndUpdate(id, updateParams, {
      new: true,
      runValidators: true,
    })
      .populate("userId", "name email")
      .populate("bookId", "title author")
      .lean()
      .exec();
  }

  static async findActiveBorrow(userId: string, bookId: string): Promise<any | null> {
    return await BorrowModel.findOne({
      userId,
      bookId,
      isReturned: false
    }).lean().exec();
  }

  static getUserActiveBorrowings(userId: string): Promise<Borrow[]> {
    return BorrowModel.find({ userId, isReturned: false })
      .populate("bookId", "title author")
      .lean()
      .exec();
  }
  
}
