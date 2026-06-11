// ============================================================
// RechtschreibWächter — Intelligente deutsche Wort-Map
// ------------------------------------------------------------
// KERNPRINZIP: "nicht blind ue→ü".
// Diese Map korrigiert NUR Tokens, die sie explizit kennt (Whitelist).
// Ein naiver Regex `ue→ü` würde echte Wörter wie "Steuer", "neue",
// "Feuer", "Abenteuer", "Dauer" zerstören. Diese Wörter sind schlicht
// KEINE Schlüssel in der Map → sie bleiben unberührt. Genau das macht
// die Korrektur intelligent statt blind.
//
// Drei Stufen, in dieser Reihenfolge:
//   1. PHRASE_FIXES   — mehrwortige Muster (z.B. kaputte Galerie-Titel)
//   2. UMLAUT_FIXES   — ASCII-Transliteration → echter Umlaut/ß (token-genau)
//   3. TYPO_FIXES     — häufige deutsche Tippfehler (token-genau)
// ============================================================

export interface SpellChange {
  original: string;
  suggestion: string;
  rule: "phrase" | "umlaut" | "typo";
  confidence: "high" | "medium";
}

export interface SpellResult {
  text: string;
  changes: SpellChange[];
}

// ------------------------------------------------------------
// 1. PHRASE_FIXES — werden auf den GESAMTEN Text angewandt (vor Tokenisierung).
//    Für kaputte mehrwortige Strings, v.a. aus Datei-Slugs der Galerie
//    (Umlaut → Buchstabe + Leerzeichen). Case-insensitiv, ß/Umlaut-sicher.
// ------------------------------------------------------------
const PHRASE_FIXES: Array<{ pattern: RegExp; replacement: string }> = [
  // "spiritualita t und esoterik" → "Spiritualität und Esoterik"
  { pattern: /\bspiritualita\s+t\b/gi, replacement: "Spiritualität" },
  // generisches Slug-Artefakt: "...ita t " → "...ität " (nur am Wortende vor Leerzeichen)
  { pattern: /([a-zäöü]{4,})ita\s+t\b/gi, replacement: "$1ität" },
];

// ------------------------------------------------------------
// 2. UMLAUT_FIXES — token-genaue ASCII→Umlaut/ß-Restauration.
//    Schlüssel: lowercase. Wert: korrekte Schreibweise (lowercase-Form).
//    Groß-/Kleinschreibung des Originals wird bei der Anwendung erhalten.
//    NUR echte, eindeutige Wörter — keine Wörter, bei denen ue/oe/ae/ss
//    legitim sind (die fehlen hier bewusst).
// ------------------------------------------------------------
const UMLAUT_FIXES: Record<string, string> = {
  // ü
  ueber: "über",
  ueberall: "überall",
  ueberzeugen: "überzeugen",
  fuer: "für",
  fuers: "fürs",
  zurueck: "zurück",
  natuerlich: "natürlich",
  guenstig: "günstig",
  unguenstig: "ungünstig",
  verfuegbar: "verfügbar",
  duerfen: "dürfen",
  muessen: "müssen",
  muss: "muss", // bewusst Identität (Schutz, falls Tooling es anfasst)
  koennen: "können",
  koennte: "könnte",
  wuerde: "würde",
  wuenschen: "wünschen",
  wuensche: "wünsche",
  fuehren: "führen",
  fuehrungskraefte: "Führungskräfte",
  buecher: "Bücher",
  stueck: "Stück",
  truecks: "Trucks",
  beruehmt: "berühmt",
  gemuetlich: "gemütlich",
  pruefen: "prüfen",
  gruen: "grün",
  fluessig: "flüssig",
  schluessel: "Schlüssel",
  // ö
  groesse: "Größe",
  groesste: "größte",
  groesser: "größer",
  loesung: "Lösung",
  loeschen: "löschen",
  moeglich: "möglich",
  moeglichkeit: "Möglichkeit",
  schoen: "schön",
  schoene: "schöne",
  oeffnen: "öffnen",
  hoeren: "hören",
  stoebern: "stöbern",
  stoebere: "stöbere",
  woechentlich: "wöchentlich",
  persoenlich: "persönlich",
  // ä
  qualitaet: "Qualität",
  aktivitaet: "Aktivität",
  kreativitaet: "Kreativität",
  spiritualitaet: "Spiritualität",
  universitaet: "Universität",
  praesentation: "Präsentation",
  praesentationen: "Präsentationen",
  laender: "Länder",
  waehlen: "wählen",
  waehle: "wähle",
  naechste: "nächste",
  naechsten: "nächsten",
  haeufig: "häufig",
  taeglich: "täglich",
  maerkte: "Märkte",
  qualitativ: "qualitativ",
  aehnlich: "ähnlich",
  erhaeltlich: "erhältlich",
  geschaeft: "Geschäft",
  hochaufgeloest: "hochaufgelöst",
  aufgeloest: "aufgelöst",
  // ß
  strasse: "Straße",
  grosse: "große",
  grosser: "großer",
  grosses: "großes",
  gross: "groß",
  schliessen: "schließen",
  geniessen: "genießen",
  massnahme: "Maßnahme",
  massnahmen: "Maßnahmen",
  spass: "Spaß",
  fuss: "Fuß",
  weiss: "weiß",
};

// ------------------------------------------------------------
// 3. TYPO_FIXES — häufige deutsche Tippfehler (token-genau, lowercase-Key).
// ------------------------------------------------------------
const TYPO_FIXES: Record<string, string> = {
  seperat: "separat",
  seperate: "separate",
  standart: "Standard",
  wiederspiegeln: "widerspiegeln",
  wiederspiegelt: "widerspiegelt",
  rhytmus: "Rhythmus",
  lizens: "Lizenz",
  lizensfrei: "lizenzfrei",
  aktuel: "aktuell",
  professionel: "professionell",
  individuel: "individuell",
  kommerziel: "kommerziell",
  generel: "generell",
  wilkommen: "willkommen",
  intressant: "interessant",
  interesant: "interessant",
  naehmlich: "nämlich",
  nähmlich: "nämlich",
  zuviel: "zu viel",
  authentisch: "authentisch",
  acount: "Account",
  adress: "Adresse",
  apropriat: "passend",
  effizent: "effizient",
  garanti: "Garantie",
  garantie: "Garantie",
  premiumm: "Premium",
  bezahlst: "bezahlst",
  herrunterladen: "herunterladen",
  herunterzuladen: "herunterzuladen",
  downloaden: "herunterladen",
};

// Tokens, deren ASCII-Sequenz ue/oe/ae/ss legitim ist — als Doku & Test-Anker.
// Sie tauchen bewusst NICHT in den Maps oben auf, werden also nie verändert.
export const PROTECTED_SAMPLE = [
  "Steuer", "neue", "neuen", "Feuer", "treue", "Abenteuer", "Dauer",
  "Bauer", "Mauer", "Trauer", "genau", "blau", "grau", "Frau", "Frauen",
  "auch", "Haus", "Pause", "kaufen", "laufen", "glauben", "Auge", "heute",
  "Leute", "Freude", "Europa", "Museum", "Poesie", "Aerosol", "Aussage",
];

function applyCase(original: string, fixLower: string): string {
  if (original === original.toUpperCase() && original !== original.toLowerCase()) {
    return fixLower.toUpperCase();
  }
  if (original[0] === original[0]?.toUpperCase()) {
    return fixLower.charAt(0).toUpperCase() + fixLower.slice(1);
  }
  return fixLower;
}

function lookupToken(tokenLower: string): { fix: string; rule: "umlaut" | "typo" } | null {
  if (Object.prototype.hasOwnProperty.call(UMLAUT_FIXES, tokenLower)) {
    return { fix: UMLAUT_FIXES[tokenLower], rule: "umlaut" };
  }
  if (Object.prototype.hasOwnProperty.call(TYPO_FIXES, tokenLower)) {
    return { fix: TYPO_FIXES[tokenLower], rule: "typo" };
  }
  return null;
}

// Wort-Grenzen inkl. Umlaute/ß. Wir ersetzen pro Match unter Erhalt von Satzzeichen.
const TOKEN_RE = /[A-Za-zÄÖÜäöüß]+/g;

/** Liefert Korrektur-Vorschläge, ohne den Text zu verändern. */
export function checkText(text: string): SpellChange[] {
  return correctText(text).changes;
}

/** Korrigiert den Text und liefert das Resultat + alle Änderungen. */
export function correctText(input: string): SpellResult {
  const changes: SpellChange[] = [];
  let text = input;

  // Stufe 1: Phrasen
  for (const { pattern, replacement } of PHRASE_FIXES) {
    text = text.replace(pattern, (match, ...rest) => {
      // $1-Ersetzung manuell, damit wir das tatsächliche Resultat tracken
      const groups = rest.slice(0, -2) as string[];
      const result = replacement.replace(/\$(\d)/g, (_, n) => groups[Number(n) - 1] ?? "");
      const finalResult = result === replacement ? replacement : result;
      if (match !== finalResult) {
        changes.push({ original: match, suggestion: finalResult, rule: "phrase", confidence: "medium" });
      }
      return finalResult;
    });
  }

  // Stufe 2+3: token-genau
  text = text.replace(TOKEN_RE, (token) => {
    const hit = lookupToken(token.toLowerCase());
    if (!hit) return token;
    const cased = applyCase(token, hit.fix);
    if (cased === token) return token;
    changes.push({ original: token, suggestion: cased, rule: hit.rule, confidence: "high" });
    return cased;
  });

  return { text, changes };
}

/** Reine Prüfung: gibt es überhaupt etwas zu korrigieren? */
export function hasIssues(text: string): boolean {
  return correctText(text).changes.length > 0;
}

export const SPELL_MAP_STATS = {
  umlautEntries: Object.keys(UMLAUT_FIXES).length,
  typoEntries: Object.keys(TYPO_FIXES).length,
  phrasePatterns: PHRASE_FIXES.length,
};
