import { Router } from "express";

const borrowingRoutes = Router();
import authenticateUser from "../../../middleware/authenticateUser";
import validate from "../../../middleware/validate";
import createBookBorrowingHandler from "./create";
import {
  borrowSchema,
  deleteSingleBorrowSchema,
  getSingleBorrowSchema,
  returnBookSchema,
  updateBorrowSchema,
} from "../../../validationSchema/borrowing";
import updateBorrowHandler from "./update";
import getAllBorrowingsHandler from "./getAll";
import deleteBorrowingHandler from "./delete";
import getBorrowByIdHandler from "./getById";
import returnBookHandler from "./returnBook";

borrowingRoutes.post(
  "/",
  authenticateUser,
  validate(borrowSchema),
  createBookBorrowingHandler
);


borrowingRoutes.post(
  "/:id/return",
  authenticateUser,
  validate(returnBookSchema ),
  returnBookHandler
);

borrowingRoutes.post(
  "/",
  authenticateUser,
  validate(borrowSchema),
  createBookBorrowingHandler
);

//update borrowing
borrowingRoutes.patch(
  "/:id",
  authenticateUser,
  validate(updateBorrowSchema),
  updateBorrowHandler
);

//get all
borrowingRoutes.get("/", authenticateUser, getAllBorrowingsHandler);

//get Single borroiwing
borrowingRoutes.get(
  "/:id",
  authenticateUser,
  validate(getSingleBorrowSchema),
  getBorrowByIdHandler
);

//delete borroiwing
borrowingRoutes.delete(
  "/:id",
  authenticateUser,
  validate(deleteSingleBorrowSchema),
  deleteBorrowingHandler
);
export default borrowingRoutes;
