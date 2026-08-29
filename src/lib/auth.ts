import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { db } from "../utils/db";
import { env } from "../env";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL ?? "http://localhost:3000",
  trustedOrigins: [
    "http://localhost:3000",
    "https://sorosfebria.co",
    "https://www.sorosfebria.co",
    "https://s11o.online",
    "https://www.s11o.online",
  ],
  database: prismaAdapter(db, { provider: "postgresql" }),
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [nextCookies()],
  user: {
    additionalFields: {
      gamerscore: { type: "number", defaultValue: 0 },
      avatar: { type: "string", defaultValue: "guest_gamerpic.svg" },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
