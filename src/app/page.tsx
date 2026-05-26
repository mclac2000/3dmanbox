import { redirect } from "next/navigation";
import { headers } from "next/headers";

// Fallback root — proxy.ts handles routing for production hosts.
// Locally without host-aware proxy, send everyone to the club homepage.
export default async function RootRedirect() {
  const h = await headers();
  const host = (h.get("host") || "").toLowerCase();
  if (host.includes("3dmanbox") || host.startsWith("box.")) {
    redirect("/box");
  }
  redirect("/club");
}
