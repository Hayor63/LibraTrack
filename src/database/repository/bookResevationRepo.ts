import { DocumentType } from "@typegoose/typegoose";
import BookReservationModel, {
  BookReservation,
} from "../models/bookReservation";
import { PartialLoose } from "../../utils/helper";
import { formatResponseRecord } from "../../utils/formatter";

type BookReservationInput = {
  bookId: string;
  userId: string;
  reservationDate: Date;
  expirationDate: Date;
  status: "pending" | "fulfilled" | "canceled";
};

class BookExtend extends BookReservation {
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


export default class BookReservationRepo {
  static createReservation: (
    bookReservation: BookReservation
  ) => Promise<BookReservation> = async (reserve) => {
    return await BookReservationModel.create(reserve);
  };

  //find by Id
  static async getReservationById(id: string) {
    return BookReservationModel.findById(id);
  }

  // Get all Reservations
  static getAllReservations = async ({
    pageNumber = 1,
    pageSize = 10,
    filter: _filter,
    sortLogic = defaultSortLogic,
    search,
  }: Partial<PaginatedFetchParams>): Promise<{
    data: BookReservation[];
    totalItems: number;
  }> => {
    // Build filter
    const filter = {
      ...(_filter || {}),
      ...(search ? { title: { $regex: search, $options: "i" } } : {}),
    };
  
    const skip = (pageNumber - 1) * pageSize;
  
    const [books, totalItems] = await Promise.all([
      BookReservationModel.find(filter)
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
  
      BookReservationModel.countDocuments(filter),
    ]);
  
    const formattedBooks: BookReservation[] = books.map((book) =>
      formatResponseRecord(book)
    );
  
    return { data: formattedBooks, totalItems };
  };

  // Count for total documents
  static async getTotalReservationCount(): Promise<number> {
    return BookReservationModel.countDocuments();
  }

  // Get reservations by user with pagination
  static async getReservationsByUser({
    userId,
    skip = 0,
    limit = 10,
  }: {
    userId: string;
    skip?: number;
    limit?: number;
  }): Promise<DocumentType<BookReservation>[]> {
    return BookReservationModel.find({ userId })
      .skip(skip)
      .limit(limit)
      .populate([
        {
          path: "bookId",
          select: "title author publicationYear totalCopies copiesAvailable",
          populate: [
            { path: "categoryId", select: "name description" },
            { path: "genreId", select: "name" },
          ],
        },
      ]);
  }

    // Count user  reservation documents
    static async getUserReservationCount(id:string): Promise<number> {
      return BookReservationModel.countDocuments();
    }

  //delete Reservation
  static deleteReservation = async (id: string) => {
    return await BookReservationModel.findByIdAndDelete(id);
  };


  // Get book history by user with pagination
  static async getBookReservationHistory({
    userId,
    skip = 0,
    limit = 10,
  }: {
    userId: string;
    skip?: number;
    limit?: number;
  }): Promise<DocumentType<BookReservation>[]> {
    return BookReservationModel.find({ userId ,  status: { $ne: "pending" },})
      .skip(skip)
      .limit(limit)
      .populate([
        {
          path: "bookId",
          select: "title author publicationYear totalCopies copiesAvailable",
          populate: [
            { path: "categoryId", select: "name description" },
            { path: "genreId", select: "name" },
          ],
        },
      ]);
  }

 // Count user  history documents
    static async getUserHistoryCount(id:string): Promise<number> {
      return BookReservationModel.countDocuments();
    }


  // Update Reservation
  static async updateReservation(
    id: string,
    updateParams: Partial<BookReservation> // use the class, not Zod type
  ): Promise<DocumentType<BookReservation> | null> {
    const updatedReservation = await BookReservationModel.findByIdAndUpdate(
      id,
      updateParams,
      {
        new: true,
        runValidators: true,
      }
    );

    return updatedReservation;
  }

  // Get a reservation by userId and bookId, only if the status is "pending"
  static getReservationByUserAndBook = async (
    userId: string,
    bookId: string
  ) => {
    return await BookReservationModel.findOne({
      userId,
      bookId,
      status: "pending",
    });
  };
}
