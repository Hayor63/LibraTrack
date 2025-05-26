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
import getAllReservationsHistoryHandler from "./getReservationHistory";

const bookReservationRoutes = Router();


/**
/**
 * @swagger
 * /api/v1/bookReservation/reservations/{bookId}:
 *   post:
 *     summary: Create a book reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to reserve
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/v1/bookReservation/{id}:
 *   patch:
 *     summary: Update a book reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, fulfilled, canceled]
 *               expirationDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/bookReservation/{id}:
 *   delete:
 *     summary: Delete a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/bookReservation/{id}/reservation:
 *   get:
 *     summary: Get a single reservation by ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/bookReservation/{id}/cancel:
 *   patch:
 *     summary: Cancel a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation canceled successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/bookReservation/{id}/reservations:
 *   get:
 *     summary: Get all reservations made by a user
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User's reservations retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User or reservations not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/bookReservation/reservation-history:
 *   get:
 *     summary: Get reservation history
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pageNumber
 *         schema:
 *           type: string
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortField
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortType
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Optional, used by admin to filter by user
 *     responses:
 *       200:
 *         description: Reservation history fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/bookReservation:
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All reservations fetched successfully
 *       401:
 *         description: Unauthorized, user needs to be authenticated  
 *       403:
 *         description: Forbidden, admin role required      
 *       404:
 *         description: Reservations not found
 *       500:
 *         description: Internal server error
 */


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
  authorizedRoles("Admin"),
  validate(deleteSingleReservationSchema),
  deleteReservationHandler
);


//get all reservations history
bookReservationRoutes.get(
  "/reservation-history",
  authenticateUser,
  validate(getReservationHistorySchema),
  getAllReservationsHistoryHandler
);


//get single reservation
bookReservationRoutes.get(
  "/:id/reservation",
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

export default bookReservationRoutes;
