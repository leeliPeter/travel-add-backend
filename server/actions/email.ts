"use server";

import getBaseUrl from "@/lib/base-url";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseUrl();

export const sendEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/api/auth/verification?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `Confirm your email by clicking <a href="${confirmLink}">here</a>`,
  });
  if (error) return error;

  if (data) return data;
};
