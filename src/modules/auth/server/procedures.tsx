import { headers as getHeaders } from "next/headers";
import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "@/lib/trpc/init";

export const authRouter = createTRPCRouter({
  // Get the current session
  session: baseProcedure.query(async ({ ctx }) => {
    // read the HTTP incoming request headers
    const headers = await getHeaders();
    // This return the user data if user is authenticated
    const session = await ctx.payload.auth({ headers });
    return session;
  }),
  register: baseProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
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
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.payload.create({
        collection: "users",
        data: {
          email: input.email,
          // Payload handle hashing
          password: input.password,
          username: input.username,
        },
      });
    }),
});
