#!/usr/bin/env node
/* eslint-disable no-console */

import fs from "fs";
import fetch from "node-fetch";
import TurndownService from "turndown";
import { z } from "zod";
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

/**
 * A PubNub MCP server using stdio transport.
 * 
 * - Fetches PubNub SDK documentation from official URLs and converts HTML -> Markdown with turndown.
 * - Exposes a static file (pubnub_functions.md) as a resource for "PubNub Functions" reference.
 */

// Prepare turndown for HTML->Markdown
const turndownService = new TurndownService();

// Map doc choices to actual URLs
const docUrls = {
  javascript: "https://www.pubnub.com/docs/sdks/javascript",
  python: "https://www.pubnub.com/docs/sdks/python",
  java: "https://www.pubnub.com/docs/sdks/java"
};

// Create an MCP server
const server = new McpServer({
  name: "PubNub-MCP-Server",
  version: "1.0.0"
});

/**
 * Resource: PubNub Functions (static local file).
 * 
 * For demonstration, we read from a markdown file found at "resources/pubnub_functions.md"
 */
const pubnubFunctionsContent = fs.readFileSync("resources/pubnub_functions.md", "utf8");
server.resource(
  "pubnub-functions",
  new ResourceTemplate("pubnub://functions", { list: undefined }),
  async (uri) => ({
    contents: [{
      uri: uri.href,
      text: pubnubFunctionsContent
    }]
  })
);

/**
 * Tool: Fetch PubNub Documentation
 * 
 * Input: { sdk: "javascript" | "python" | "java" }
 *  - We'll fetch the HTML from official docs, convert to Markdown, and return.
 */
server.tool(
  "fetch-pubnub-docs",
  { sdk: z.enum(["javascript", "python", "java"]) },
  async ({ sdk }) => {
    const url = docUrls[sdk];
    if (!url) {
      return {
        content: [
          { type: "text", text: `Invalid SDK type provided: ${sdk}.` }
        ],
        isError: true
      };
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        return {
          content: [
            { type: "text", text: `Error fetching PubNub docs from: ${url}` }
          ],
          isError: true
        };
      }
      const html = await response.text();
      const markdown = turndownService.turndown(html);

      return {
        content: [
          { type: "text", text: markdown }
        ]
      };
    } catch (error) {
      return {
        content: [
          { type: "text", text: `Failed to fetch PubNub docs. Error: ${error}` }
        ],
        isError: true
      };
    }
  }
);

// Start the MCP server over stdio:
const transport = new StdioServerTransport();
server.connect(transport).catch((err) => {
  console.error("Failed to start PubNub MCP server:", err);
  process.exit(1);
});
