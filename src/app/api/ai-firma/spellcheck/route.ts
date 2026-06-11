// RechtschreibWächter-Cron — läuft alle 6h.
// 1. Deterministischer Kern: scannt alle deutschen Inhalte, korrigiert die
//    Galerie automatisch (volle Schreibrechte), trackt alles im Audit-Log.
// 2. Agentischer Teil: der 'rechtschreib'-Agent fasst zusammen und legt bei
//    manuell zu behebenden Befunden (i18n/Komponenten) ein Proposal an.
//
// Aufruf (Server-Crontab, alle 6h):
//   curl -X POST "https://3dman.club/api/ai-firma/spellcheck?token=$AI_FIRMA_REPORT_TOKEN"
import { NextRequest, NextResponse } from "next/server";
import { checkFirmaToken } from "@/lib/ai-firma/auth";
import { runWaechter, formatReportOnly } from "@/lib/ai-firma/spellcheck";
import { runAgent } from "@/lib/ai-firma/agent-service";
import { getAgentBySlug } from "@/lib/ai-firma/db";
import { send } from "@/lib/ai-firma/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 180;

async function handle(req: NextRequest) {
  const auth = checkFirmaToken(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.reason }, { status: 401 });

  const agent = await getAgentBySlug("rechtschreib");
  const result = await runWaechter(agent?.id);

  // Agentischer Teil: nur wenn es überhaupt etwas zu berichten gibt.
  let agentText: string | undefined;
  if (agent && (result.totalFindings > 0)) {
    const task =
      `Du hast gerade die deutschen Inhalte von 3D Man Box geprüft.\n\n` +
      `Ergebnis:\n` +
      `- ${result.scannedFiles} Dateien gescannt\n` +
      `- ${result.galleryCorrections} Galerie-Korrekturen automatisch angewandt (${result.galleryFilesChanged} Dateien)\n` +
      `- ${result.reportOnly.length} Befunde in i18n/Komponenten, die Marco im Repo fixen muss:\n` +
      `${formatReportOnly(result.reportOnly)}\n\n` +
      `AUFGABE: Schreibe 2-3 Sätze Zusammenfassung. ` +
      (result.reportOnly.length > 0
        ? `Lege via create_proposal (agent_slug 'rechtschreib', category 'content', risk 'low', impact 'medium', effort 'low') EINEN Vorschlag an, der die manuell zu fixenden Stellen auflistet.`
        : `Es gibt nichts manuell zu fixen — lege KEIN Proposal an.`);

    try {
      const r = await runAgent({ agent, task, taskType: "spellcheck" });
      agentText = r.text;
    } catch (e) {
      agentText = `Agent-Fehler: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  if (req.nextUrl.searchParams.get("push_telegram") === "1" && result.totalFindings > 0) {
    await send(
      `✍️ RechtschreibWächter: ${result.galleryCorrections} Galerie-Korrekturen angewandt, ` +
      `${result.reportOnly.length} Befunde für Repo.\n\n${agentText || ""}`.slice(0, 1000),
    );
  }

  return NextResponse.json({ ok: true, ...result, agentText });
}

export const GET = handle;
export const POST = handle;
