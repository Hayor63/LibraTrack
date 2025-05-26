import { DocumentType } from "@typegoose/typegoose";
import {
  createReviewSchemaType,
  updateReviewsAndRatingSchemaType,
} from "../../validationSchema/reviewAndRating";
import ReviewsAndRatingModel, {
  ReviewsAndRating,
} from "../models/reviewsAndRating";
import { PartialLoose } from "../../utils/helper";
import { formatResponseRecord } from "../../utils/formatter";

class BookExtend extends ReviewsAndRating {
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

export default class RatingAndReviewsRepo {
  // create review
  static createReviewsAndRating: (
    reviews: Partial<ReviewsAndRating>
  ) => Promise<ReviewsAndRating> = async (review) => {
    const data = await ReviewsAndRatingModel.create(review);
    return data;
  };

  //find by user and book id
  static async findByUserAndBook(userId: string, bookId: string) {
    return await ReviewsAndRatingModel.findOne({ userId, bookId });
  }

  //find all Reviews and Ratings
  static getAllReviews = async ({
    pageNumber = 1,
    pageSize = 10,
    filter: _filter,
    sortLogic = defaultSortLogic,
  }: Partial<PaginatedFetchParams>): Promise<{
    data: ReviewsAndRating[];
    totalItems: number;
  }> => {
    // Build filter
    const filter = _filter || {};

    const skip = (pageNumber - 1) * pageSize;

    const [reviews, totalItems] = await Promise.all([
      ReviewsAndRatingModel.find(filter)
        .sort(sortLogic)
        .populate("userId", "userName email")
        .populate({
          path: "bookId",
          select: "title author publicationYear categoryId genreId",
          populate: [
            { path: "categoryId", select: "name description" },
            { path: "genreId", select: "name" },
          ],
        })

        .skip(skip)
        .limit(pageSize)
        .lean()
        .exec(),

      ReviewsAndRatingModel.countDocuments(filter),
    ]);

    const formattedBooks: ReviewsAndRating[] = reviews.map((review) =>
      formatResponseRecord(review)
    );

    return { data: formattedBooks, totalItems };
  };

  // find by Id
  static async findById(id: string) {
    return await ReviewsAndRatingModel.findById(id).populate([
      {
        path: "bookId",
        select: "title author publicationYear ",
      },
    ]);
  }

  // Delete Review
  static async deleteReview(id: string): Promise<ReviewsAndRating | null> {
    return ReviewsAndRatingModel.findByIdAndDelete(id);
  }

  //update reviews
  static async updateReviews(
    id: string,
    updateParams: Partial<updateReviewsAndRatingSchemaType["body"]>
  ) {
    const updatedReservation = await ReviewsAndRatingModel.findByIdAndUpdate(
      id,
      updateParams,
      {
        new: true,
        runValidators: true,
      }
    );
    return updatedReservation;
  }
}
