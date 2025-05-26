import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import GenreRepo from "../../../database/repository/genreRepo";

const getAllGenresHandler = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.pageNumber) || 1);
    const limit = Math.max(1, Number(req.query.pageSize) || 10);
    const skip = (page - 1) * limit;

    // Fetch paginated data and total count
    const [genres, totalItems] = await Promise.all([
      GenreRepo.getAllGenres({ skip, limit }),
      GenreRepo.getTotalGenreCount(),
    ]);

    if (!genres || genres.length === 0) {
      return APIResponse.error("No genres found", 404).send(res);
    }
    return APIResponse.success(
      {
        message: "Genres retrieved successfully",
        data: genres,
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
        },
      },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default getAllGenresHandler;
