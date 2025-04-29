#!/usr/bin/env node
// mcp-pubnub-server.mjs
//
// A PubNub MCP server using stdio transport, built with the @modelcontextprotocol/sdk.
// Fetches PubNub SDK docs from specific URLs, converts HTML to Markdown, and serves
// PubNub Functions content from a local static file.
//
// Usage:
//   1) npm install @modelcontextprotocol/sdk node-fetch turndown
//   2) Make this script executable (chmod +x mcp-pubnub-server.mjs)
//   3) Run via: ./mcp-pubnub-server.mjs
//
// This server prints MCP messages to stdout and reads requests from stdin.
// Configure Cursor or other MCP-based clients to launch this script.
//
// ---------------------------------------------------------------------------

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import TurndownService from "turndown";
import fetch from "node-fetch";
import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an MCP server
const server = new McpServer({
  name: "pubnub-mcp-server",
  version: "1.0.0",
});

// Define a tool for fetching PubNub SDK documentation
// and converting the HTML response to Markdown.
const docsUrls = {
  javascript: "https://www.pubnub.com/docs/sdks/javascript",
  python: "https://www.pubnub.com/docs/sdks/python",
  java: "https://www.pubnub.com/docs/sdks/java",
};

server.tool(
  "fetch-pubnub-docs",
  {
    sdk: z.enum(["javascript", "python", "java"]),
  },
  async ({ sdk }) => {
    const url = docsUrls[sdk];
    const html = await fetch(url).then((res) => res.text());
    const turndown = new TurndownService();
    const markdown = turndown.turndown(html);

    return {
      content: [
        {
          type: "text",
          text: markdown,
        },
      ],
    };
  }
);

// Add a PubNub Functions resource from a static file.
// Absolute path: path.join(__dirname, 'resources', 'pubnub_functions.md')
server.resource(
  "pubnub-functions",
  "pubnub-functions://docs",
  async (uri) => {
    const filePath = path.join(__dirname, "resources", "pubnub_functions.md");
    const content = await fs.readFile(filePath, "utf-8");
    return {
      contents: [
        {
          uri: uri.href,
          text: content,
        },
      ],
    };
  }
);

// Start receiving MCP messages on stdin and sending responses to stdout
const transport = new StdioServerTransport();
await server.connect(transport);
