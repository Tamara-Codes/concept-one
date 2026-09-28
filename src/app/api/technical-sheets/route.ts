import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { technicalSheets } from "@/lib/db/schema";

export async function GET() {
  const db = getDb();
  const rows = await db
    .select({ id: technicalSheets.id, slug: technicalSheets.slug, name: technicalSheets.name, version: technicalSheets.version })
    .from(technicalSheets)
    .where(eq(technicalSheets.active, true))
    .orderBy(asc(technicalSheets.name));

  return NextResponse.json(rows);
}
