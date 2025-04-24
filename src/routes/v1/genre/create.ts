import { Request, Response } from "express";
import mongoose from "mongoose";
import GenreRepo from "../../../database/repository/genreRepo";
import CategoryModel from "../../../database/models/category";
import GenreModel from "../../../database/models/genre";
import APIResponse from "../../../utils/api";

const createGenreHandler = async (req: Request, res: Response) => {
  try {
    const { categoryId, name } = req.body;

    // Check if categoryId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return APIResponse.error("Invalid Category ID", 400).send(res);
    }

    // Check if the categoryId exists in the database
    const categoryExists = await CategoryModel.findById(categoryId);
    if (!categoryExists) {
        return APIResponse.error("The provided category does not exist", 404).send(res);
    }

    // Check if Genre already exists (case-insensitive)
    const existingGenre = await GenreModel.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });
    if (existingGenre) {
      return APIResponse.error("Genre already exists", 400).send(res);
    }

    //Create the Genre
    const newGenre = await GenreRepo.createGenre({ categoryId, name });

    return APIResponse.success(
      { message: "Genre created successfully", data: newGenre },
      201
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default createGenreHandler;
