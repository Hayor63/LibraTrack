import { GenreType } from "../../validationSchema/genre";
import GenreModel, { Genre } from "../models/genre";

export default class GenreRepo {
  // Create Genre
  static createGenre: (genre: GenreType) => Promise<Genre> = async (genre) => {
    const data = await GenreModel.create(genre);
    return data;
  };

  // Find by ID/*  */
  static async findById(genreId: string): Promise<Genre | null> {
    return GenreModel.findById(genreId).lean().populate("categoryId");
  }


   // Get all genres
  static async getAllGenres(): Promise<Genre[]> {
    return GenreModel.find().populate("categoryId");
  }

  // Delete genre
  static async deleteGenre(genreId: string): Promise<Genre | null> {
    return GenreModel.findByIdAndDelete(genreId);
  }

  // Update Genre
  static async updateGenre(
    id: string,
    updateParams: Partial<GenreType>
  ): Promise<Genre | null> {
    return GenreModel.findByIdAndUpdate(id, updateParams, { new: true });
  }
}
