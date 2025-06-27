import { headers as getHeaders, cookies as getCookies } from "next/headers";
import { baseProcedure, createTRPCRouter } from "@/lib/trpc/init";
import { TRPCError } from "@trpc/server";
import { loginSchema, registerSchema } from "../schema";

export const authRouter = createTRPCRouter({
  // Get the current session
  session: baseProcedure.query(async ({ ctx }) => {
    // read the HTTP incoming request headers
    const headers = await getHeaders();
    // This return the user data if user is authenticated
    const session = await ctx.payload.auth({ headers });
    console.log("====================================");
    console.log(`session: ${session}`);
    console.log("====================================");
    return session;
  }),
  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      // Check if that username exist
      const existingdata = await ctx.payload.find({
        collection: "users",
        limit: 1,
        where: {
          username: {
            equals: input.username,
          },
        },
      });

      const existingUsername = existingdata.docs[0];

      if (existingUsername) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username already taken",
        });
      }

      // Check if that email exist
      const existingdata2 = await ctx.payload.find({
        collection: "users",
        limit: 1,
        where: {
          email: {
            equals: input.email,
          },
        },
      });

      const existingEmail = existingdata2.docs[0];

      if (existingEmail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email already taken",
        });
      }

      await ctx.payload.create({
        collection: "users",
        data: {
          email: input.email,
          // Payload handle hashing
          password: input.password,
          username: input.username,
        },
      });
      const data = await ctx.payload.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });
      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to authenticate",
        });
      }
      // If have token, then set cookie
      const cookies = await getCookies();
      cookies.set({
        name: "payload-token",
        value: data.token,
        httpOnly: true,
        path: "/",
        // TODO: Ensure cross-domain cookie sharing
      });
    }),

  login: baseProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    const data = await ctx.payload.login({
      collection: "users",
      data: {
        email: input.email,
        password: input.password,
      },
    });
    if (!data.token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Failed to authenticate",
      });
    }
    // If have token, then set cookie
    const cookies = await getCookies();
    cookies.set({
      name: "payload-token",
      value: data.token,
      httpOnly: true,
      path: "/",
      // TODO: Ensure cross-domain cookie sharing
    });

    return data;
  }),
  logout: baseProcedure.mutation(async () => {
    const cookies = await getCookies();
    cookies.delete("payload-token");
  }),
});
