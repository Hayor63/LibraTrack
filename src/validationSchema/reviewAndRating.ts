import { object, string, number, TypeOf } from "zod";

export const createReviewSchema = object({
  body: object({
    bookId: string({
      required_error: "Book ID is required",
    }),

    review: string({
      required_error: "Review is required",
    }).min(1, "Review cannot be empty"),

    rating: number({
      required_error: "Rating is required",
    })
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must not be more than 5"),
  }),
});

// update

export const updateReviewsAndRatingSchema = object({
  params: object({
    id: string({
      required_error: "review ID is required",
    }),
  }),
  body: object({
    review: string({
      required_error: "Review is required",
    }).min(1, "Review cannot be empty"),

    rating: number({
      required_error: "Rating is required",
    })
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must not be more than 5"),
  }),
});

//Delete Reviews
export const deleteSingleReviewSchema = object({
  params: object({
    id: string({
      required_error: "review ID is required",
    }),
  }),
});

// get Single Reviews
export const getSingleReviewSchema = object({
  params: object({
    id: string({
      required_error: "review ID is required",
    }),
  }),
});

export type createReviewSchemaType = TypeOf<typeof createReviewSchema>["body"];
export type updateReviewsAndRatingSchemaType = {
  params: TypeOf<typeof updateReviewsAndRatingSchema>["params"];
  body: TypeOf<typeof updateReviewsAndRatingSchema>["body"];
};
export type deleteSingleReview = TypeOf<typeof deleteSingleReviewSchema>["params"]
export type getSingleReview = TypeOf<typeof getSingleReviewSchema>["params"]