import { Router } from "express";
import searchDbHandler from "./searchdb";


const searchRoutes = Router();
/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Search functionality for the database
 */

/**
/**
 * @swagger
 * /api/v1/search:
 *   get:
 *     summary: Search the database
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: The search keyword to look for
 *     responses:
 *       200:
 *         description: Successful search results returned
 *       400:
 *         description: Bad request (invalid or missing query parameters)
 *       401:
 *         description: Unauthorized (authentication required)
 *       500:
 *         description: Internal server error
 */


searchRoutes.get("/", searchDbHandler);


export default searchRoutes;