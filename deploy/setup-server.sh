#!/usr/bin/env bash
# Server-Setup für 3D Man Box auf pact-prod-01
# Einmalig ausführen — danach Auto-Deploy via GitHub Actions
set -euo pipefail

REPO_URL="https://github.com/mclac2000/3dmanbox.git"
BASE=/srv/3dmanbox
RELEASES=$BASE/releases
SHARED=$BASE/shared
CURRENT=$BASE/current

echo "==> Verzeichnisse anlegen"
sudo mkdir -p "$BASE" "$RELEASES" "$SHARED" /var/log/3dmanbox
sudo chown -R deploy:deploy "$BASE" /var/log/3dmanbox

echo "==> .env-Vorlage anlegen (deploy bearbeitet danach)"
if [[ ! -f $SHARED/.env ]]; then
  sudo -u deploy tee "$SHARED/.env" >/dev/null <<'EOF'
NODE_ENV=production
PORT=3030
APP_URL_BOX=https://3dmanbox.com
APP_URL_CLUB=https://3dman.club

# Stripe — wird nach Erstellung der Produkte gesetzt
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_MASTER_BOX=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=
EMAIL_FROM=3D Man Box <hello@3dmanbox.com>
EOF
fi

echo "==> systemd-Unit installieren"
sudo cp deploy/3dmanbox.service /etc/systemd/system/3dmanbox.service
sudo systemctl daemon-reload
sudo systemctl enable 3dmanbox.service

echo "==> nginx vhost installieren"
sudo cp deploy/nginx-3dmanbox.conf /etc/nginx/sites-available/3dmanbox
sudo ln -sf /etc/nginx/sites-available/3dmanbox /etc/nginx/sites-enabled/3dmanbox

echo "==> Certbot certs anlegen (falls noch nicht vorhanden)"
if ! sudo test -f /etc/letsencrypt/live/3dmanbox.com/fullchain.pem; then
  sudo certbot certonly --webroot -w /var/www/certbot \
    -d 3dmanbox.com -d www.3dmanbox.com \
    --agree-tos --no-eff-email -m hello@3dmanbox.com --non-interactive
fi
if ! sudo test -f /etc/letsencrypt/live/3dman.club/fullchain.pem; then
  sudo certbot certonly --webroot -w /var/www/certbot \
    -d 3dman.club -d www.3dman.club \
    --agree-tos --no-eff-email -m hello@3dman.club --non-interactive
fi

sudo nginx -t && sudo systemctl reload nginx

echo "==> Erste Release ziehen"
TS=$(date +%Y%m%d_%H%M%S)
RELEASE=$RELEASES/$TS
sudo -u deploy git clone --depth 1 "$REPO_URL" "$RELEASE"
sudo -u deploy bash -c "cd $RELEASE && npm ci && npm run build"
sudo -u deploy ln -sfn "$RELEASE" "$CURRENT"

sudo systemctl start 3dmanbox
echo "==> Fertig. Status:"
sudo systemctl status 3dmanbox --no-pager | head -10
