# 3D Man Box — Projekt-spezifische Anweisungen

## Was ist das?
Next.js 16 (App Router) Plattform für zwei Marken auf einer Codebase:
- **3dmanbox.com** — Sales-Landing (Long-Form, 197€ Master Box)
- **3dman.club** — Brand-Hub mit Galerie, KI-Generator (Phase 2), Pricing, Mitglieder

Hybrid-Routing via `src/proxy.ts` (Next.js 16 ersetzt middleware mit proxy).
- `3dmanbox.com/*` → `/box/*`
- `3dman.club/*` → `/club/*`

## Tech Stack
- Next.js 16.2 + App Router + TypeScript
- Tailwind CSS v4 (Inline-Theme in `globals.css`)
- Supabase (Auth + PostgreSQL) — Magic-Link-Auth
- Stripe Checkout + Subscriptions + Tax + Webhook
- Resend für Transaktions-Mails
- Hetzner pact-prod-01 Deployment (PM2 + Nginx)

## Wichtige Regeln
- **KEIN Video-Autoplay** — absolute Regel
- Mobile-First, Lighthouse ≥ 95
- Deutsche Texte, Du-Form
- Premium-Look: Navy + Gold + Weiß
- Bei UI-Änderungen: Pencil-Design vor Code-Änderung erwägen (siehe `~/development/CLAUDE.md`)

## Lokal entwickeln
```bash
npm run dev           # localhost:3000 (Club-Routes via fallback)
# Hybrid testen mit Hosts-Eintrag:
# 127.0.0.1 box.localhost club.localhost
# → http://box.localhost:3000 + http://club.localhost:3000
```

## Stripe-Setup (vor Live-Schaltung)
1. Stripe Dashboard → Produkte anlegen (siehe `.env.example` für SKU-Liste)
2. Webhook-Endpunkt einrichten: `https://3dmanbox.com/api/stripe/webhook`
3. Events abonnieren: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`
4. `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*` setzen
5. Tax: Stripe Tax aktivieren für DE/EU

## Supabase-Setup
1. Neues Projekt erstellen (Region: Frankfurt)
2. `supabase/schema.sql` im SQL Editor ausführen
3. Auth Settings → E-Mail-Templates auf Deutsch übersetzen
4. Magic-Link Redirect-URL: `https://3dman.club/dashboard`
5. ENV-Variablen setzen: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

## Deployment (Hetzner pact-prod-01)
- Server: `204.168.189.74` (ssh `pact-prod`)
- Pfad: `/srv/3dmanbox/`
- Service: PM2 `3dmanbox` (Port 3030)
- Nginx vHosts: `3dmanbox.com` + `3dman.club` → `proxy_pass http://localhost:3030`
- SSL: certbot (Let's Encrypt) für beide Domains
- Auto-Deploy: GitHub Actions → SSH → `git pull && npm ci --omit=dev && npm run build && pm2 reload 3dmanbox`

## DNS (Cloudflare)
- A-Record für `3dmanbox.com` + `www` → `204.168.189.74`
- A-Record für `3dman.club` + `www` → `204.168.189.74`
- Proxy-Status: 🟧 Proxied (DDoS-Schutz, CDN)

## Phase 2 (später)
- KI-Generator mit fal.ai LoRA (`/dashboard/generator`)
- LoRA-Training Endpoint
- Background-Remover
- Affiliate-System via Rewardful
- Mehrsprachigkeit (DE/EN)

## Verzeichnisstruktur
```
src/
  app/
    box/           → 3dmanbox.com Routes
    club/          → 3dman.club Routes
    api/stripe/    → Checkout + Webhook
    api/auth/      → Magic Link
  components/
    box/           → Sales-Landing Sektionen
    club/          → Brand-Hub Komponenten
    shared/        → Header/Footer
    ui/            → Button, Container, Badge, Icon
  lib/             → stripe, supabase, email, site config
  proxy.ts        → Host-basierte Rewrites (Next.js 16)
supabase/schema.sql → DB Schema + RLS-Policies
```
