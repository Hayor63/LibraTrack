import { bookReservationSchemaType } from "../../validationSchema/bookReservation";
import BookReservationModel, {
  BookReservation,
} from "../models/bookReservation";

type BookReservationInput = {
  bookId: string;
  userId: string;
  reservationDate: Date;
  expirationDate: Date;
  status: "pending" | "fulfilled" | "canceled";
};

export default class BookReservationRepo {
  static createReservation: (
    bookReservation: BookReservationInput
  ) => Promise<BookReservation> = async (reserve) => {
    return await BookReservationModel.create(reserve);
  };

  //find by Id
  static async getReservationById(id: string) {
    return BookReservationModel.findById(id); 
  }

  // Get all Reservations
  static async getAllReservations(): Promise<BookReservation[]> {
    return BookReservationModel.find();
  }

  // get Reservation by user
  static async getReservationsByUser(userId: string): Promise<BookReservation[]> {
    return BookReservationModel.find({ userId });
  }
  
  //delete Reservation
  static deleteReservation = async (id: string) => {
    return await BookReservationModel.findByIdAndDelete(id);
  };

  // Get book history
  static async getBookHistory(userId: string) {
    return await BookReservationModel.find({
      userId,
      status: { $ne: "pending" }, // Excludes "pending" status
    });
  }
  

  // Update Reservation
  static async updateReservation(
    id: string,
    updateParams: Partial<bookReservationSchemaType["body"]> // Only passing the "body" of the schema
  ) {
    const updatedReservation = await BookReservationModel.findByIdAndUpdate(
      id,
      updateParams,
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure that Mongoose validation occurs on the updated fields
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
