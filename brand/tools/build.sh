#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
python3 build.py
node render.mjs ../jobs.json
rm ../jobs.json
magick ../icons/favicon-16.png ../icons/favicon-32.png ../icons/favicon-48.png ../icons/favicon.ico
