import { boolean, number, object, string, TypeOf, z } from "zod";

export const bookCreationSchema = object({
  body: object({
    title: string({ required_error: "Title is required" }).min(
      1,
      "Title cannot be empty"
    ),
    author: string({ required_error: "Author is required" }).min(
      1,
      "Author cannot be empty"
    ),
    categoryId: string({ required_error: "Category ID is required" }).min(
      1,
      "Category ID cannot be empty"
    ),
    genreId: string({ required_error: "Genre ID is required" }).min(
      1,
      "Genre ID cannot be empty"
    ),
    publicationYear: number({ required_error: "Publication year is required" })
      .int("Publication year must be an integer")
      .min(1000, "Invalid publication year")
      .max(
        new Date().getFullYear(),
        "Publication year cannot be in the future"
      ),
    totalCopies: number({ required_error: "Total copies is required" })
      .int("Total copies must be an integer")
      .min(1, "Total copies must be at least 1"),
    copiesAvailable: number({ required_error: "Copies available is required" })
      .int("Copies available must be an integer")
      .min(0, "Copies available cannot be negative"),
    isReserved: boolean().default(false),
  }),
});

// get Single Category
export const getSingleBookSchema = object({
  params: object({
    id: string({
      required_error: "Book ID is required",
    }),
  }),
});

//Update Category
export const updateBookSchema = object({
  params: object({
    id: string({
      required_error: "Book ID is required",
    }),
  }),
  body: object({
    title: string({ required_error: "Title is required" }).min(
      1,
      "Title cannot be empty"
    ),
    author: string({ required_error: "Author is required" }).min(
      1,
      "Author cannot be empty"
    ),
    categoryId: string({ required_error: "Category ID is required" }).min(
      1,
      "Category ID cannot be empty"
    ),
    genreId: string({ required_error: "Genre ID is required" }).min(
      1,
      "Genre ID cannot be empty"
    ),
    publicationYear: number({ required_error: "Publication year is required" })
      .int("Publication year must be an integer")
      .min(1000, "Invalid publication year")
      .max(
        new Date().getFullYear(),
        "Publication year cannot be in the future"
      ),
    totalCopies: number({ required_error: "Total copies is required" })
      .int("Total copies must be an integer")
      .min(1, "Total copies must be at least 1"),
    copiesAvailable: number({ required_error: "Copies available is required" })
      .int("Copies available must be an integer")
      .min(0, "Copies available cannot be negative"),
    isReserved: boolean().default(false),
  }),
})

//Delete Categories
export const deleteSingleBookSchema = object({
  params: object({
    id: string({
      required_error: "Book ID is required",
    }),
  }),
});

export type BookCreationSchemaType = TypeOf<typeof bookCreationSchema>["body"];
export type getSingleBook = TypeOf<typeof getSingleBookSchema>["params"];
export type updateBookSchemaType = {
  params: TypeOf<typeof updateBookSchema>["params"];
  body: TypeOf<typeof updateBookSchema>["body"];
};

export type deleteSingleBook = TypeOf<typeof deleteSingleBookSchema>["params"]