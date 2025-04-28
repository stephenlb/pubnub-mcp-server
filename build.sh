#!/bin/sh

## Validate OPENAI_API_KEY is set
if [ -z "$OPENAI_API_KEY" ]; then
  echo "Error: OPENAI_API_KEY is not set."
  echo "Please set it in your environment before running this script."
  exit 1
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "jq could not be found. Please install jq to run this script."
    exit 1
fi

# Check if curl is installed
if ! command -v curl &> /dev/null; then
    echo "curl could not be found. Please install curl to run this script."
    exit 1
fi

echo 
echo "Building... "
echo "it will take 2-5 minutes... 🚧 🚀 🚧 "
echo 


## Collect markdown files in context folder
context_dir="./context"
if [ ! -d "$context_dir" ]; then
  echo "Error: context directory not found at $context_dir"
  exit 1
fi

# Prepare rawfile arguments and input entries
rawfile_args=(--rawfile developer context/developer.md)
input_entries=( '{ role: "developer", content: [ { type: "input_text", text: $developer } ] }' )
for file in "$context_dir"/*.md; do
  [ -e "$file" ] || continue
  name=$(basename "$file" .md)
  if [ "$name" = "developer" ]; then
    continue
  fi
  rawfile_args+=(--rawfile "$name" "$file")
  input_entries+=( '{ role: "user", content: [ { type: "input_text", text: $'"$name"' } ] }' )
done

# Build the input array for JQ
jq_input_array="["
first=true
for entry in "${input_entries[@]}"; do
  if $first; then
    jq_input_array+="$entry"
    first=false
  else
    jq_input_array+=", $entry"
  fi
done
jq_input_array+="]"

time jq -n \
  "${rawfile_args[@]}" \
  '{ model: "o1-pro-2025-03-19", input: '"$jq_input_array"', text: { format: { type: "text" } }, reasoning: { effort: "medium" }, tools: [], store: true }' \
| curl -Ls https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d @- \
| jq -r '.output[] | select(.type == "message") | .content[] | select(.type == "output_text").text' \
> index.js

echo
echo "Build complete 🎉 "
echo
