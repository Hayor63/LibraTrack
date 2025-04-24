import { Router } from "express";
import authorizedRoles from "../../../middleware/role";
import authenticateUser from "../../../middleware/authenticateUser";
import validate from "../../../middleware/validate";
import {
  deleteSingleGenreSchema,
  GenreSchema,
  getSingleGenreSchema,
  updateGenreSchema,
} from "../../../validationSchema/genre";
import createGenreHandler from "./create";
import getAllGenresHandler from "./getAll";
import deleteGenreHandler from "./delete";
import updateGenreHandler from "./update";
import getSingleGenreHandler from "./getById";

const genreRoutes = Router();

genreRoutes.post(
  "/",
  authenticateUser,
  // authorizedRoles("admin"),
  validate(GenreSchema),
  createGenreHandler
);

//get ALl Genres
genreRoutes.get("/", authenticateUser, getAllGenresHandler);

//delete Genre
genreRoutes.delete(
  "/:id",
  authenticateUser,
  authorizedRoles("admin"),
  validate(deleteSingleGenreSchema),
  deleteGenreHandler
);

//update Genre
genreRoutes.patch(
  "/:id",
  authenticateUser,
  authorizedRoles("admin"),
  validate(updateGenreSchema),
  updateGenreHandler
);

//get single Genre
genreRoutes.get(
  "/:id",
  authenticateUser,
  validate(getSingleGenreSchema),
  getSingleGenreHandler
);


export default genreRoutes
