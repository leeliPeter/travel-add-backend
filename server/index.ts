import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  user,
  accounts,
  sessions,
  verificationTokens,
  authenticators,
} from "./schemas/user";
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, {
  schema: { user, accounts, sessions, verificationTokens, authenticators },
});
