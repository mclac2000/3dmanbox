import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET || "";

export function sign(params: Record<string, string | number>): string {
  const payload = canonical(params);
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function verify(params: Record<string, string | number>, sig: string): boolean {
  if (!SECRET || !sig) return false;
  const expected = sign(params);
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(sig, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function canonical(params: Record<string, string | number>): string {
  return Object.keys(params)
    .filter((k) => k !== "sig")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
}

export function buildDecideUrl(base: string, id: number, action: "approve" | "reject", expiresIn = 3 * 86400): string {
  const exp = Math.floor(Date.now() / 1000) + expiresIn;
  const params = { id, action, exp } as Record<string, string | number>;
  const sig = sign(params);
  const qs = new URLSearchParams({ id: String(id), action, exp: String(exp), sig }).toString();
  return `${base}/api/ai-firma/decide?${qs}`;
}
