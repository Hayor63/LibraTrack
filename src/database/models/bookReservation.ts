import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
  Severity,
} from "@typegoose/typegoose";
import { User } from "./user";
import { BookCreation } from "./bookCreation"; // Updated import to match class name

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class BookReservation {
  @prop({ ref: () => User, required: true })
  userId!: Ref<User>;

  @prop({ ref: () => BookCreation, required: true })
  bookId!: Ref<BookCreation>;

  @prop({ default: () => new Date() })
  reservationDate!: Date;

  @prop({ required: true, default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) })
  expirationDate!: Date; 

  @prop({ enum: ["pending", "fulfilled", "canceled"], default: "pending" })
  status!: "pending" | "fulfilled" | "canceled";
}

const BookReservationModel = getModelForClass(BookReservation);
export default BookReservationModel;
