import "server-only";

import { and, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { allowedUsers } from "@/lib/db/schema";
import { getAuth } from "@/lib/auth";

export async function isAllowedOfferEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) return false;

  const [allowedUser] = await getDb()
    .select({ id: allowedUsers.id })
    .from(allowedUsers)
    .where(
      and(
        eq(allowedUsers.email, normalizedEmail),
        eq(allowedUsers.active, true),
      ),
    )
    .limit(1);

  return Boolean(allowedUser);
}

export async function getAllowedOfferUser() {
  const { data: session } = await getAuth().getSession();
  const email = session?.user?.email?.trim().toLowerCase();

  if (!email) return null;

  const [allowedUser] = await getDb()
    .select()
    .from(allowedUsers)
    .where(and(eq(allowedUsers.email, email), eq(allowedUsers.active, true)))
    .limit(1);

  return allowedUser ?? null;
}
