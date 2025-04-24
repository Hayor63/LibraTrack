import { Router } from "express";
import authenticateUser from "../../../middleware/authenticateUser";
import authorizedRoles from "../../../middleware/role";
import createBookHandler from "./create";
import validate from "../../../middleware/validate";
import { bookCreationSchema, deleteSingleBookSchema, getSingleBookSchema, updateBookSchema } from "../../../validationSchema/bookCreation";
import getBookByIdHandler from "./getById";
import fetchBooksHandler from "./paginate";
import updateBookHandler from "./update";
import deleteBookHandler from "./delete";

const bookCreationRoutes = Router();

bookCreationRoutes.post(
  "/",
  authenticateUser,
  // authorizedRoles("admin"),
  validate(bookCreationSchema),
  createBookHandler
);


  //get single Book
  bookCreationRoutes.get(
    "/:id",
    authenticateUser,
    validate( getSingleBookSchema),
    getBookByIdHandler
  );

  //get all Books
  bookCreationRoutes.get(
    "/",
    authenticateUser,
    fetchBooksHandler
  );


  bookCreationRoutes.patch(
    "/:id",
    authenticateUser,
      authorizedRoles("admin"),
    validate(updateBookSchema),
    updateBookHandler
  );

  bookCreationRoutes.delete(
    "/:id",
    authenticateUser,
      // authorizedRoles("admin"),
    validate(deleteSingleBookSchema),
    deleteBookHandler
  );

export default bookCreationRoutes;
