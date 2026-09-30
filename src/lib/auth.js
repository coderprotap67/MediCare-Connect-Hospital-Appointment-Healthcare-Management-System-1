import { betterAuth } from "better-auth";
export const auth = betterAuth({
  database: {
    provider: "mongodb",
    url: process.env.MONGODB_URI,
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
});