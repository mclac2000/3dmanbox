import { promises as fs } from "node:fs";
import path from "node:path";

export type GalleryImage = { file: string; title: string };
export type CategoryManifest = {
  slug: string;
  title: string;
  accent: string;
  count: number;
  images: GalleryImage[];
};
export type CategoryOverview = {
  slug: string;
  title: string;
  accent: string;
  count: number;
  cover: string;
};

const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");

let _overview: CategoryOverview[] | null = null;
const _category: Map<string, CategoryManifest> = new Map();

export async function getCategories(): Promise<CategoryOverview[]> {
  if (_overview) return _overview;
  const raw = await fs.readFile(path.join(GALLERY_DIR, "categories.json"), "utf8");
  _overview = JSON.parse(raw) as CategoryOverview[];
  return _overview;
}

export async function getCategory(slug: string): Promise<CategoryManifest | null> {
  const cached = _category.get(slug);
  if (cached) return cached;
  try {
    const raw = await fs.readFile(path.join(GALLERY_DIR, slug, "manifest.json"), "utf8");
    const parsed = JSON.parse(raw) as CategoryManifest;
    _category.set(slug, parsed);
    return parsed;
  } catch {
    return null;
  }
}

export function imagePath(slug: string, file: string): string {
  return `/gallery/${slug}/${file}`;
}
