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



/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management endpoints
 */

/**
 * @swagger
 * /api/v1/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - categoryId
 *               - genreId
 *               - publicationYear
 *               - totalCopies
 *               - copiesAvailable
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               genreId:
 *                 type: string
 *               publicationYear:
 *                 type: integer
 *               totalCopies:
 *                 type: integer
 *               copiesAvailable:
 *                 type: integer
 *               isReserved:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of books
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/books/{id}:
 *   get:
 *     summary: Get a single book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Book ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book found
 *       404:
 *         description: Book not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/books/{id}:
 *   patch:
 *     summary: Update a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Book ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - categoryId
 *               - genreId
 *               - publicationYear
 *               - totalCopies
 *               - copiesAvailable
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               genreId:
 *                 type: string
 *               publicationYear:
 *                 type: integer
 *               totalCopies:
 *                 type: integer
 *               copiesAvailable:
 *                 type: integer
 *               isReserved:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Book not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Book ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 *       401:
 *         description: Unauthorized
 */


bookCreationRoutes.post(
  "/",
  authenticateUser,
  authorizedRoles("admin"),
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
      authorizedRoles("admin"),
    validate(deleteSingleBookSchema),
    deleteBookHandler
  );

export default bookCreationRoutes;
