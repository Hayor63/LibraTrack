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


  // Get all Genres with pagination
  static async getAllGenres({
    skip = 0,
    limit = 10,
  }: {
    skip?: number;
    limit?: number;
  }): Promise<Genre[]> {
    return GenreModel.find().skip(skip).limit(limit);
  }
  
    // Count for total documents
    static async getTotalGenreCount(): Promise<number> {
      return GenreModel.countDocuments();
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
