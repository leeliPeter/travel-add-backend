import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/types/login-schema";
import { eq } from "drizzle-orm";
import { user } from "./schemas/user";
import bcrypt from "bcrypt";

export const authOptions = {
  adapter: DrizzleAdapter(db),
  secret: process.env.SECRET!,
  callbacks: {
    async session({ session, user }: { session: any; user: { id: string } }) {
      session.user.id = user.id;
      return session;
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    Github({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const validatedFields = loginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const foundUser = await db.query.user.findFirst({
            where: eq(user.email, email),
          });
          if (!foundUser || !foundUser.password) return null;

          const passwordMatch = await bcrypt.compare(
            password,
            foundUser.password
          );
          if (passwordMatch) {
            return foundUser;
          }
        }
        return null;
      },
    }),
  ],
};

export default NextAuth(authOptions);
