import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users, accounts, sessions, verificationTokens, authenticators } from "./schemas/user"; // Import all user-related schemas  
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema: { users, accounts, sessions, verificationTokens, authenticators } });
