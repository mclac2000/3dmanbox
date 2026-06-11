// Test für die intelligente Wort-Map des RechtschreibWächters.
// Lauf:  bash scripts/run-spell-test.sh
// (transpiliert src/lib/ai-firma/spell-map.ts → Temp-ESM und importiert es hier)
import { correctText, checkText, PROTECTED_SAMPLE } from "./spell-map.js";
import { readFileSync } from "node:fs";
import path from "node:path";

let pass = 0, fail = 0;
const fails = [];

function eq(name, got, want) {
  if (JSON.stringify(got) === JSON.stringify(want)) pass++;
  else { fail++; fails.push(`✗ ${name}\n    got:  ${JSON.stringify(got)}\n    want: ${JSON.stringify(want)}`); }
}

// ---- 1. Umlaut-Restauration (token-genau) ----
eq("ueber→über", correctText("ueber").text, "über");
eq("Ueber→Über (Capitalize)", correctText("Ueber").text, "Über");
eq("fuer→für", correctText("fuer").text, "für");
eq("groesste→größte", correctText("groesste").text, "größte");
eq("Qualitaet→Qualität", correctText("Qualitaet").text, "Qualität");
eq("QUALITAET→QUALITÄT (Allcaps)", correctText("QUALITAET").text, "QUALITÄT");
eq("strasse→Straße im Satz", correctText("In der strasse").text, "In der Straße");
eq("Satz mit fuer+ueberall", correctText("Bilder fuer ueberall").text, "Bilder für überall");

// ---- 2. Tippfehler ----
eq("seperat→separat", correctText("seperat").text, "separat");
eq("Standart→Standard", correctText("Standart").text, "Standard");
eq("wiederspiegeln→widerspiegeln", correctText("wiederspiegeln").text, "widerspiegeln");

// ---- 3. Phrase-Fix (kaputter Galerie-Titel) ----
eq("Galerie-Slug 'spiritualita t'", correctText("spiritualita t und esoterik 1200").text,
  "Spiritualität und esoterik 1200");

// ---- 4. KRITISCH: 'nicht blind ue→ü' — geschützte Wörter bleiben unberührt ----
for (const w of PROTECTED_SAMPLE) eq(`Schutz: ${w}`, correctText(w).text, w);
eq("Schutz im Satz: 'die neue Steuer auf das Feuer'",
  correctText("die neue Steuer auf das Feuer").text, "die neue Steuer auf das Feuer");
eq("Schutz: 'ein blaues Abenteuer'", correctText("ein blaues Abenteuer").text, "ein blaues Abenteuer");

// ---- 5. KRITISCH: sauberes Real-Content erzeugt KEINE Fehl-Funde ----
const dePath = path.join(process.cwd(), "src/lib/i18n/locales/de.json");
const deRaw = readFileSync(dePath, "utf8");
const deChanges = checkText(deRaw); // ganze Datei als String prüfen
eq("de.json: keine False-Positives", deChanges.length, 0);

// ---- 6. Bereits korrekt bleibt korrekt ----
eq("bereits 'über'", correctText("über").text, "über");
eq("bereits 'die größte Bibliothek'", correctText("die größte Bibliothek").text, "die größte Bibliothek");

console.log(`\nRechtschreib-Map Test: ${pass} bestanden, ${fail} fehlgeschlagen.`);
if (fail) { console.log("\n" + fails.join("\n\n")); process.exit(1); }
console.log("✓ Alle Tests grün — intelligente Wort-Map verhält sich korrekt.");
