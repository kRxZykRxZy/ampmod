#!/bin/bash

set -euo pipefail
cd "$(dirname "$0")"
cd ..

echo "Updating source and building"
git checkout master
git pull
git submodule update
npm ci
pnpm run fetch
pnpm run webpack:prod

echo ""
echo "Packaging for MAS"
rm -rf dist/mas-universal
npx electron-builder --mac mas --universal --config.extraMetadata.tw_dist=prod-mas

# TODO: look into Transporter CLI
echo ""
echo "1. Open Transporter.app - https://apps.apple.com/us/app/transporter/id1450874784"
echo "2. Upload .pkg file in dist/mas-universal"
