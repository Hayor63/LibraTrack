import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import GenreRepo from "../../../database/repository/genreRepo";
import mongoose from "mongoose";

const getSingleGenreHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Validating if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return APIResponse.error("Invalid Genre ID", 400).send(res);
    }

    const genre = await GenreRepo.findById(id);

    // Checking if the Genre exists
    if (!genre) {
      return APIResponse.error("Genre not found", 404).send(res);
    }

    return APIResponse.success(
      { message: "Genre retrieved successfully", data: genre },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default getSingleGenreHandler;
