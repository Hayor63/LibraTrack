import { boolean, date, number, object, string, TypeOf, z } from "zod";
import { Types } from "mongoose";

export const borrowSchema = z.object({
  body: object({
    bookId: string({ required_error: "Book ID is required" }),
    borrowDate: date()
      .optional()
      .default(() => new Date()),
    dueDate: date()
      .optional()
      .default(() => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)),
    returnDate: date().optional(),
    isReturned: boolean().optional().default(false),
    lateFee: number().optional().default(0),
  }),
});

// Get single borrow schema
export const getSingleBorrowSchema = object({
  params: object({
    id: string({
      required_error: "Borrow ID is required",
    }),
  }),
});

//Delete Borrow
export const deleteSingleBorrowSchema = object({
  params: object({
    id: string({
      required_error: "Borrow ID is required",
    }),
  }),
});

//Update Borrow
export const updateBorrowSchema = object({
  params: object({
    id: string({
      required_error: "Borrow ID is required",
    })
  }),
  body: object({
    bookId: string({ required_error: "Book ID is required" })
      .optional()
      .transform((val) => (val ? new Types.ObjectId(val) : undefined)),

    borrowDate: date().optional(),
    dueDate: date().optional(),
    returnDate: date().optional(),
    isReturned: boolean().optional(),
    lateFee: number().optional(),
  }),
});

//return book schema
export const returnBookSchema = object({
  params: object({
    id: string({
      required_error: "Borrow ID is required",
    }),
  }),

});

export type BorrowSchemaType = TypeOf<typeof borrowSchema>["body"];
export type getSingleBorrowSchemaType = TypeOf<
  typeof getSingleBorrowSchema
>["params"];
export type deleteSingleBorrowSchemaType = TypeOf<
  typeof deleteSingleBorrowSchema
>["params"];
export type  updateBorrowSchemaType = {
  params: TypeOf<typeof  updateBorrowSchema>["params"];
  body: TypeOf<typeof  updateBorrowSchema>["body"];
};
export type returnBookSchemaType = TypeOf<typeof returnBookSchema>["params"];