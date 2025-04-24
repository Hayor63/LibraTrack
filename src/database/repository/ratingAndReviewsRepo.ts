import {
  createReviewSchemaType,
  updateReviewsAndRatingSchemaType,
} from "../../validationSchema/reviewAndRating";
import ReviewsAndRatingModel, {
  ReviewsAndRating,
} from "../models/reviewsAndRating";

export default class RatingAndReviewsRepo {
  // create review
  static createReviewsAndRating: (
    reviews: createReviewSchemaType
  ) => Promise<ReviewsAndRating> = async (review) => {
    const data = await ReviewsAndRatingModel.create(review);
    return data;
  };

  //find by user and book id
  static async findByUserAndBook(userId: string, bookId: string) {
    return await ReviewsAndRatingModel.findOne({ userId, bookId });
  }

  //find all
  static async getAll(): Promise<ReviewsAndRating[]> {
    return ReviewsAndRatingModel.find();
  }

  // find by Id
  static async findById(id: string) {
    return await ReviewsAndRatingModel.findById(id);
  }

  // //delete reviews
  // static async delete(id: string) {
  //   return await ReviewsAndRatingModel.findByIdAndDelete(id);
  // }

  // Delete Review
  static async deleteReview(
    id: string
  ): Promise<createReviewSchemaType | null> {
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
