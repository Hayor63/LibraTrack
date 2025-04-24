import { object, string, number, boolean, array, z, TypeOf } from "zod";

export const CategorySchema = object({
  body: object({
    name: string({
      required_error: "Title is required",
    }),
    description: string({
      required_error: "Description is required",
    }),
  }),
});

//Update Category
export const updateCategorySchema = object({
  params: object({
    id: string({
      required_error: "category ID is required",
    }),
  }),
  body: object({
    name: string({
      required_error: "Title is required",
    }),
    description: string({
      required_error: "Description is required",
    }),
  }),
});

// Get All Categories Schema
export const getAllCategoriesSchema = object({});

//Delete Categories
export const deleteSingleCategorySchema = object({
  params: object({
    id: string({
      required_error: "category ID is required",
    }),
  }),
});

// get Single Category
export const getSingleCategorySchema = object({
  params: object({
    id: string({
      required_error: "Category ID is required",
    }),
  }),
});

export type CategoryType = TypeOf<typeof CategorySchema>["body"];
export type updateCategorySchemaType = {
  params: TypeOf<typeof updateCategorySchema>["params"];
  body: TypeOf<typeof updateCategorySchema>["body"];
};
export type getAllCategories = TypeOf<typeof getAllCategoriesSchema>
export type deleteSingleCategory = TypeOf<typeof deleteSingleCategorySchema>["params"]
export type getSingleCategory = TypeOf<typeof getSingleCategorySchema>["params"]
