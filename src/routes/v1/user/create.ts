import { Request, Response } from "express";
import userRepo from "../../../database/repository/userRepo";
import APIResponse from "../../../utils/api";

const createUserHandler = async (req: Request<{}, {}>, res: Response) => {
    try {
        // Checkiing if the email already exists
        const existingEmailUser = await userRepo.findByEmail(req.body.email);
        if (existingEmailUser) {
            return APIResponse.error("User with this email already exists!!").send(res);
        }

        // Checking if the userName already exists
        const existingUserName = await userRepo.findByUserName(req.body.userName); // Assuming you have this method in your repo
        if (existingUserName) {
            return APIResponse.error("Username already exists").send(res);
        }

        // Creating the user if both checks pass
        const user = await userRepo.createUser(req.body);
        APIResponse.success(user, 201).send(res);

    } catch (error) {
        APIResponse.error((error as Error).message).send(res);
    }
};

export default createUserHandler;
