import { formatResponseRecord } from "../../utils/formatter";
import { PartialLoose } from "../../utils/helper";
import { BookCreationSchemaType } from "../../validationSchema/bookCreation";
import BookCreationModel, { BookCreation } from "../models/bookCreation";

class BookExtend extends BookCreation {
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


  //get paginated book

  static getPaginatedBook = async ({
    pageNumber = 1,
    pageSize = 10,
    filter: _filter,
    sortLogic = defaultSortLogic,
    search,
  }: Partial<PaginatedFetchParams>): Promise<{
    data: BookCreation[];
    totalItems: number;
  }> => {
    // Build filter with search
    const filter = {
      ...(_filter || {}),
      ...(search ? { title: { $regex: search, $options: "i" } } : {}),
    };
  
    const skip = (pageNumber - 1) * pageSize;
  
    // Fetch paginated books and count in parallel
    const [books, totalItems] = await Promise.all([
      BookCreationModel.find(filter)
        .sort(sortLogic)
        .skip(skip)
        .limit(pageSize)
        .populate("categoryId", "name description")
        .populate("genreId", "name")
        .lean()
        .exec(),
  
      BookCreationModel.countDocuments(filter),
    ]);
  
    const formattedBooks: BookCreation[] = books.map((book) =>
      formatResponseRecord(book)
    );
  
    return { data: formattedBooks, totalItems };
  };
  
}
