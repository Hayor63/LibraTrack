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

/**
 * @swagger
 * tags:
 *   name: Genres
 *   description: Book genres (not music)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Genre:
 *       type: object
 *       required:
 *         - categoryId
 *         - name
 *       properties:
 *         categoryId:
 *           type: string
 *           description: ID of the parent book category
 *           example: "654dfadcbabcda67890123ef"
 *         name:
 *           type: string
 *           description: Name of the book genre
 *           example: "Science Fiction"
 */

/**
 * @swagger
 * /api/v1/genres:
 *   post:
 *     summary: Create a new book genre
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Genre'
 *     responses:
 *       201:
 *         description: Genre created successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/v1/genres:
 *   get:
 *     summary: Get all book genres
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: List of genres
 */

/**
 * @swagger
 * /api/v1/genres/{id}:
 *   get:
 *     summary: Get a single genre by ID
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Genre ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Genre found
 *       404:
 *         description: Genre not found
 */

/**
 * @swagger
 * /api/v1/genres/{id}:
 *   patch:
 *     summary: Update a genre
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Genre ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Genre'
 *     responses:
 *       200:
 *         description: Genre updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Genre not found
 */

/**
 * @swagger
 * /api/v1/genres/{id}:
 *   delete:
 *     summary: Delete a genre
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Genre ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Genre deleted successfully
 *       404:
 *         description: Genre not found
 */



genreRoutes.post(
  "/",
  authenticateUser,
  authorizedRoles("admin"),
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
