import { formatResponseRecord } from "../../utils/formatter";
import { PartialLoose } from "../../utils/helper";
import { BookCreationSchemaType } from "../../validationSchema/bookCreation";
import BookCreationModel, { BookCreation } from "../models/bookCreation";

class PinExtend extends BookCreation {
  createdAt: string;
}

type SortLogic = PartialLoose<PinExtend, "asc" | "desc" | 1 | -1>;
const defaultSortLogic: SortLogic = { createdAt: -1 };
export interface PaginatedFetchParams {
  pageNumber: number;
  pageSize: number;
  filter: Record<string, any>;
  sortLogic: SortLogic;
  search: string;
}

export default class BookCreationRepo {
  static createBook: (
    bookCreation: BookCreationSchemaType
  ) => Promise<BookCreation> = async (book) => {
    const data = await BookCreationModel.create(book);
    return data;
  };

  //find by Id
  static async getBookById(bookId: string): Promise<BookCreation | null> {
    return await BookCreationModel.findById(bookId).populate([
      { path: "categoryId", select: "name description" },
      { path: "genreId", select: "name" },
    ]);
  }

  //delete book
  static deleteBook = async (id: string) => {
    return await BookCreationModel.findByIdAndDelete(id);
  };

  //update book
  static async updateById(
    id: string,
    updateParams: Partial<BookCreationSchemaType>
  ) {
    return await BookCreationModel.findByIdAndUpdate(id, updateParams, {
      new: true,
      runValidators: true,
    });
  }

  static getPaginatedBook = async ({
    pageNumber = 1,
    pageSize = 10,
    filter: _filter,
    sortLogic = defaultSortLogic,
    search,
  }: Partial<PaginatedFetchParams>): Promise<BookCreation[]> => {
    // Build filter
    const filter = {
      ...(_filter || {}),
      ...(search ? { title: { $regex: search, $options: "i" } } : {}),
    };

    // Fetch books from the database
    const books = await BookCreationModel.find({})
    .populate("categoryId", "name description")
    .populate("genreId", "name description")
    .lean()
    .exec();
  
    const formattedBooks: BookCreation[] = books.map((book) =>
      formatResponseRecord(book)
    );

    return formattedBooks;
  };
}
