import {
  headers as getHeaders,
  cookies as getCookies,
} from "next/headers";
import {
  baseProcedure,
  createTRPCRouter,
} from "@/lib/trpc/init";
import { TRPCError } from "@trpc/server";
import { loginSchema, registerSchema } from "../schema";
import { generateAuthCookie } from "./utils";

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

      const tenant = await ctx.payload.create({
        collection: "tenants",
        data: {
          name: input.username,
          slug: input.username,
          stripeAccountId: "test",
        },
      });

      await ctx.payload.create({
        collection: "users",
        data: {
          email: input.email,
          // Payload handle hashing
          password: input.password,
          username: input.username,
          // Has to be an array, this plugin enables individual user to
          // own multiple stores. in our CASE: ONE STORE PER TENANT
          tenants: [
            {
              tenant: tenant.id,
            },
          ],
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
      await generateAuthCookie({
        prefix: ctx.payload.config.cookiePrefix,
        value: data.token,
      });
    }),

  login: baseProcedure
    .input(loginSchema)
    .mutation(async ({ input, ctx }) => {
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
      await generateAuthCookie({
        prefix: ctx.payload.config.cookiePrefix,
        value: data.token,
      });

      return data;
    }),
  logout: baseProcedure.mutation(async () => {
    const cookies = await getCookies();
    cookies.delete("payload-token");
  }),
});
