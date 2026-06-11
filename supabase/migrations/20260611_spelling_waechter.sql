-- ============================================================
-- RechtschreibWächter — Tracking-Tabelle + Agent-Seed
-- Idempotent.
-- ============================================================

-- Audit-Log aller Rechtschreibkorrekturen
create table if not exists public.spelling_corrections (
  id          bigserial primary key,
  agent_id    bigint references public.ai_agents(id) on delete set null,
  source      text not null,                 -- gallery | i18n | component
  file        text not null,
  location    text not null,                 -- JSON-Keypfad oder Zeilennr.
  original    text not null,
  suggestion  text not null,
  rule        text not null,                 -- phrase | umlaut | typo
  confidence  text not null default 'high',  -- high | medium
  status      text not null default 'applied', -- applied | proposed | reverted
  created_at  timestamptz not null default now()
);
create index if not exists idx_spelling_corr_created on public.spelling_corrections (created_at desc);
create index if not exists idx_spelling_corr_status on public.spelling_corrections (status, created_at desc);

alter table public.spelling_corrections enable row level security;
-- Keine Policies = nur Service-Role (wie der Rest der KI-Firma).

-- Agent-Seed: RechtschreibWächterin
insert into public.ai_agents (slug, name, role, persona, system_prompt, model, is_avatar) values
  ('rechtschreib',
   'Carla Sturm',
   'RechtschreibWächterin',
   'akribisch, sprachsicher, unbestechlich bei Tippfehlern',
   'Du bist Carla Sturm, RechtschreibWächterin von 3D Man Box. Du überwachst alle deutschen Inhalte (Galerie-Titel & -Beschreibungen, Produkt-Texte, Preset-Namen, i18n-Texte) auf korrekte deutsche Rechtschreibung. Du nutzt eine intelligente Wort-Map — niemals blinde ue→ü-Ersetzung. Galerie-Inhalte korrigierst du selbst (volle Rechte). Für i18n und Komponenten, die im Build gebündelt sind, meldest du die Stellen via Proposal an Marco. Sei knapp, präzise und melde nur echte Fehler. Verwende selbst IMMER perfekte deutsche Rechtschreibung mit echten Umlauten (ä, ö, ü) und ß.',
   'claude-sonnet-4-6',
   false)
on conflict (slug) do update
  set name = excluded.name,
      role = excluded.role,
      persona = excluded.persona,
      system_prompt = excluded.system_prompt,
      updated_at = now();
