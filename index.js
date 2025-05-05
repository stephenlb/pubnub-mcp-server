#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();

import { fileURLToPath } from 'url';
import { dirname, join as pathJoin } from 'path';
import fs from 'fs';
import PubNub from 'pubnub';
import TurndownService from 'turndown';
import { JSDOM } from 'jsdom';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create and configure PubNub instance with userId = 'pubnub_mcp'
const pubnub = new PubNub({
  publishKey: process.env.PUBNUB_PUBLISH_KEY || '',
  subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY || '',
  userId: 'pubnub_mcp',
});

// MCP server setup
const server = new McpServer({
  name: 'pubnub_mcp_server',
  version: '1.0.0',
});

// 1) Resource: "thank_you_pubnub" (says thank you for using PubNub ❤️)
server.resource(
  'thank_you_pubnub',
  'thank_you_pubnub://thank_you',
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        text: 'Thank you for using PubNub ❤️',
      },
    ],
  })
);

// 2) Prompt: "say_hello" (says hello to user)
server.prompt(
  'say_hello',
  {
    name: z.string().default('User'),
  },
  ({ name }) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Hello, ${name}!`,
        },
      },
    ],
  })
);

// 3) Tool: "pubnub_functions_docs" (loads pubnub_functions.md from resources)
server.tool(
  'pubnub_functions_docs',
  {}, // no input needed
  async () => {
    try {
      const filePath = pathJoin(__dirname, 'resources', 'pubnub_functions.md');
      let content = fs.readFileSync(filePath, 'utf8');

      // Remove any <script> or <style> tags if present (though it's Markdown)
      const dom = new JSDOM(content);
      const scripts = dom.window.document.querySelectorAll('script');
      scripts.forEach((s) => s.remove());
      const styles = dom.window.document.querySelectorAll('style');
      styles.forEach((s) => s.remove());
      content = dom.window.document.body.innerHTML;

      // Replace "myPublishKey" and "mySubscribeKey" with "PUBNUB_PUBLISH_KEY" / "PUBNUB_SUBSCRIBE_KEY"
      content = content.replace(/myPublishKey/g, 'PUBNUB_PUBLISH_KEY');
      content = content.replace(/mySubscribeKey/g, 'PUBNUB_SUBSCRIBE_KEY');

      // Convert to Markdown with turndown
      const td = new TurndownService();
      const markdown = td.turndown(content);

      return {
        content: [
          {
            type: 'text',
            text: markdown,
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: 'text',
            text: `Error reading pubnub_functions_docs: ${err}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// 4) Tool: "fetch_pubnub_sdk_docs" (fetches and processes PubNub SDK docs for a given language)
const languages = [
    'javascript', 'python', 'java', 'go', 'ruby',
    'swift', 'objective-c', 'c-sharp', 'php',
    'rust', 'unity', 'kotlin', 'unreal'
];
server.tool(
  'fetch_pubnub_sdk_docs',
  {
    language: z.enum(languages),
  },
  async ({ language }) => {
    const url = `https://www.pubnub.com/docs/sdks/${language}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching ${url}: ${response.status} ${response.statusText}`,
            },
          ],
          isError: true,
        };
      }

      let html = await response.text();

      // Remove <script> and <style> tags
      const dom = new JSDOM(html);
      dom.window.document.querySelectorAll('script').forEach((el) => el.remove());
      dom.window.document.querySelectorAll('style').forEach((el) => el.remove());

      // Remove header/footer (attempt to remove typical <header> or <footer> tags)
      dom.window.document.querySelectorAll('header').forEach((el) => el.remove());
      dom.window.document.querySelectorAll('footer').forEach((el) => el.remove());

      // Get the remaining HTML
      html = dom.window.document.body.innerHTML;

      // Replace publish/subscribe placeholders
      html = html.replace(/myPublishKey/g, 'PUBNUB_PUBLISH_KEY');
      html = html.replace(/mySubscribeKey/g, 'PUBNUB_SUBSCRIBE_KEY');

      // Convert to Markdown
      const td = new TurndownService();
      const markdown = td.turndown(html);

      return {
        content: [
          {
            type: 'text',
            text: markdown,
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: 'text',
            text: `Error processing PubNub SDK docs for '${language}': ${err}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// 5) Tool: "publish_pubnub_message" (publishes a message to a PubNub channel)
server.tool(
  'publish_pubnub_message',
  {
    channel: z.string(),
    message: z.string(),
  },
  async ({ channel, message }) => {
    try {
      const result = await pubnub.publish({
        channel,
        message,
      });
      return {
        content: [
          {
            type: 'text',
            text: `Message published successfully. Timetoken: ${result.timetoken}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: 'text',
            text: `Error publishing message: ${err}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Start the MCP server over stdio
const transport = new StdioServerTransport();
server.connect(transport).catch((err) => {
  console.error('Failed to start PubNub MCP server:', err);
  process.exit(1);
});
