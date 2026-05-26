import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { LOCALES, type Locale } from "@/lib/i18n/config";

export async function POST(req: Request) {
  const { locale } = (await req.json()) as { locale?: string };
  if (!locale || !(LOCALES as readonly string[]).includes(locale)) {
    return NextResponse.json({ error: "invalid locale" }, { status: 400 });
  }
  const c = await cookies();
  c.set("lang", locale as Locale, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  return NextResponse.json({ ok: true, locale });
}
