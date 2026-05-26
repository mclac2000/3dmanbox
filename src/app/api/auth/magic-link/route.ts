import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return NextResponse.redirect(new URL("/login?error=invalid", req.url), {
      status: 303,
    });
  }

  const supabase = serverClient();
  if (!supabase) {
    return NextResponse.redirect(new URL("/login?notice=demo", req.url), {
      status: 303,
    });
  }

  await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${process.env.APP_URL_CLUB || "https://3dman.club"}/dashboard`,
    },
  });

  return NextResponse.redirect(new URL("/login?sent=1", req.url), {
    status: 303,
  });
}
