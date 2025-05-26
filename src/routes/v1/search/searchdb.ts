import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import BookCreationModel from "../../../database/models/bookCreation";


interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// Define the expected structure of search query parameters
interface SearchQuery {
  q: string; 
  page?: string; 
  limit?: string; 
  genreId?: string; 
  categoryId?: string; 
}

// Main search handler for books in the database
const searchDbHandler = async (
  req: AuthenticatedRequest & { query: SearchQuery },
  res: Response
) => {
  try {
    // Destructure and assign default values from the query
    const { q, page = "1", limit = "10", genreId, categoryId } = req.query;

    // Make sure a search term was provided
    if (!q) {
      return APIResponse.error("Search parameter is missing", 400).send(res);
    }

    // Convert page and limit to numbers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Convert the search query into individual terms
    const searchTerms = q
      .split(",")
      .map((term) => term.trim()) 
      .filter(Boolean); 

    // Building a dynamic match stage for the search
    // to check if any of the search terms match title, author, genre name, or category name
    const matchStage: any = {
      $and: [
        {
          $or: searchTerms.flatMap((term) => [
            { title: { $regex: term, $options: "i" } },       
            { author: { $regex: term, $options: "i" } },      
            { "genre.name": { $regex: term, $options: "i" } }, 
            { "category.name": { $regex: term, $options: "i" } }, 
          ]),
        },
      ],
    };
    // Common aggregation steps 
    const pipeline = [
      // Joining genre data from genres collection
      {
        $lookup: {
          from: "genres",
          localField: "genreId",
          foreignField: "_id",
          as: "genre",
        },
      },
      { $unwind: "$genre" },

      // Joining category data from categories collection
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      // Applying the search and filter conditions
      { $match: matchStage },
    ];

    // Running two parallel queries:
    // 1. Get matching books for the current page
    // 2. Get total count of matching books
    const [bookResult, totalCountResult] = await Promise.all([
      BookCreationModel.aggregate([
        ...pipeline,
        { $skip: skip },  
        { $limit: limitNum }, 
      ]),
      BookCreationModel.aggregate([
        ...pipeline,
        { $count: "total" }, 
      ]),
    ]);

    // Total number of books that matched the search
    const totalBooks = totalCountResult[0]?.total || 0;

    // Send successful response
    return APIResponse.success(
      {
        message: "Search results",
        data: bookResult,
        pagination: {
          totalBooks,                   
          currentPage: pageNum,         
          totalPages: Math.ceil(totalBooks / limitNum), 
        },
      },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default searchDbHandler;
