#!/bin/bash
# Download all Unsplash images used in the project to frontend/public/images/
# Usage: bash scripts/download_images.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
MAPPING="$PROJECT_DIR/frontend/public/images/image-mapping.json"
OUTPUT_DIR="$PROJECT_DIR/frontend/public/images"

if [ ! -f "$MAPPING" ]; then
    echo "❌ Mapping file not found: $MAPPING"
    echo "   Run 'python scripts/generate_mapping.py' first."
    exit 1
fi

mkdir -p "$OUTPUT_DIR"

TOTAL=$(python3 -c "import json; print(len(json.load(open('$MAPPING'))))")
COUNT=0

echo "📥 Downloading $TOTAL images to $OUTPUT_DIR ..."
echo ""

for URL in $(python3 -c "
import json
mapping = json.load(open('$MAPPING'))
for url, local_path in mapping.items():
    print(url)
"); do
    LOCAL_FILE="$OUTPUT_DIR/$(basename "$(python3 -c "import json, sys; m=json.load(open('$MAPPING')); print(m[sys.argv[1]].lstrip('/images/'))" "$URL")")"

    if [ -f "$LOCAL_FILE" ] && [ -s "$LOCAL_FILE" ]; then
        echo "  [SKIP] $(basename "$LOCAL_FILE") — déjà téléchargé"
        continue
    fi

    COUNT=$((COUNT + 1))
    echo "  [$COUNT/$TOTAL] Téléchargement de $(basename "$LOCAL_FILE") ..."

    # Download with user agent to avoid Unsplash blocking
    curl -sL -o "$LOCAL_FILE" \
        -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36" \
        "$URL" || {
        echo "  ⚠️  Échec pour $URL, continuation..."
        continue
    }

    # Small delay to avoid rate limiting
    sleep 0.5
done

echo ""
echo "✅ Téléchargement terminé."
echo "   Vérifie : ls -la $OUTPUT_DIR | wc -l"
