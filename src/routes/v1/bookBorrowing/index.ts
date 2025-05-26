import { Router } from "express";
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
import authorizedRoles from "../../../middleware/role";
import getAllBorrowingsHistoryHandler from "./getBorrowingHistory";


const borrowingRoutes = Router();
/**
 * @swagger
 * tags:
 *   name: Borrowings
 *   description: Book borrowing management
 */
/**
 * 
/**
 * @swagger
 * /api/v1/borrowings/{id}:
 *   post:
 *     summary: Create a new book borrowing record
 *     tags: [Borrowings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to be borrowed
 *     responses:
 *       201:
 *         description: Borrowing record created successfully
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/v1/borrowings/{id}/return:
 *   post:
 *     summary: Mark a borrowed book as returned
 *     tags: [Borrowings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Borrowing record ID
 *     responses:
 *       200:
 *         description: Book marked as returned
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Borrowing record not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/borrowings/{id}:
 *   patch:
 *     summary: Update a borrowing record
 *     tags: [Borrowings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Borrowing record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *               borrowDate:
 *                 type: string
 *                 format: date-time
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               returnDate:
 *                 type: string
 *                 format: date-time
 *               isReturned:
 *                 type: boolean
 *               lateFee:
 *                 type: number
 *     responses:
 *       200:
 *         description: Borrowing updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Borrowing not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/borrowings/:
 *   get:
 *     summary: Get all borrowing records
 *     tags: [Borrowings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of borrowing records
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/borrowings/borrowing-history:
 *   get:
 *     summary: Get borrowing history for the logged-in user
 *     tags: [Borrowings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of past borrowings
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/borrowings/{id}:
 *   delete:
 *     summary: Delete a borrowing record
 *     tags: [Borrowings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Borrowing record ID
 *     responses:
 *       200:
 *         description: Borrowing deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Borrowing not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/borrowings/{id}:
 *   get:
 *     summary: Get a single borrowing record by ID
 *     tags: [Borrowings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Borrowing record ID
 *     responses:
 *       200:
 *         description: Borrowing record retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Borrowing not found
 *       500:
 *         description: Internal server error
 */




borrowingRoutes.post(
  "/:id",
  authenticateUser,
  validate(borrowSchema),
  createBookBorrowingHandler
);

borrowingRoutes.post(
  "/:id/return",
  authenticateUser,
  validate(returnBookSchema),
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
  authorizedRoles("Admin"),
  validate(updateBorrowSchema),
  updateBorrowHandler
);

//get all
borrowingRoutes.get(
  "/",
  authenticateUser,
  // authorizedRoles("Admin"),
  getAllBorrowingsHandler
);

// get all borrowing history
borrowingRoutes.get(
  "/borrowing-history", 
  authenticateUser, 
  getAllBorrowingsHistoryHandler 
)

//get Single borrowing
borrowingRoutes.get(
  "/:id",
  authenticateUser,
  validate(getSingleBorrowSchema),
  getBorrowByIdHandler
);


//delete borrowing
borrowingRoutes.delete(
  "/:id",
  authenticateUser,
  authorizedRoles("Admin"),
  validate(deleteSingleBorrowSchema),
  deleteBorrowingHandler
);
export default borrowingRoutes;
