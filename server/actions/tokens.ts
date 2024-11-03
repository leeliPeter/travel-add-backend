"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { verificationTokens } from "../schemas/user";
import { user } from "../schemas/user";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.token, email),
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const generateEmailToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 30);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.token, existingToken.token));
  }

  const verificationToken = await db
    .insert(verificationTokens)
    .values({
      token,
      expires,
      identifier: email,
    })
    .returning();
  return verificationToken;
};

export const newVerificationToken = async (token: string) => {
  const existingToken = await getVerificationTokenByEmail(token);
  if (!existingToken) {
    return { error: "Token not found" };
  }
  const hasExpired = existingToken.expires < new Date();
  if (hasExpired) {
    return { error: "Token expired" };
  }
  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, existingToken.identifier),
  });
  if (!existingUser) {
    return { error: "Email does not exist" };
  }
  await db
    .update(user)
    .set({ emailVerified: new Date(), email: existingToken.identifier });

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.token, token));

  return { success: "Email verified" };
};
