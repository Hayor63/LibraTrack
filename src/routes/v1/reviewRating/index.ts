import { Router } from "express";
import createReviewsAndRating from "./create";
import {
  createReviewSchema,
  deleteSingleReviewSchema,
  dislikeCommentSchema,
  getSingleReviewSchema,
  likeCommentSchema,
  updateReviewsAndRatingSchema,
} from "../../../validationSchema/reviewAndRating";
import validate from "../../../middleware/validate";
import authenticateUser from "../../../middleware/authenticateUser";
import getAllReviewsHandler from "./getAll";

import authorizedRoles from "../../../middleware/role";

import updateReviewHandler from "./update";
import ReviewsByIdHandler from "./getById";
import deleteReviewHandler from "./delete";
import dislikeAReviewHandler from "./dislikeAReview";
import likeAReviewHandler from "./likeAReview";

const reviewRatingRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Book reviews and ratings
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - review
 *         - rating
 *       properties:
 *         review:
 *           type: string
 *           description: User's written review
 *           example: "This book was amazing and insightful!"
 *         rating:
 *           type: number
 *           description: Numeric rating from 1 to 5
 *           minimum: 1
 *           maximum: 5
 *           example: 4
 */

/**
 * @swagger
 * /api/v1/reviews/{bookId}/create:
 *   post:
 *     summary: Create a book review and rating
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: bookId
 *         in: path
 *         description: The ID of the book to review
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     bookId:
 *                       type: string
 *                     review:
 *                       type: string
 *                     rating:
 *                       type: number
 *                       format: float
 *                     userId:
 *                       type: string
 *       400:
 *         description: Validation error (e.g., missing fields, invalid data)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Review cannot be empty"
 *       401:
 *         description: Unauthorized (missing or invalid authentication token)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reviews
 */

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   get:
 *     summary: Get a single review by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review found
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   patch:
 *     summary: Update a review and rating
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - review
 *               - rating
 *             properties:
 *               review:
 *                 type: string
 *                 example: "Updated review after finishing the book"
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /api/v1/reviews/like/{id}:
 *   put:
 *     summary: Like a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Review ID to like
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review liked successfully
 *       400:
 *         description: Invalid ID or already liked
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /api/v1/reviews/dislike/{id}:
 *   put:
 *     summary: Dislike a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Review ID to dislike
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review disliked successfully
 *       400:
 *         description: Invalid ID or already disliked
 *       404:
 *         description: Review not found
 */

reviewRatingRoutes.post(
  "/:bookId/create",
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

//delete Review
reviewRatingRoutes.delete(
  "/:id",
  authenticateUser,
  validate(deleteSingleReviewSchema),
  deleteReviewHandler
);

//dislike a review
reviewRatingRoutes.put(
  "/dislike/:id",
  authenticateUser,
  validate(dislikeCommentSchema),
  dislikeAReviewHandler
);

//like a comment
reviewRatingRoutes.put(
  "/like/:id",
  authenticateUser,
  validate(likeCommentSchema),
  likeAReviewHandler
);
export default reviewRatingRoutes;
