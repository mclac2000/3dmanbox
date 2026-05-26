# 3D Man Box

Premium 3D-Charaktere für Business-Visuals.

Eine Next.js 16 App, die zwei Domains bedient:

- **[3dmanbox.com](https://3dmanbox.com)** — Long-Form Sales-Landing (Master Box 197€)
- **[3dman.club](https://3dman.club)** — Mitglieder-Hub mit Galerie, KI-Studio, Pricing

## Lokal entwickeln

```bash
npm install
cp .env.example .env.local
npm run dev
# → http://localhost:3000
```

Hybrid-Routing per Host (für lokales Testen beider Domains):

```
# /etc/hosts
127.0.0.1 box.localhost
127.0.0.1 club.localhost
```

→ `http://box.localhost:3000` und `http://club.localhost:3000`.

## Stripe vorbereiten

1. Produkte in Stripe Dashboard anlegen (siehe `.env.example` für SKU-Liste).
2. Webhook → `https://3dmanbox.com/api/stripe/webhook`.
3. Events abonnieren: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`.

## Supabase

`supabase/schema.sql` im SQL-Editor ausführen — legt Tabellen + RLS-Policies an.

## Deployment

Push auf `main` → GitHub Actions → SSH zu pact-prod-01 → PM2 Reload.

Mehr in `.claude/CLAUDE.md`.

## Lizenz

Proprietär. Alle Rechte vorbehalten.
