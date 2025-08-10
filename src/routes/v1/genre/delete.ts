import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import GenreRepo from "../../../database/repository/genreRepo";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

const deleteGenreHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: genreId } = req.params;
    // Checking if the genre exists before deleting
    const genre = await GenreRepo.findById(genreId);
    if (!genre) {
      return APIResponse.error("Genre not found", 404).send(res);
    }

    // Deleting the genre
    await GenreRepo.deleteGenre(genreId); 

    return APIResponse.success(
      { message: "Genre deleted successfully", data: genre },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default deleteGenreHandler;
