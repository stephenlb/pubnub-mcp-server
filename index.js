#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import TurndownService from 'turndown';
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

const turndownService = new TurndownService();

const DOC_URLS = {
  javascript: 'https://www.pubnub.com/docs/sdks/javascript',
  python: 'https://www.pubnub.com/docs/sdks/python',
  java: 'https://www.pubnub.com/docs/sdks/java'
};

const server = new McpServer({
  name: 'PubNubMcpServer',
  version: '1.0.0'
});

/**
 * Tool: fetch-pubnub-docs
 * Fetches the PubNub documentation page for 'javascript', 'python', or 'java'
 * Removes <script> and <style> tags, then converts to Markdown using turndown
 */
server.tool(
  'fetch-pubnub-docs',
  {
    doc: z.enum(['javascript', 'python', 'java'])
  },
  async ({ doc }) => {
    try {
      const url = DOC_URLS[doc];
      const response = await fetch(url);
      let html = await response.text();

      // Remove <script> and <style> tags
      html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
      html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

      // Convert to Markdown
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
            text: `Error fetching docs: ${err}`
          }
        ],
        isError: true
      };
    }
  }
);

/**
 * Resource: pubnub-functions
 * Loads PubNub Functions documentation from a static markdown file
 */
server.resource(
  'pubnub-functions',
  new ResourceTemplate('pubnub-functions://{any}', { list: undefined }),
  async (uri) => {
    const filePath = path.join(__dirname, 'resources', 'pubnub_functions.md');
    const contents = fs.readFileSync(filePath, 'utf8');
    return {
      contents: [
        {
          uri: uri.href,
          text: contents
        }
      ]
    };
  }
);

/**
 * Prompt: greet-user
 * Example prompt that says hello to the user
 */
server.prompt(
  'greet-user',
  { name: z.string() },
  ({ name }) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Hello, ${name}! Welcome to the PubNub MCP server. How can I assist you today?`
        }
      }
    ]
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);
