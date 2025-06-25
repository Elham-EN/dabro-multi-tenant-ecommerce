import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must have at least 6 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(63, "Username must be less than 63 characters")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Username can only contain lowercase lettwes, numbers and hypens. It ends with a letter or number"
    )
    .refine(
      (val) => !val.includes("---"),
      "Username cannot contain consecutive hypens"
    )
    .transform((val) => val.toLowerCase()),
});
