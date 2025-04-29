#!/usr/bin/env node

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fetch from "node-fetch";
import TurndownService from "turndown";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Needed in ES modules to emulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create MCP server
const server = new McpServer({
  name: "pubnub_mcp_server",
  version: "1.0.0"
});

// ------------------------------------------------------------------
// Tool: fetch_pubnub_docs
// Fetches PubNub SDK docs from the specified URLs,
// removes <script>/<style> tags, and converts HTML to Markdown.
// ------------------------------------------------------------------
server.tool(
  "fetch_pubnub_docs",
  {},
  async () => {
    const urls = [
      { name: "JavaScript SDK", url: "https://www.pubnub.com/docs/sdks/javascript" },
      { name: "Python SDK", url: "https://www.pubnub.com/docs/sdks/python" },
      { name: "Java SDK", url: "https://www.pubnub.com/docs/sdks/java" }
    ];

    const turndown = new TurndownService();
    let combinedMarkdown = "";

    for (const { name, url } of urls) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          combinedMarkdown += `\n\n## ${name}\n\nError fetching: ${response.status}\n`;
          continue;
        }
        let html = await response.text();

        // Remove <script> and <style> tags
        html = html
          .replace(/<script[^>]*>([\S\s]*?)<\/script>/gi, "")
          .replace(/<style[^>]*>([\S\s]*?)<\/style>/gi, "");

        const markdown = turndown.turndown(html);
        combinedMarkdown += `\n\n## ${name}\n\n${markdown}\n`;
      } catch (error) {
        combinedMarkdown += `\n\n## ${name}\n\nError: ${error.message}\n`;
      }
    }

    return {
      content: [{
        type: "text",
        text: combinedMarkdown.trim()
      }]
    };
  }
);

// ------------------------------------------------------------------
// Resource: pubnub_functions
// Loads static PubNub Functions content from a local file.
// ------------------------------------------------------------------
server.resource(
  "pubnub_functions",
  "resource://pubnub_functions",
  async (uri) => {
    const filePath = path.join(__dirname, "resources", "pubnub_functions.md");
    const text = fs.readFileSync(filePath, "utf8");
    return {
      contents: [
        {
          uri: uri.href,
          text
        }
      ]
    };
  }
);

// ------------------------------------------------------------------
// Prompt: say_hello
// Simple prompt that greets the user by name.
// ------------------------------------------------------------------
server.prompt(
  "say_hello",
  { name: z.string().optional() },
  async ({ name }) => {
    const userName = name || "friend";
    return {
      messages: [
        {
          role: "system",
          content: {
            type: "text",
            text: `Hello, ${userName}! How can I help you today?`
          }
        }
      ]
    };
  }
);

// ------------------------------------------------------------------
// Start listening on stdio
// ------------------------------------------------------------------
const transport = new StdioServerTransport();
await server.connect(transport);
