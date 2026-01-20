#!/usr/bin/env bash
# SPDX-License-Identifier: Apache-2.0
set -euo pipefail

NAME="${1:?Usage: $0 <diagram-name>}"

case "$(uname -s)" in
  Darwin) CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ;;
  *)      CHROME=$(command -v google-chrome chromium-browser chromium 2>/dev/null | head -1) ;;
esac

PUPPETEER_EXECUTABLE_PATH="$CHROME" mmdc \
  -i "src/assets/diagrams/${NAME}.mmd" \
  -o "src/assets/images/${NAME}.png" \
  -b transparent -s 1.5 -t neutral
