import { Router } from "express";
import authenticateUser from "../../../middleware/authenticateUser";
import {
  bookReservationSchema,
  cancelUserBookReservationSchema,
  deleteSingleReservationSchema,
  getReservationHistorySchema,
  getSingleBookReservationSchema,
  getUserBookReservationSchema,
  updateBookReservationSchema,
} from "../../../validationSchema/bookReservation";
import validate from "../../../middleware/validate";
import createReservationHandler from "./create";
import updateBookReservationHandler from "./update";
import authorizedRoles from "../../../middleware/role";
import deleteReservationHandler from "./delete";
import getBookReservationByIdHandler from "./getById";
import getUserReservationHandler from "./getReservationByUser";
import cancelReservationHandler from "./cancelReservation";
import getReservationHistoryHandler from "./getReservationHistory";
import getAllReservationHandler from "./getAll";

const bookReservationRoutes = Router();

//create Reservation
bookReservationRoutes.post(
  "/reservations/:bookId",
  authenticateUser,
  validate(bookReservationSchema),
  createReservationHandler
);

//update Reservation
bookReservationRoutes.patch(
  "/:id",
  authenticateUser,
  authorizedRoles("Admin"),
  validate(updateBookReservationSchema),
  updateBookReservationHandler
);

//delete reservation
bookReservationRoutes.delete(
  "/:id",
  authenticateUser,
  // authorizedRoles("Admin"),
  validate(deleteSingleReservationSchema),
  deleteReservationHandler
);

//get single reservation
bookReservationRoutes.get(
  "/:id",
  authenticateUser,
  validate(getSingleBookReservationSchema),
  getBookReservationByIdHandler
);

//get all reservations
bookReservationRoutes.get("/", authenticateUser, getAllReservationHandler);

//get book reservations by user
bookReservationRoutes.get(
  "/:id/reservations",
  authenticateUser,
  validate(getUserBookReservationSchema),
  getUserReservationHandler
);

//cancel book reservations 
bookReservationRoutes.patch(
  "/:id/cancel",
  authenticateUser,
  validate(cancelUserBookReservationSchema),
  cancelReservationHandler
);

bookReservationRoutes.get(
  "/user/:id/history",
  authenticateUser,
  validate(getReservationHistorySchema),
  getReservationHistoryHandler
);

export default bookReservationRoutes;
