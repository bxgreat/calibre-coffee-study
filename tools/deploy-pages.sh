#!/usr/bin/env bash
# Perbarui situs di GitHub Pages: bangun dist/ lalu dorong ke cabang gh-pages repo ini.
# Pakai (Git Bash): bash tools/deploy-pages.sh
set -euo pipefail
cd "$(dirname "$0")/.."
REPO_URL="$(git remote get-url origin)"
node tools/build-static.js
cd dist
rm -rf .git
git init -q -b gh-pages
git add -A
git -c user.name="$(git config user.name)" -c user.email="$(git config user.email)" commit -q -m "Deploy situs statis"
git push -q --force "$REPO_URL" gh-pages:gh-pages
echo "Selesai. Situs diperbarui dalam sekitar satu menit."
