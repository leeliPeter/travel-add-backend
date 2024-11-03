"use server";

import { registerSchema } from "@/types/register-schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { user, verificationTokens } from "../schemas/user";
import { createSafeActionClient } from "next-safe-action";
import { generateEmailToken } from "./tokens";
import bcrypt from "bcrypt";
import { sendEmail } from "./email";
const actionClient = createSafeActionClient();

export const emailRegister = actionClient
  .schema(registerSchema)
  .action(
    async ({ parsedInput: { name, email, password, confirmPassword } }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const existingUser = await db.query.user.findFirst({
        where: eq(user.email, email),
      });

      if (existingUser) {
        if (!existingUser.emailVerified) {
          const token = await generateEmailToken(email);
          // identifier == email
          await sendEmail(token[0].identifier, token[0].token);

          return { success: "Email confination resent" };
        }
        return { error: "User already exists" };
      }

      // when user if not registered
      await db.insert(user).values({
        name,
        email,
        // password: hashedPassword,
      });

      const token = await generateEmailToken(email);
      await sendEmail(token[0].identifier, token[0].token);

      return { success: "Email confination sent" };
    }
  );
