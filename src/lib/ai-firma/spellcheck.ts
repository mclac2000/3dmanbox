// ============================================================
// RechtschreibWächter — Content-Scanner & Korrektur-Anwender
// ------------------------------------------------------------
// Durchsucht die deutschen 3D-Man-Inhalte und korrigiert sie:
//   • Galerie (categories.json + manifests)  → VOLLE Korrektur-Rechte,
//     wird zur Laufzeit per fs gelesen → Schreiben wirkt sofort.
//   • i18n (de.json)                         → Scan + Report (gebündelt
//     im Build → Laufzeit-Schreiben wirkungslos → Proposal an Marco).
//   • Komponenten (.tsx)                     → Scan + Report (kein Auto-
//     Write in Quellcode; Befunde gehen ins Proposal).
//
// Jede Korrektur wird in `spelling_corrections` getrackt (Audit-Log).
// ============================================================

import { promises as fs } from "node:fs";
import path from "node:path";
import { correctText, type SpellChange } from "./spell-map";
import { clearGalleryCache } from "@/lib/gallery";

const ROOT = process.cwd();

export type Source = "gallery" | "i18n" | "component";

export interface Finding {
  source: Source;
  file: string;        // relativer Pfad
  location: string;    // z.B. JSON-Keypfad oder Zeilennr.
  original: string;
  suggestion: string;
  rule: SpellChange["rule"];
  confidence: SpellChange["confidence"];
  autoApplicable: boolean;
}

export interface ScanResult {
  findings: Finding[];
  scannedFiles: number;
  bySource: Record<Source, number>;
}

// ------------------------------------------------------------
// Hilfsfunktionen
// ------------------------------------------------------------
async function readJson<T>(rel: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(path.join(ROOT, rel), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function listFiles(rel: string, ext: string): Promise<string[]> {
  const abs = path.join(ROOT, rel);
  const out: string[] = [];
  async function walk(dir: string) {
    let entries: import("node:fs").Dirent[];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) await walk(full);
      else if (e.isFile() && e.name.endsWith(ext)) out.push(full);
    }
  }
  await walk(abs);
  return out;
}

// ------------------------------------------------------------
// 1. GALERIE scannen
// ------------------------------------------------------------
type CatOverview = { slug: string; title: string; cover?: string };
type Manifest = { slug: string; title: string; images: Array<{ file: string; title: string }> };

async function scanGallery(): Promise<{ findings: Finding[]; files: number }> {
  const findings: Finding[] = [];
  let files = 0;

  const cats = await readJson<CatOverview[]>("public/gallery/categories.json");
  if (cats) {
    files++;
    cats.forEach((c, i) => {
      const r = correctText(c.title || "");
      for (const ch of r.changes) {
        findings.push({
          source: "gallery", file: "public/gallery/categories.json",
          location: `[${i}].title`, original: ch.original, suggestion: ch.suggestion,
          rule: ch.rule, confidence: ch.confidence, autoApplicable: true,
        });
      }
    });

    for (const c of cats) {
      const rel = `public/gallery/${c.slug}/manifest.json`;
      const man = await readJson<Manifest>(rel);
      if (!man) continue;
      files++;
      const titleRes = correctText(man.title || "");
      for (const ch of titleRes.changes) {
        findings.push({
          source: "gallery", file: rel, location: "title",
          original: ch.original, suggestion: ch.suggestion,
          rule: ch.rule, confidence: ch.confidence, autoApplicable: true,
        });
      }
      (man.images || []).forEach((img, i) => {
        const res = correctText(img.title || "");
        for (const ch of res.changes) {
          findings.push({
            source: "gallery", file: rel, location: `images[${i}].title`,
            original: ch.original, suggestion: ch.suggestion,
            rule: ch.rule, confidence: ch.confidence, autoApplicable: true,
          });
        }
      });
    }
  }
  return { findings, files };
}

// ------------------------------------------------------------
// 2. i18n de.json scannen (Report-only)
// ------------------------------------------------------------
async function scanI18n(): Promise<{ findings: Finding[]; files: number }> {
  const findings: Finding[] = [];
  const rel = "src/lib/i18n/locales/de.json";
  const dict = await readJson<Record<string, unknown>>(rel);
  if (!dict) return { findings, files: 0 };

  function walk(node: unknown, keyPath: string) {
    if (typeof node === "string") {
      const r = correctText(node);
      for (const ch of r.changes) {
        findings.push({
          source: "i18n", file: rel, location: keyPath,
          original: ch.original, suggestion: ch.suggestion,
          rule: ch.rule, confidence: ch.confidence, autoApplicable: false,
        });
      }
    } else if (Array.isArray(node)) {
      node.forEach((v, i) => walk(v, `${keyPath}[${i}]`));
    } else if (node && typeof node === "object") {
      for (const [k, v] of Object.entries(node)) walk(v, keyPath ? `${keyPath}.${k}` : k);
    }
  }
  walk(dict, "");
  return { findings, files: 1 };
}

// ------------------------------------------------------------
// 3. Komponenten-Texte scannen (Report-only) — nur String-Literale.
// ------------------------------------------------------------
const STRING_LITERAL_RE = /"([^"\\]{3,})"|'([^'\\]{3,})'|`([^`\\]{3,})`/g;
const GERMAN_HINT = /[a-zäöü]{3,}/i;

async function scanComponents(): Promise<{ findings: Finding[]; files: number }> {
  const findings: Finding[] = [];
  const dirs = ["src/components/box", "src/components/club", "src/components/donate",
    "src/components/try", "src/components/gallery"];
  let files = 0;
  for (const d of dirs) {
    const tsxFiles = await listFiles(d, ".tsx");
    for (const abs of tsxFiles) {
      files++;
      const rel = path.relative(ROOT, abs);
      const text = await fs.readFile(abs, "utf8");
      const lines = text.split("\n");
      lines.forEach((line, idx) => {
        let m: RegExpExecArray | null;
        STRING_LITERAL_RE.lastIndex = 0;
        while ((m = STRING_LITERAL_RE.exec(line)) !== null) {
          const literal = m[1] ?? m[2] ?? m[3] ?? "";
          if (!GERMAN_HINT.test(literal)) continue;
          const r = correctText(literal);
          for (const ch of r.changes) {
            findings.push({
              source: "component", file: rel, location: `Zeile ${idx + 1}`,
              original: ch.original, suggestion: ch.suggestion,
              rule: ch.rule, confidence: ch.confidence, autoApplicable: false,
            });
          }
        }
      });
    }
  }
  return { findings, files };
}

// ------------------------------------------------------------
// Öffentliche Scan-API
// ------------------------------------------------------------
export async function scanAll(): Promise<ScanResult> {
  const [g, i, c] = await Promise.all([scanGallery(), scanI18n(), scanComponents()]);
  const findings = [...g.findings, ...i.findings, ...c.findings];
  return {
    findings,
    scannedFiles: g.files + i.files + c.files,
    bySource: {
      gallery: g.findings.length,
      i18n: i.findings.length,
      component: c.findings.length,
    },
  };
}

// ------------------------------------------------------------
// Galerie-Korrekturen anwenden (volle Schreibrechte)
// ------------------------------------------------------------
export async function applyGalleryFixes(): Promise<{ filesChanged: number; corrections: number }> {
  let filesChanged = 0;
  let corrections = 0;

  // categories.json
  const catsRel = "public/gallery/categories.json";
  const cats = await readJson<CatOverview[]>(catsRel);
  if (cats) {
    let changed = false;
    for (const c of cats) {
      const r = correctText(c.title || "");
      if (r.changes.length) { c.title = r.text; changed = true; corrections += r.changes.length; }
    }
    if (changed) {
      await fs.writeFile(path.join(ROOT, catsRel), JSON.stringify(cats, null, 2) + "\n", "utf8");
      filesChanged++;
    }

    // manifests
    for (const c of cats) {
      const rel = `public/gallery/${c.slug}/manifest.json`;
      const man = await readJson<Manifest>(rel);
      if (!man) continue;
      let changed2 = false;
      const tr = correctText(man.title || "");
      if (tr.changes.length) { man.title = tr.text; changed2 = true; corrections += tr.changes.length; }
      for (const img of man.images || []) {
        const ir = correctText(img.title || "");
        if (ir.changes.length) { img.title = ir.text; changed2 = true; corrections += ir.changes.length; }
      }
      if (changed2) {
        await fs.writeFile(path.join(ROOT, rel), JSON.stringify(man, null, 2) + "\n", "utf8");
        filesChanged++;
      }
    }
  }

  if (filesChanged > 0) clearGalleryCache();
  return { filesChanged, corrections };
}

// ------------------------------------------------------------
// Tracking — Audit-Log in Supabase. Best-effort (Tabelle optional).
// ------------------------------------------------------------
export async function trackCorrections(
  agentId: number,
  findings: Finding[],
  status: "applied" | "proposed",
): Promise<void> {
  if (findings.length === 0) return;
  try {
    const { sb } = await import("./db");
    const rows = findings.map((f) => ({
      agent_id: agentId,
      source: f.source,
      file: f.file,
      location: f.location,
      original: f.original,
      suggestion: f.suggestion,
      rule: f.rule,
      confidence: f.confidence,
      status,
    }));
    await sb().from("spelling_corrections").insert(rows);
  } catch {
    // Tabelle evtl. noch nicht migriert — Tracking ist nicht kritisch.
  }
}

// ------------------------------------------------------------
// Orchestrator — deterministischer Kern des RechtschreibWächters.
// Scan → Galerie auto-korrigieren → tracken. Garantiert korrekt,
// unabhängig vom LLM. Liefert report-only-Befunde für ein Proposal.
// ------------------------------------------------------------
export interface WaechterResult {
  scannedFiles: number;
  totalFindings: number;
  bySource: Record<Source, number>;
  galleryFilesChanged: number;
  galleryCorrections: number;
  reportOnly: Finding[]; // i18n + Komponenten — manuell zu fixen
}

export async function runWaechter(agentId?: number): Promise<WaechterResult> {
  const scan = await scanAll();
  const galleryFindings = scan.findings.filter((f) => f.autoApplicable);
  const reportOnly = scan.findings.filter((f) => !f.autoApplicable);

  const applied = await applyGalleryFixes();

  if (agentId) {
    if (galleryFindings.length) await trackCorrections(agentId, galleryFindings, "applied");
    if (reportOnly.length) await trackCorrections(agentId, reportOnly, "proposed");
  }

  return {
    scannedFiles: scan.scannedFiles,
    totalFindings: scan.findings.length,
    bySource: scan.bySource,
    galleryFilesChanged: applied.filesChanged,
    galleryCorrections: applied.corrections,
    reportOnly,
  };
}

/** Report-only-Befunde kompakt für ein Proposal/Telegram formatieren. */
export function formatReportOnly(findings: Finding[], max = 20): string {
  if (!findings.length) return "Keine manuell zu behebenden Befunde.";
  const lines = findings.slice(0, max).map(
    (f) => `• ${f.file} (${f.location}): „${f.original}" → „${f.suggestion}"`,
  );
  if (findings.length > max) lines.push(`… und ${findings.length - max} weitere.`);
  return lines.join("\n");
}
