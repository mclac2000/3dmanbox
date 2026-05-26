import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Free trial: one image per IP per cookie. fal.ai LoRA call.
// The cookie is the cheap rate-limit; we don't pretend it's bulletproof.

export const runtime = "nodejs";
export const maxDuration = 60;

const FAL_KEY = process.env.FAL_KEY;

export async function POST(req: Request) {
  const { prompt } = (await req.json()) as { prompt?: string };
  if (!prompt || prompt.length < 4) {
    return NextResponse.json({ error: "Please describe the character" }, { status: 400 });
  }
  if (prompt.length > 400) {
    return NextResponse.json({ error: "Prompt too long" }, { status: 400 });
  }

  const c = await cookies();
  const used = c.get("try_used")?.value;
  if (used === "1") {
    return NextResponse.json({ error: "limit", message: "limit reached" }, { status: 429 });
  }

  if (!FAL_KEY) {
    return NextResponse.json({ error: "service not configured" }, { status: 503 });
  }

  // Use fal-ai/fast-sdxl for the demo (fast, cheap, no LoRA needed for trial)
  const styled = `${prompt}, 3D character render, white background, clay material, friendly, soft lighting, full body, centered composition`;

  try {
    const res = await fetch("https://fal.run/fal-ai/fast-sdxl", {
      method: "POST",
      headers: {
        Authorization: `Key ${FAL_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        prompt: styled,
        image_size: "square_hd",
        num_inference_steps: 25,
        num_images: 1,
        enable_safety_checker: true,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("fal.ai error", res.status, text);
      return NextResponse.json({ error: "generation failed" }, { status: 502 });
    }

    type FalResp = { images?: { url: string }[] };
    const data = (await res.json()) as FalResp;
    const image = data.images?.[0]?.url;
    if (!image) {
      return NextResponse.json({ error: "no image returned" }, { status: 502 });
    }

    // mark cookie as used (free trial spent)
    c.set("try_used", "1", {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({ image, prompt: styled });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "generation failed" }, { status: 502 });
  }
}
