#!/usr/bin/env bash
# Wird auf dem Server via SSH von GitHub Actions ausgeführt.
set -euo pipefail

BASE=/srv/3dmanbox
RELEASES=$BASE/releases
SHARED=$BASE/shared
CURRENT=$BASE/current
TS=$(date +%Y%m%d_%H%M%S)
RELEASE=$RELEASES/$TS

mkdir -p "$RELEASES"
git clone --depth 1 https://github.com/mclac2000/3dmanbox.git "$RELEASE"

cd "$RELEASE"
ln -sf "$SHARED/.env" ".env.production.local"

npm ci
npm run build

ln -sfn "$RELEASE" "$CURRENT"

sudo systemctl restart 3dmanbox

# Keep last 5 releases
cd "$RELEASES"
ls -1t | tail -n +6 | xargs -r rm -rf

echo "✓ Released $TS"
