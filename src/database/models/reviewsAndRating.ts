import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
  Severity,
} from "@typegoose/typegoose";
import { User } from "./user";
import { BookCreation } from "./bookCreation"; // Ensure the correct import

@modelOptions({
  schemaOptions: {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class ReviewsAndRating {
  @prop({ ref: () => User, required: true })
  userId!: Ref<User>;

  @prop({ ref: () => BookCreation, required: true })
  bookId!: Ref<BookCreation>;

  @prop({ required: true })
  review!: string;

  @prop({ 
    required: true, 
    default: 1, 
    validate: (value: number) => value >= 1 && value <= 5 
  })
  rating!: number;
  
}

const ReviewsAndRatingModel = getModelForClass(ReviewsAndRating);
export default ReviewsAndRatingModel;
