import { formatResponseRecord } from "../../utils/formatter";
import { PartialLoose } from "../../utils/helper";
import BorrowModel from "../models/borrowing";
import { Borrow } from "../models/borrowing"; // Assuming this is the Typegoose class

class BookExtend extends Borrow {
  createdAt: string;
}

type SortLogic = PartialLoose<BookExtend, "asc" | "desc" | 1 | -1>;
const defaultSortLogic: SortLogic = { createdAt: -1 };
export interface PaginatedFetchParams {
  pageNumber: number;
  pageSize: number;
  filter: Record<string, any>;
  sortLogic: SortLogic;
  search: string;
}

export default class BorrowingRepo {
  // Create a new borrowing
  static createBorrowing: (bookCreation: Borrow) => Promise<Borrow> = async (
    borrow
  ) => {
    const data = await BorrowModel.create(borrow);
    return data;
  };

  // Get all borrowings with pagination, filtering, and sorting
  static getAllBorrowings = async ({
    pageNumber = 1,
    pageSize = 10,
    filter: _filter,
    sortLogic = defaultSortLogic,
    search,
  }: Partial<PaginatedFetchParams>): Promise<{
    data: Borrow[];
    totalItems: number;
  }> => {
    // Build filter
    const filter = {
      ...(_filter || {}),
      ...(search ? { title: { $regex: search, $options: "i" } } : {}),
    };
  
    const skip = (pageNumber - 1) * pageSize;
  
    const [books, totalItems] = await Promise.all([
      BorrowModel.find(filter)
        .sort(sortLogic)
        .populate({
          path: "bookId",
          select: "title author publicationYear categoryId genreId",
          populate: [
            { path: "categoryId", select: "name description" },
            { path: "genreId", select: "name" },
          ],
        })
        .populate("userId", "userName email")
        .skip(skip)
        .limit(pageSize)
        .lean()
        .exec(),
  
      BorrowModel.countDocuments(filter),
    ]);
  
    const formattedBooks: Borrow[] = books.map((book) =>
      formatResponseRecord(book)
    );
  
    return { data: formattedBooks, totalItems };
  };
  

  // Get borrowing by ID
  static async getBorrowingById(id: string): Promise<Borrow | null> {
    return await BorrowModel.findById(id)
      .populate("userId", "name email")
      .populate("bookId", "title author")
      .lean()
      .exec();
  }

  //get Borrowings by userId
  static async getBorrowingsByUserId(userId: string): Promise<Borrow[]> {
    return await BorrowModel.find({ userId })
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

  static async findActiveBorrow(
    userId: string,
    bookId: string
  ): Promise<any | null> {
    return await BorrowModel.findOne({
      userId,
      bookId,
      isReturned: false,
    })
      .lean()
      .exec();
  }

  static getUserActiveBorrowings(userId: string): Promise<Borrow[]> {
    return BorrowModel.find({ userId, isReturned: false })
      .populate("bookId", "title author")
      .lean()
      .exec();
  }

  //get borrrowing history 
  static getAllBorrowingsHistory = async ({
    pageNumber = 1,
    pageSize = 10,
    filter: _filter,
    sortLogic = defaultSortLogic,
    search,
  }: Partial<PaginatedFetchParams>): Promise<{
    data: Borrow[];
    totalItems: number;
  }> => {
    // Build filter
    const filter = {
      ...(_filter || {}),
      ...(search ? { title: { $regex: search, $options: "i" } } : {}),
    };
  
    const skip = (pageNumber - 1) * pageSize;
  
    const [books, totalItems] = await Promise.all([
      BorrowModel.find(filter)
        .sort(sortLogic)
        .populate({
          path: "bookId",
          select: "title author publicationYear categoryId genreId",
          populate: [
            { path: "categoryId", select: "name description" },
            { path: "genreId", select: "name" },
          ],
        })
        .populate("userId", "userName email")
        .skip(skip)
        .limit(pageSize)
        .lean()
        .exec(),
  
      BorrowModel.countDocuments(filter),
    ]);
  
    const formattedBooks: Borrow[] = books.map((book) =>
      formatResponseRecord(book)
    );
  
    return { data: formattedBooks, totalItems };
  };

}
