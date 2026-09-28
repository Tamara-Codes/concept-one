import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

let db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (db) return db;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to use the Concept One database");
  }

  db = drizzle(neon(databaseUrl), { schema });
  return db;
}
