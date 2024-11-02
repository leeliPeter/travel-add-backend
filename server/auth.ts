import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";

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
  ],
};

export default NextAuth(authOptions);
