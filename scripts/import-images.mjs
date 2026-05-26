#!/usr/bin/env node
// Picks images from Google Drive and downscales them to webp for the gallery.
// Output: public/gallery/<slug>/thumb-NN.webp + featured-NN.webp + manifest.json

import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const DRIVE = "/Users/marcol/Library/CloudStorage/GoogleDrive-marcol@geldhelden.org/Meine Ablage/3D Man Box";
const OUT = path.join(process.cwd(), "public", "gallery");

// 10 categories — slug → Drive folder names
const CATEGORIES = {
  business: {
    title: "Business",
    folders: ["business und investment", "Berufe und Jobs", "Internetmarketing-und-E-Business", "Trading-und-Wettsysteme", "Projektmanagement", "Dienstleistungen"],
    accent: "#3b82f6",
  },
  sport: {
    title: "Sport",
    folders: ["sport"],
    accent: "#ef4444",
  },
  wellness: {
    title: "Wellness",
    folders: ["Wellness-Gesundheit-Medizin", "Persönlichkeitsentwicklung (1)", "Spiritualität-und-Esoterik"],
    accent: "#10b981",
  },
  family: {
    title: "Family",
    folders: ["Familie und Kinder", "Dating beziehung und liebe", "Geburtstage", "Valentinstag"],
    accent: "#ec4899",
  },
  travel: {
    title: "Travel",
    folders: ["Reisen-und-Kultur", "hotels-und-gastronomie"],
    accent: "#f59e0b",
  },
  food: {
    title: "Food",
    folders: ["Essen und Trinken"],
    accent: "#f97316",
  },
  events: {
    title: "Events",
    folders: ["Events und Seminare", "Events-und-Seminare", "Halloween-Karneval", "Weihnachten", "Ostern", "Tanz-und-Musik"],
    accent: "#a855f7",
  },
  tech: {
    title: "Tech",
    folders: ["Computer und Internet", "Software", "Fotografie-und-Film", "social media", "Email marketing"],
    accent: "#06b6d4",
  },
  education: {
    title: "Education",
    folders: ["Bildung", "sprachen"],
    accent: "#8b5cf6",
  },
  animals: {
    title: "Animals",
    folders: ["Tiere-und-Haustiere"],
    accent: "#84cc16",
  },
};

const PER_CATEGORY = 48;
const THUMB_SIZE = 480;
const FEATURED_SIZE = 1000;

async function listImages(folder) {
  const full = path.join(DRIVE, folder);
  const out = [];
  async function walk(dir, depth = 0) {
    if (depth > 2) return;
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        await walk(p, depth + 1);
      } else if (/\.(png|jpe?g|webp)$/i.test(e.name)) {
        out.push(p);
      }
    }
  }
  await walk(full);
  return out;
}

function shuffle(arr, seed) {
  // deterministic shuffle (mulberry32)
  let s = seed >>> 0;
  const rand = () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function makeBg(src, outPath, size) {
  // White background + center the (often transparent PNG) character
  const img = sharp(src).resize({ width: size, height: size, fit: "inside", withoutEnlargement: true });
  const buffer = await img.toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: { r: 250, g: 250, b: 252, alpha: 1 } },
  })
    .composite([{ input: buffer, gravity: "center" }])
    .webp({ quality: 78 })
    .toFile(outPath);
}

async function processCategory(slug, def) {
  console.log(`\n=== ${slug} ===`);
  const outDir = path.join(OUT, slug);
  await fs.mkdir(outDir, { recursive: true });

  // collect images from all source folders
  const all = [];
  for (const folder of def.folders) {
    const files = await listImages(folder);
    all.push(...files);
  }
  console.log(`  pool: ${all.length} files`);

  const seed = slug.split("").reduce((s, c) => (s * 31 + c.charCodeAt(0)) | 0, 7);
  const picked = shuffle(all, seed).slice(0, PER_CATEGORY);

  const manifest = [];
  for (let i = 0; i < picked.length; i++) {
    const src = picked[i];
    const name = path.basename(src, path.extname(src)).replace(/[^a-zA-Z0-9]+/g, "-").slice(0, 40).toLowerCase();
    const fname = `${String(i + 1).padStart(2, "0")}-${name || "image"}.webp`;
    const featuredPath = path.join(outDir, fname);
    try {
      await makeBg(src, featuredPath, i < 6 ? FEATURED_SIZE : THUMB_SIZE);
      manifest.push({ file: fname, title: name.replace(/-/g, " ") });
      process.stdout.write(".");
    } catch (err) {
      console.error(`  failed: ${src}`, err.message);
    }
  }

  await fs.writeFile(
    path.join(outDir, "manifest.json"),
    JSON.stringify({ slug, title: def.title, accent: def.accent, count: manifest.length, images: manifest }, null, 2),
  );
  console.log(`\n  → ${manifest.length} images saved`);
  return { slug, title: def.title, accent: def.accent, count: manifest.length, cover: manifest[0]?.file };
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const overview = [];
  for (const [slug, def] of Object.entries(CATEGORIES)) {
    overview.push(await processCategory(slug, def));
  }
  await fs.writeFile(path.join(OUT, "categories.json"), JSON.stringify(overview, null, 2));
  console.log("\nDone. categories.json written.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
