import { object, string, date, z, TypeOf } from "zod";

export const bookReservationSchema = object({
  params: object({
    bookId: string({
      required_error: "Book ID is required",
    }),
  }),
});


// Update Book reservation schema

export const updateBookReservationSchema = object({
  params: object({
    id: string({
      required_error: "Book Reservation ID is required",
    }),
  }),
  body: object({
    status: z
      .enum(["pending", "fulfilled", "canceled"], {
        required_error: "Status is required",
        invalid_type_error:
          "Status must be 'pending', 'fulfilled', or 'canceled'",
      })
      .default("pending"),

    expirationDate: date().optional(), // Make expirationDate optional for updates
  }),
});

//Delete Reservation
export const deleteSingleReservationSchema = object({
  params: object({
    id: string({
      required_error: "Book Reservation ID is required",
    }),
  }),
});

// get Single Reservation
export const getSingleBookReservationSchema = object({
  params: object({
    id: string({
      required_error: "Book Reservation ID is required",
    }),
  }),
});

// get User Reservation
export const getUserBookReservationSchema = object({
  params: object({
    id: string({
      required_error: "User ID is required",
    }),
  }),
});


//cancel Reservation
export const cancelUserBookReservationSchema = object({
  params: object({
    id: string({
      required_error: "Book reservation ID is required",
    }),
  }),
});

//get reservation history
export const getReservationHistorySchema = object({
  query: object({
    pageNumber: string().optional(),
    pageSize: string().optional(),
    sortField: string().optional(),
    sortType: string().optional(),
    search: string().optional(),
    userId: string().optional(), // only for admins
  }),
});



// export type BookReservationBodyType = TypeOf<typeof bookReservationSchema>["body"];
export type BookReservationParamsType = z.infer<typeof bookReservationSchema>["params"];

export type updateBookReservationSchemaType = {
  params: TypeOf<typeof updateBookReservationSchema>["params"];
  body: TypeOf<typeof updateBookReservationSchema>["body"];
};

export type deleteSingleReservationSchemaType = TypeOf<typeof deleteSingleReservationSchema>["params"]
export type getSingleBookReservationSchemaType = TypeOf<typeof getSingleBookReservationSchema>["params"];
export type getBookReservationSchemaType = TypeOf<typeof getUserBookReservationSchema>["params"];
export type cancelUserBookReservationSchemaType  = TypeOf<typeof cancelUserBookReservationSchema >["params"];
export type getReservationHistorySchemaType = TypeOf<typeof getReservationHistorySchema >["query"];