"use client";

import Image from "next/image";
import { useState } from "react";

type Img = { file: string; title: string };

export function Masonry({ slug, images }: { slug: string; images: Img[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const current = openIdx !== null ? images[openIdx] : null;

  return (
    <>
      <div className="col-gallery">
        {images.map((img, i) => (
          <button
            key={img.file}
            type="button"
            onClick={() => setOpenIdx(i)}
            className="group relative w-full overflow-hidden rounded-xl bg-zinc-50 ring-1 ring-zinc-100 transition hover:ring-zinc-300"
            aria-label={img.title}
          >
            <Image
              src={`/gallery/${slug}/${img.file}`}
              alt={img.title}
              width={480}
              height={480}
              sizes="(min-width: 1280px) 220px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="h-auto w-full transition duration-300 group-hover:scale-[1.03]"
              loading={i < 8 ? "eager" : "lazy"}
            />
          </button>
        ))}
      </div>

      {current && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/85 p-4 backdrop-blur-sm"
          onClick={() => setOpenIdx(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIdx(null);
            }}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          {openIdx !== null && openIdx > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIdx(openIdx - 1);
              }}
              className="absolute left-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Previous"
            >
              ←
            </button>
          )}
          {openIdx !== null && openIdx < images.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIdx(openIdx + 1);
              }}
              className="absolute right-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Next"
            >
              →
            </button>
          )}
          <Image
            src={`/gallery/${slug}/${current.file}`}
            alt={current.title}
            width={1000}
            height={1000}
            className="max-h-[85vh] w-auto object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
