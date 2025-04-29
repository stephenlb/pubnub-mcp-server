#!/usr/bin/env node

// -------------------------
// PubNub MCP Server via stdio
// -------------------------
//
// 1. Uses @modelcontextprotocol/sdk to implement an MCP stdio server.
// 2. Provides a "fetchPubNubDocs" tool that fetches PubNub SDK documentation
//    from known URLs, removes <script> and <style> tags,
//    and converts the cleaned HTML to Markdown via turndown.
// 3. Exposes a "pubnub-functions" resource that loads static content
//    from an absolute path (pubnub_functions.md).
//
// To run:
//   npm install @modelcontextprotocol/sdk node-fetch turndown
//   chmod +x ./pubnubServer.js
//   ./pubnubServer.js
//
// Then configure your .cursor/mcp.json to point to this server via stdio.
//
// Example .cursor/mcp.json:
// {
//   "mcpServers": {
//     "pubnubServer": {
//       "command": "node",
//       "args": ["/absolute/path/to/pubnubServer.js"]
//     }
//   }
// }

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import TurndownService from 'turndown';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// Resolve __dirname in ES modules:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an MCP server
const server = new McpServer({
  name: 'PubNub MCP',
  version: '1.0.0'
});

// ---------------------------------------------------------------------
// 1) Add a tool to fetch PubNub SDK documentation from the three URLs
// ---------------------------------------------------------------------

const pubnubDocUrls = {
  javascript: 'https://www.pubnub.com/docs/sdks/javascript',
  python: 'https://www.pubnub.com/docs/sdks/python',
  java: 'https://www.pubnub.com/docs/sdks/java'
};

server.tool(
  'fetchPubNubDocs',
  {
    docType: z.enum(['javascript', 'python', 'java'])
  },
  async ({ docType }) => {
    const url = pubnubDocUrls[docType];
    if (!url) {
      return {
        content: [
          {
            type: 'text',
            text: `Invalid docType provided: ${docType}`
          }
        ],
        isError: true
      };
    }

    try {
      // Fetch the page HTML
      const response = await fetch(url);
      if (!response.ok) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching PubNub docs for ${docType}: ${response.status} ${response.statusText}`
            }
          ],
          isError: true
        };
      }

      // Read the text
      let html = await response.text();

      // Remove <script> and <style> tags
      // A lightweight approach using regex (caveat: simplistic for advanced cases)
      // Or use a DOM approach. For simplicity here:
      html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
      html = html.replace(/<style[\s\S]*?<\/style>/gi, '');

      // Convert HTML to Markdown using turndown
      const turndownService = new TurndownService();
      const markdown = turndownService.turndown(html);

      return {
        content: [
          {
            type: 'text',
            text: markdown
          }
        ]
      };
    } catch (err) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching or processing PubNub docs: ${String(err)}`
          }
        ],
        isError: true
      };
    }
  }
);

// ---------------------------------------------------------------------
// 2) Add a resource for PubNub Functions reference from a static file
// ---------------------------------------------------------------------

server.resource(
  'pubnub-functions',
  'pubnub-functions://documentation',
  async (uri) => {
    try {
      const fnPath = path.join(__dirname, 'resources', 'pubnub_functions.md');
      const content = await fs.promises.readFile(fnPath, 'utf8');

      return {
        contents: [
          {
            uri: uri.href,
            text: content
          }
        ]
      };
    } catch (err) {
      return {
        contents: [
          {
            uri: uri.href,
            text: `Error reading pubnub_functions.md: ${String(err)}`
          }
        ]
      };
    }
  }
);

// ---------------------------------------------------------
// Start the server on stdin/stdout transport
// ---------------------------------------------------------
const transport = new StdioServerTransport();
await server.connect(transport);
