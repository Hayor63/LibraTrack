import { Router } from "express";
import createReviewsAndRating from "./create";
import { createReviewSchema, deleteSingleReviewSchema, getSingleReviewSchema, updateReviewsAndRatingSchema } from "../../../validationSchema/reviewAndRating";
import validate from "../../../middleware/validate";
import authenticateUser from "../../../middleware/authenticateUser";
import getAllReviewsHandler from "./getAll";

import authorizedRoles from "../../../middleware/role";
import deleteReviewHandler from "./delete";
import updateReviewHandler from "./update";
import ReviewsByIdHandler from "./getById";

const reviewRatingRoutes = Router();

reviewRatingRoutes.post(
  "/",
  authenticateUser,
  validate(createReviewSchema),
  createReviewsAndRating
);

//get ALl reviews
reviewRatingRoutes.get("/", authenticateUser, getAllReviewsHandler);

//update reviews
reviewRatingRoutes.patch( 
  "/:id",
  authenticateUser,
  // authorizedRoles("admin"),
  validate(updateReviewsAndRatingSchema),
  updateReviewHandler
);


//get single Review
reviewRatingRoutes.get(
  "/:id",
  authenticateUser,
  validate(getSingleReviewSchema),
  ReviewsByIdHandler
);

// //delete Review
// reviewRatingRoutes.delete(
//   "/:id",
//   authenticateUser,
//   validate(deleteSingleReviewSchema),
//   deleteReviewHandler
// );
export default reviewRatingRoutes;
