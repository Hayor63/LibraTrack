import { object, string, number, TypeOf } from "zod";

export const createReviewSchema = object({
  params: object({
    bookId: string({
      required_error: "Book ID is required",
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

//like a comment
export const likeCommentSchema = object({
  params: object({
    id: string().nonempty("Comment ID is required"),
  }),
});

//dislike a Comment
export const dislikeCommentSchema = object({
  params: object({
    id: string().nonempty("Comment ID is required"),
  }),
});

export type createReviewSchemaType = {
  body: TypeOf<typeof createReviewSchema>["body"];
  params: TypeOf<typeof createReviewSchema>["params"];
};
export type updateReviewsAndRatingSchemaType = {
  params: TypeOf<typeof updateReviewsAndRatingSchema>["params"];
  body: TypeOf<typeof updateReviewsAndRatingSchema>["body"];
};
export type deleteSingleReview = TypeOf<
  typeof deleteSingleReviewSchema
>["params"];
export type getSingleReview = TypeOf<typeof getSingleReviewSchema>["params"];
export type likeComment = TypeOf<typeof likeCommentSchema>["params"];
export type dislikeComment = TypeOf<typeof dislikeCommentSchema>["params"];
