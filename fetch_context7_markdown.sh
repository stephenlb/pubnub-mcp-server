#!/usr/bin/env bash

# Directory to store downloaded markdown files
DEST_DIR="./resources/languages"
mkdir -p "$DEST_DIR"

# List of languages
languages=(
  "javascript"
  "python"
  "java"
  "go"
  "ruby"
  "swift"
  "objective-c"
  "c-sharp"
  "php"
  "rust"
  "unity"
  "kotlin"
  "unreal-engine"
  "dart"
)

for lang in "${languages[@]}"; do
  url="https://context7.com/pubnub/${lang}/llms.txt"
  # Determine output file name; use 'unreal.md' for 'unreal-engine'
  if [[ "$lang" == "unreal-engine" ]]; then
    output="${DEST_DIR}/unreal.md"
  else
    output="${DEST_DIR}/${lang}.md"
  fi
  echo "Downloading $lang..."
  if curl -fsSL "$url" -o "$output"; then
    echo "Saved to $output"
  else
    echo "Error: Failed to download $url" >&2
  fi
done
