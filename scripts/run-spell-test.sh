#!/usr/bin/env bash
# Transpiliert die Wort-Map nach ESM und führt den Test aus.
set -euo pipefail
cd "$(dirname "$0")/.."

TMP=.tmp-spelltest
rm -rf "$TMP"
mkdir -p "$TMP"

# spell-map.ts ist importfrei → standalone transpilierbar.
npx --yes tsc src/lib/ai-firma/spell-map.ts \
  --target es2022 --module es2022 --moduleResolution bundler \
  --skipLibCheck --outDir "$TMP"

cp scripts/test-spell-map.mjs "$TMP/test.mjs"
node "$TMP/test.mjs"
rc=$?
rm -rf "$TMP"
exit $rc
