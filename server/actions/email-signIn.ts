"use server";

import { loginSchema } from "@/types/login-schema";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { user } from "../schemas/user";
import { createSafeActionClient } from "next-safe-action";
import { generateEmailToken } from "./tokens";
import { sendEmail } from "./email";
import { AuthError } from "@auth/core/errors";
import signIn from "../auth";

const actionClient = createSafeActionClient();

export const emailSignIn = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    try {
      const existingUser = await db.query.user.findFirst({
        where: eq(user.email, email),
      });

      if (existingUser?.email !== email) {
        return { error: "User not found" };
      }

      if (!existingUser.emailVerified) {
        const token = await generateEmailToken(email);
        await sendEmail(token[0].identifier, token[0].token);
        return { success: "Email confirmation sent" };
      }

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });

      return { success: "User signed in" };
    } catch (error) {
      console.log(error);
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Invalid credentials" };
          case "AccessDenied":
            return { error: "Access denied" };
          case "OAuthSignInError":
            return { error: "OAuth sign in failed" };
          default:
            return { error: "Authentication failed" };
        }
      }
      return { error: "Something went wrong" };
    }
  });
