import { Router } from "express";
import validate from "../../../middleware/validate";
import {
  loginSchema,
  recoverPasswordSchema,
  resetPasswordSchema,
  updateUserProfileSchema,
} from "../../../validationSchema/user";
import loginHandler from "./login";
import authenticateUser from "../../../middleware/authenticateUser";
import updateUserHandler from "./updateUser";
import recoverPasswordhandler from "./recoverPassword";
import resetPasswordHandler from "./resetPassword";
import changePasswordHandler from "./changePassword";
import deleteUserHandler from "./deleteuser";

const authRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and management
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/v1/auth/update-user/{id}:
 *   patch:
 *     summary: Update a user's profile (admin or user)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *                 description: Must be at least 8 characters and contain uppercase, lowercase, number, and special character
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid request or no fields provided
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not allowed to update this user
 *       404:
 *         description: User not found
 */


/**
 * @swagger
 *  /api/v1/auth/recover-password:
 *   post:
 *     summary: Send password recovery email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password recovery email sent
 *       400:
 *         description: Invalid email
 */

/**
 * @swagger
 *  /api/v1/auth/reset-password/{id}/{token}:
 *   patch:
 *     summary: Reset user password
 *     tags: [Authentication]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: token
 *         in: path
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
 *               -password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */

/**
 * @swagger
 *  /api/v1/auth/change-password/{id}:
 *   patch:
 *     summary: Change user password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid old password or missing fields
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 *  /api/v1/auth/{id}:
 *   delete:
 *     summary: Delete user account
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */




//login
authRoutes.post("/login", validate(loginSchema), loginHandler);

//update user profile
authRoutes.patch(
  "/update-user/:id",
  authenticateUser,
  validate(updateUserProfileSchema),
  updateUserHandler
);

//recover password
authRoutes.post(
  "/recover-password",
  validate(recoverPasswordSchema),
  recoverPasswordhandler
);

//reset password
authRoutes.patch(
  "/reset-password/:id/:token",
  validate(resetPasswordSchema),
  resetPasswordHandler
);

//change password
authRoutes.patch(
  "/change-password/:id",
  authenticateUser,
  changePasswordHandler
);

//delete user account
authRoutes.delete("/:id", authenticateUser, deleteUserHandler);

export default authRoutes;
