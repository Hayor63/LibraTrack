import { object, optional, string, TypeOf, z } from "zod";

export const createUserSchema = object({
  body: object({
    userName: string({
      required_error: " Name is required",
    }),

    password: string({
      required_error: " Password is required",
    })
      .min(8, "Password should not be less than 8")
      .regex(
        /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        {
          message:
            "Password must contain uppercase letter, lowercase letter, a number and any of (!@#$%^&*).",
        }
      ),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid Email"),
    role: z.enum(["admin", "user"]).optional(),
  }),
});

export const loginSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not a valid Email"),

    password: string({
      required_error: " Password is required",
    }),
  }),
});

// Update User Profile Schema
export const updateUserProfileSchema = z.object({
  params: object({
    id: string({ required_error: "User ID is required" }), // Corrected the error message
  }),
  body: object({
    userName: string({
      required_error: " Name is required",
    }),

    password: string({
      required_error: " Password is required",
    })
      .min(8, "Password should not be less than 8")
      .regex(
        /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        {
          message:
            "Password must contain uppercase letter, lowercase letter, a number and any of (!@#$%^&*).",
        }
      ),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid Email"),
    role: z.enum(["admin", "user"]).optional(),
  }),
});

//recover password
export const recoverPasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Invalid email format"),
  }),
});


// reset password
export const resetPasswordSchema = object({
  params: object({
    id: string().nonempty({ message: "User ID is required" }),
    token: string().nonempty({ message: "Reset token is required" }),
  }),
  body: object({
    password: string({
      required_error: "Password is required",
    })
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)",
      }),
  }),
});

export type createUserInput = TypeOf<typeof createUserSchema>["body"];
export type loginInput = TypeOf<typeof loginSchema>["body"];
export type UpdateUserSchema = {
    params: TypeOf<typeof updateUserProfileSchema>["params"];
    body: TypeOf<typeof updateUserProfileSchema>["body"];
  };
  export type recoverPassword = TypeOf<typeof recoverPasswordSchema>["body"];
  export type resetPassword = {
    params: TypeOf<typeof resetPasswordSchema>["params"];
    body: TypeOf<typeof resetPasswordSchema>["body"];
  };