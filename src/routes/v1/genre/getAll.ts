import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import GenreRepo from "../../../database/repository/genreRepo";

const getAllGenresHandler = async (req: Request, res: Response) => {
  try {
    const genres = await GenreRepo.getAllGenres();
    if (genres.length === 0) {
        return APIResponse.error("No genres found", 404).send(res);
      }
    return APIResponse.success(
      { message: "Genres retrieved successfully", data: genres },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default getAllGenresHandler;
