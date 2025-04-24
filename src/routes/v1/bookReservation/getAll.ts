import { Request, Response } from "express";
import BookReservationRepo from "../../../database/repository/bookResevationRepo";
import APIResponse from "../../../utils/api";

const getAllReservationHandler = async(req:Request, res: Response) => {
    try {
        const reservations = await BookReservationRepo.getAllReservations()
        if(!reservations || reservations.length === 0)  {
            return APIResponse.error("No reservations found", 404).send(res);
        }
           return APIResponse.success(
              { message: "Reservations retrieved successfully", data: reservations },
              200
            ).send(res);
    } catch (error) {
        return APIResponse.error((error as Error).message, 500).send(res);
    }
}

export default getAllReservationHandler