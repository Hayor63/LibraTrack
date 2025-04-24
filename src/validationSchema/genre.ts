import { object, string, number, boolean, array, z, TypeOf } from "zod";

export const GenreSchema = object({
  body: object({
    categoryId: string({
      required_error: "category Id is required",
    }),
    name: string({
      required_error: "name is required",
    }),
  }),
});

//Update Genre
export const updateGenreSchema = object({
  params: object({
    id: string({
      required_error: "Category ID is required",
    }),
  }),
  body: object({
    categoryId: string({
      required_error: "Category Id is required",
    }),
    name: string({
      required_error: "name is required",
    }),
  }),
});

//Delete Categories
export const deleteSingleGenreSchema = object({
  params: object({
    id: string({
      required_error: "Genre ID is required",
    }),
  }),
});

// get Single Genre
export const getSingleGenreSchema = object({
  params: object({
    id: string({
      required_error: "Genre ID is required",
    }),
  }),
});

export type GenreType = TypeOf<typeof GenreSchema>["body"];
export type updateGenreSchemaType = {
  params: TypeOf<typeof updateGenreSchema>["params"];
  body: TypeOf<typeof updateGenreSchema>["body"];
};
export type deleteSingleGenre = TypeOf<typeof deleteSingleGenreSchema>["params"]
export type getSingleGenre = TypeOf<typeof getSingleGenreSchema>["params"]