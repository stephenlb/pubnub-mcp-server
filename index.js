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
  publishKey: process.env.PUBNUB_PUBLISH_KEY || 'demo',
  subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY || 'demo',
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

// 3) Tool: "pubnub_docs" (loads PubNub documentation from resources)
const pubnubDocsOptions = [
  'concepts',
  'features',
  'functions',
  'integration',
  'scale',
  'security',
  'troubleshooting',
];
server.tool(
  'pubnub_docs',
  {
    doc: z
      .enum(pubnubDocsOptions)
      .describe('Which PubNub documentation to fetch'),
  },
  async ({ doc }) => {
    try {
      const filePath = pathJoin(__dirname, 'resources', `pubnub_${doc}.md`);
      if (!fs.existsSync(filePath)) {
        return {
          content: [
            {
              type: 'text',
              text: `Documentation file not found: pubnub_${doc}.md`,
            },
          ],
          isError: true,
        };
      }
      const content = fs.readFileSync(filePath, 'utf8');
      return {
        content: [
          {
            type: 'text',
            text: content,
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: 'text',
            text: `Error reading pubnub_docs for '${doc}': ${err.message || err}`,
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

// 6) Tool: "fetch_pubnub_docs" (fetch PubNub documentation from markdown files in ./resources/ directory)
server.tool(
  'fetch_pubnub_docs',
  {
    doc: z.string().describe('Name of PubNub documentation to fetch, e.g. "functions", "features", "security", etc.'),
  },
  async ({ doc }) => {
    try {
      let fileName = doc;
      // Normalize filename
      if (fileName.endsWith('.md')) {
        fileName = fileName.slice(0, -3);
      }
      if (!fileName.startsWith('pubnub_')) {
        fileName = `pubnub_${fileName}`;
      }
      const filePath = pathJoin(__dirname, 'resources', `${fileName}.md`);
      if (!fs.existsSync(filePath)) {
        return {
          content: [
            { type: 'text', text: `Documentation file not found: ${fileName}.md` },
          ],
          isError: true,
        };
      }
      const content = fs.readFileSync(filePath, 'utf8');
      return {
        content: [
          { type: 'text', text: content },
        ],
      };
    } catch (err) {
      return {
        content: [
          { type: 'text', text: `Error reading documentation: ${err.message || err}` },
        ],
        isError: true,
      };
    }
  }
);
// 7) Tool: "fetch_pubnub_messages" (fetch message history for PubNub channels)
server.tool(
  'fetch_pubnub_messages',
  {
    channels: z.array(z.string()).min(1).describe('Array of PubNub channels to fetch messages for'),
  },
  async ({ channels }) => {
    try {
      const result = await pubnub.fetchMessages({ channels });
      return {
        content: [
          { type: 'text', text: JSON.stringify(result, null, 2) },
        ],
      };
    } catch (err) {
      return {
        content: [ { type: 'text', text: `Error fetching messages: ${err}` } ],
        isError: true,
      };
    }
  }
);

// 8) Tool: "fetch_pubnub_presence" (fetch presence information for PubNub channels and channel groups)
server.tool(
  'fetch_pubnub_presence',
  {
    channels: z.array(z.string()).default([]).describe('Array of PubNub channels for presence query'),
    channelGroups: z.array(z.string()).default([]).describe('Array of PubNub channel groups for presence query'),
  },
  async ({ channels, channelGroups }) => {
    try {
      const result = await pubnub.hereNow({ channels, channelGroups });
      return {
        content: [ { type: 'text', text: JSON.stringify(result, null, 2) } ],
      };
    } catch (err) {
      return {
        content: [ { type: 'text', text: `Error fetching presence information: ${err}` } ],
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
