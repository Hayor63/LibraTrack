import { Router } from "express";
import validate from "../../../middleware/validate";
import { createUserSchema } from "../../../validationSchema/user";
import createUserHandler from "./create";

const userRoutes = Router();

userRoutes.post("/createUser", validate(createUserSchema), createUserHandler);

export default userRoutes;
