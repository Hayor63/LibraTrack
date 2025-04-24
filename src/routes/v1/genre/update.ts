import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import { updateGenreSchemaType } from "../../../validationSchema/genre";
import GenreRepo from "../../../database/repository/genreRepo";
import mongoose from "mongoose";

const updateGenreHandler = async (
  req: Request<
    updateGenreSchemaType["params"],
    {},
    updateGenreSchemaType["body"]
  >,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return APIResponse.error("Invalid Genre ID", 400).send(res);
    }

    // Ensure that update data is not empty
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return APIResponse.error("No update data provided", 400).send(res);
    }

    const updatedGenre = await GenreRepo.updateGenre(id, updatedData);
    if (!updatedGenre) {
      return APIResponse.error("Genre not found", 404).send(res);
    }

    return APIResponse.success(
      { message: "Genre updated successfully", data: updatedGenre },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default updateGenreHandler;
