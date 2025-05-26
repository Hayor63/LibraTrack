import { Router } from "express";
import validate from "../../../middleware/validate";
import { createUserSchema } from "../../../validationSchema/user";
import createUserHandler from "./create";

const userRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User creation and management
 */

/**
 * @swagger
 * /api/v1/users/createUser:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUser:
 *       type: object
 *       required:
 *         - userName
 *         - email
 *         - password
 *       properties:
 *         userName:
 *           type: string
 *           description: The userName of the new user
 *           example: "john_doe"
 *         email:
 *           type: string
 *           description: The email of the new user
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           description: The password for the new user
 *           example: "password123"
 */

userRoutes.post("/createUser", validate(createUserSchema), createUserHandler);

export default userRoutes;
