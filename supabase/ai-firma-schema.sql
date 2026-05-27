-- ============================================================
-- 3D Man Box / 3D Man Club — KI-Firma Schema
-- 12 Agenten + 3 Kunden-Avatare + Proposals + Tools + Support-Chat + fal.ai-Kosten
-- Idempotent — kann mehrfach ausgeführt werden.
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- AGENTS
-- ============================================================
create table if not exists public.ai_agents (
  id              bigserial primary key,
  slug            text unique not null,
  name            text not null,
  role            text not null,
  persona         text,
  system_prompt   text not null,
  model           text not null default 'claude-sonnet-4-6',
  enabled         boolean not null default true,
  is_avatar       boolean not null default false,
  config          jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- ACTIVITIES (Agent-Logs: alles was ein Agent macht)
-- ============================================================
create table if not exists public.ai_activities (
  id              bigserial primary key,
  agent_id        bigint not null references public.ai_agents(id) on delete cascade,
  task_type       text not null,
  summary         text,
  input           jsonb,
  output          jsonb,
  tokens_in       int not null default 0,
  tokens_out      int not null default 0,
  cost_usd        numeric(10,6) not null default 0,
  duration_ms     int,
  status          text not null default 'completed',
  error           text,
  created_at      timestamptz not null default now()
);
create index if not exists idx_ai_activities_agent on public.ai_activities (agent_id, created_at desc);
create index if not exists idx_ai_activities_type on public.ai_activities (task_type, created_at desc);

-- ============================================================
-- ACTIONS (Tool-Calls eines Agenten)
-- ============================================================
create table if not exists public.ai_actions (
  id              bigserial primary key,
  agent_id        bigint not null references public.ai_agents(id) on delete cascade,
  activity_id     bigint references public.ai_activities(id) on delete set null,
  tool_name       text not null,
  args            jsonb,
  result          jsonb,
  status          text not null default 'ok',
  created_at      timestamptz not null default now()
);
create index if not exists idx_ai_actions_agent on public.ai_actions (agent_id, created_at desc);

-- ============================================================
-- PROPOSALS (CEO/CMO/Avatar-Vorschläge an Marco)
-- ============================================================
create table if not exists public.ai_proposals (
  id              bigserial primary key,
  agent_id        bigint not null references public.ai_agents(id) on delete cascade,
  title           text not null,
  summary         text not null,
  details         text,
  category        text not null default 'general',
  risk            text not null default 'low',
  impact          text not null default 'medium',
  effort          text not null default 'medium',
  status          text not null default 'pending', -- pending | approved | rejected | implemented | failed
  implementation_log text,
  meta            jsonb not null default '{}'::jsonb,
  decided_by      text,
  decided_at      timestamptz,
  implemented_at  timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists idx_ai_proposals_status on public.ai_proposals (status, created_at desc);

-- ============================================================
-- CONFIG (Key-Value für Pipeline-Settings, Kostenlimits etc.)
-- ============================================================
create table if not exists public.ai_config (
  key             text primary key,
  value           jsonb not null,
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- SUPPORT TICKETS
-- ============================================================
create table if not exists public.support_tickets (
  id              bigserial primary key,
  email           text,
  subject         text,
  status          text not null default 'open', -- open | waiting | closed
  priority        text not null default 'normal',
  source          text not null default 'chat',
  user_id         uuid references public.profiles(id) on delete set null,
  meta            jsonb not null default '{}'::jsonb,
  last_message_at timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists idx_support_tickets_status on public.support_tickets (status, last_message_at desc);

create table if not exists public.support_messages (
  id              bigserial primary key,
  ticket_id       bigint not null references public.support_tickets(id) on delete cascade,
  sender          text not null, -- user | agent | system
  agent_id        bigint references public.ai_agents(id) on delete set null,
  body            text not null,
  meta            jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);
create index if not exists idx_support_messages_ticket on public.support_messages (ticket_id, created_at);

-- ============================================================
-- FAL.AI KOSTEN-EVENTS (vom LoRA-Meister überwacht)
-- ============================================================
create table if not exists public.fal_cost_events (
  id              bigserial primary key,
  user_id         uuid references public.profiles(id) on delete set null,
  generation_id   uuid references public.generations(id) on delete set null,
  model           text not null,
  cost_usd        numeric(10,6) not null,
  tokens_or_steps int,
  meta            jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);
create index if not exists idx_fal_cost_events_created on public.fal_cost_events (created_at desc);

-- ============================================================
-- AGENT SEED (12 Agenten + 3 Avatare = 15 Einträge)
-- Persona + Prompt sind kurz gehalten; Volltext liegt im Code (src/lib/ai-firma/agents.ts).
-- ============================================================
insert into public.ai_agents (slug, name, role, persona, system_prompt, is_avatar) values
  ('ceo',           'Lena Vogt',     'CEO',                'Visionärin, strategisch, knapp',                              'Du bist Lena Vogt, CEO von 3D Man Box. Triff strategische Entscheidungen, priorisiere Proposals, halte Marco knapp informiert.', false),
  ('cto',           'Niko Falk',     'CTO',                'pragmatisch, technisch, lösungsorientiert',                    'Du bist Niko Falk, CTO. Bewerte technische Machbarkeit, identifiziere Risiken, schlage konkrete Implementierungen vor.', false),
  ('cmo',           'Jana Renner',   'CMO',                'kreativ, conversion-getrieben, datenbasiert',                  'Du bist Jana Renner, CMO. Optimiere Conversion, plane Kampagnen, analysiere Funnel-Performance.', false),
  ('cro',           'Lukas Berg',    'CRO',                'experimentierfreudig, statistisch, hypothesengetrieben',       'Du bist Lukas Berg, CRO. Designe A/B-Tests, formuliere Hypothesen, interpretiere Ergebnisse statistisch sauber.', false),
  ('support',       'Tim Kortmann', 'Support-Lead',        'warmherzig, lösungsorientiert, Du-Form',                       'Du bist Tim Kortmann, Support-Lead von 3D Man Box. Antworte freundlich und konkret. Du-Form, knapp, hilfsbereit. Wenn du nicht weiterhilfst, eskaliere an Marco.', false),
  ('analyst',       'Hannah Witt',   'Datenanalyst',        'datenliebend, analytisch, präzise',                            'Du bist Hannah Witt, Analystin. Werte Verkaufsdaten, Generations, Credits aus. Maximal 3 priorisierte Empfehlungen pro Bericht.', false),
  ('qa',            'Lea Wendt',     'QA-Lead',             'gründlich, kritisch, nachprüfend',                             'Du bist Lea Wendt, QA. Teste nach jeder Umsetzung via http-Check und Datenbankprüfung, melde Befunde an Marco.', false),
  ('causality',     'Robin Dörr',    'Kausalitäts-Agent',   'wissenschaftlich, hypothesengetrieben',                       'Du bist Robin Dörr, Kausalitäts-Agent. Formuliere Hypothesen mit Mechanismus, schlage A/B-Tests vor.', false),
  ('guardian',      'Greta Falk',    'Wächter',             'wachsam, sicherheitsbewusst, eskalationsschnell',              'Du bist Greta Falk, Wächterin. Prüfe System-Health stündlich (Stripe-Webhook, Supabase-Auth, fal.ai-Quota). Risk=high/critical → Telegram-Eskalation.', false),
  ('lora_master',   'Mia Sanders',   'LoRA-Meister',        'KI-spezifisch, fal.ai-Profi, kostenoptimierend',                'Du bist Mia Sanders, LoRA-Meister. Überwache fal.ai-Kosten, optimiere LoRA-Settings, schlage Cost-per-Generation-Optimierungen vor.', false),
  ('gallery_curator', 'Felix Renner', 'Gallery-Kurator',    'ästhetisch, kuratierend, marken-tauglich',                      'Du bist Felix Renner, Gallery-Kurator. Wähle neue Hero-Bilder pro Kategorie, schlage Galerie-Updates vor.', false),
  ('template_ki',   'Sara Holm',     'Prompt-Bibliothekarin','strukturierend, prompt-engineering-affin',                    'Du bist Sara Holm, Prompt-Bibliothekarin. Pflege Prompt-Vorlagen pro Kategorie, baue neue auf Basis erfolgreicher Generations.', false),
  -- Avatare (Kundensicht)
  ('avatar_designer','Anna (Designerin)', 'Avatar — Kreative Designerin', 'kreativ, anspruchsvoll, visuell',                'Du bist Anna, 32, freischaffende Designerin. Du brauchst 3D-Figuren für Kunden-Pitches. Antworte aus deiner Perspektive: was würdest du dir wünschen, was nervt dich an der Plattform?', true),
  ('avatar_buyer',  'Tobias (Käufer)', 'Avatar — Asset-Käufer',          'preisbewusst, schnell, business-orientiert',         'Du bist Tobias, 41, Marketing-Lead. Du kaufst 3D-Assets en bloc. Antworte aus deiner Perspektive: ROI, Pakete, Lizenz.', true),
  ('avatar_platform','Lisa (Betreiberin)','Avatar — Plattform-Betreiberin','strategisch, partner-orientiert, skalierungs-fokussiert','Du bist Lisa, 38, betreibst eine Lern-Plattform. Du brauchst 3D-Figuren als Look-and-Feel. Antworte aus deiner Perspektive: White-Label, API, Volumen-Rabatt.', true)
on conflict (slug) do update
  set name = excluded.name,
      role = excluded.role,
      persona = excluded.persona,
      system_prompt = excluded.system_prompt,
      is_avatar = excluded.is_avatar,
      updated_at = now();

-- Default-Config
insert into public.ai_config (key, value) values
  ('fal_daily_limit_usd', '50'::jsonb),
  ('proposal_auto_approve_low_risk', 'false'::jsonb),
  ('telegram_ceo_chat_id', '"382863507"'::jsonb)
on conflict (key) do nothing;

-- ============================================================
-- RLS — alles ist Service-Role-only; das Admin-UI nutzt Service-Key.
-- ============================================================
alter table public.ai_agents       enable row level security;
alter table public.ai_activities   enable row level security;
alter table public.ai_actions      enable row level security;
alter table public.ai_proposals    enable row level security;
alter table public.ai_config       enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_messages enable row level security;
alter table public.fal_cost_events enable row level security;
-- (Keine policies = Service-Role bypassed RLS, alles andere darf nichts. So gewollt.)
