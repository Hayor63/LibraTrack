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


const authRoutes = Router();
authRoutes.post("/login", validate(loginSchema), loginHandler);

authRoutes.patch(
  "/update-user/:id",
  authenticateUser,
  validate(updateUserProfileSchema),
  updateUserHandler
);

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

export default authRoutes;
