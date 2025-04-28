#!/usr/bin/env node

/* 
PubNub MCP Server (via stdio)

This script provides:
1) An MCP resource fetcher for PubNub SDK pages:
   - pubnub://docs/javascript -> https://www.pubnub.com/docs/sdks/javascript
   - pubnub://docs/python    -> https://www.pubnub.com/docs/sdks/python
   - pubnub://docs/java      -> https://www.pubnub.com/docs/sdks/java
   It will fetch the HTML pages, convert them to Markdown, and return them.

2) A PubNub Functions resource:
   - pubnub://functions -> contents of local file "resources/pubnub_functions.md"

Outputs initial MCP resource list on startup, then processes any "read_resource" requests from stdin.
*/

import fs from 'fs';
import path from 'path';

// For Node 18+ which has built-in fetch, no extra package needed.
// If using an older Node version, install e.g. "node-fetch" and import instead.
import TurndownService from 'turndown';

const turndownService = new TurndownService();

const RESOURCE_PREFIX = 'pubnub://';

const resourceIndex = [
  {
    uri: 'pubnub://docs/javascript',
    description: 'PubNub JavaScript SDK Docs'
  },
  {
    uri: 'pubnub://docs/python',
    description: 'PubNub Python SDK Docs'
  },
  {
    uri: 'pubnub://docs/java',
    description: 'PubNub Java SDK Docs'
  },
  {
    uri: 'pubnub://functions',
    description: 'PubNub Functions Documentation'
  }
];

async function fetchAndConvertToMarkdown(url) {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Fetch failed: ${resp.status} ${resp.statusText}`);
  }
  const html = await resp.text();
  const md = turndownService.turndown(html);
  return md;
}

function readPubNubFunctionsMarkdown() {
  const filePath = path.join('resources', 'pubnub_functions.md');
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

// Immediately output our "list of resources" once on startup
console.log(JSON.stringify({
  type: "resource_list",
  resources: resourceIndex
}));

// Listen for requests from MCP client on stdin
process.stdin.on("data", async (data) => {
  try {
    const request = JSON.parse(data.toString());

    // The only request we handle here is "read_resource"
    if (request.type === "read_resource" && request.uri?.startsWith(RESOURCE_PREFIX)) {
      // We'll produce a "resource" response with the text contents
      let text = null;

      switch (request.uri) {
        case 'pubnub://docs/javascript':
          text = await fetchAndConvertToMarkdown('https://www.pubnub.com/docs/sdks/javascript');
          break;
        case 'pubnub://docs/python':
          text = await fetchAndConvertToMarkdown('https://www.pubnub.com/docs/sdks/python');
          break;
        case 'pubnub://docs/java':
          text = await fetchAndConvertToMarkdown('https://www.pubnub.com/docs/sdks/java');
          break;
        case 'pubnub://functions':
          text = readPubNubFunctionsMarkdown();
          break;
        default:
          // If the URI is unknown, return an error in-line
          console.log(JSON.stringify({
            isError: true,
            content: `Unknown resource URI: ${request.uri}`
          }));
          return;
      }

      // Resource read success: respond with a "resource" payload
      // Provide the single content object (MCP requires an array of contents).
      // "mime" is optional, so we just return text data.
      console.log(JSON.stringify({
        type: "resource",
        uri: request.uri,
        contents: [
          {
            uri: request.uri,
            text
          }
        ]
      }));
    }
    else if (request.type === "list_resources") {
      // Return our resource list
      console.log(JSON.stringify({
        type: "resource_list",
        resources: resourceIndex
      }));
    }
    else if (request.type === "list_tools") {
      // No tools in this server; return empty
      console.log(JSON.stringify({
        type: "tool_list",
        tools: []
      }));
    }
    else if (request.type === "list_prompts") {
      // No prompts in this server; return empty
      console.log(JSON.stringify({
        type: "prompt_list",
        prompts: []
      }));
    }
    else {
      // We don't handle any other request types in this example
      console.log(JSON.stringify({
        isError: true,
        content: `Unsupported request type: ${request.type}`
      }));
    }
  } catch (err) {
    console.log(JSON.stringify({
      isError: true,
      content: `Server error: ${String(err)}`
    }));
  }
});
