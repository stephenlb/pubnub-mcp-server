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

// Tool: "read_pubnub_sdk_docs" (PubNub SDK docs for a given language)
const languages = [
    'javascript', 'python', 'java', 'go', 'ruby',
    'swift', 'objective-c', 'c-sharp', 'php',
    'rust', 'unity', 'kotlin', 'unreal',
];
const apiReferences = [
    'configuration',
    'publish-and-subscribe',
    'presence',
    'access-manager',
    'channel-groups',
    'storage-and-playback',
    'mobile-push',
    'objects',
    'files',
    'message-actions',
    'misc',
];
server.tool(
  'read_pubnub_sdk_docs',
  'Fetches PubNub SDK documentation for a given language. Optional API references added.',
  {
    language: z.enum(languages).describe('Programming language for PubNub SDK documentation'),
    apiReference: z.enum(apiReferences).default('configuration').describe('API reference for the SDK documentation'),
  },
  async ({ language, apiReference }) => {
    const sdkURL = `https://www.pubnub.com/docs/sdks/${language}`;
    const apiRefURL = `https://www.pubnub.com/docs/sdks/${language}/api-reference/${apiReference}`;
    const sdkResponse = await loadArticle(sdkURL);
    const apiRefResponse = await loadArticle(apiRefURL);

    // Combine the content of both responses
    const combinedContent = sdkResponse.content.concat(apiRefResponse.content);
    return combinedContent;
  }
);

// Utility function that fetches the article content from the PubNub SDK documentation
async function loadArticle(url) {
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

  // Get the <article> content
  article = dom.window.document.querySelector('article');

  // Convert to Markdown
  const td = new TurndownService();
  const markdown = td.turndown(article);

  return {
    content: [
      {
        type: 'text',
        text: markdown,
      },
    ],
  };
}

// Tool: "pubnub_resources" (fetch PubNub documentation from markdown files in ./resources/ directory)
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
  'pubnub_resources',
  'Fetches additional PubNub documentation from markdown files in the resources directory.',
  {
    document: z.enum(pubnubDocsOptions).describe('Which PubNub documentation to fetch'),
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

// Tool: "get_pubnub_messages" (fetch message history for PubNub channels)
server.tool(
  'get_pubnub_messages',
  'Fetch message history for PubNub channels.',
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

// Tool: "publish_pubnub_message" (publishes a message to a PubNub channel)
server.tool(
  'publish_pubnub_message',
  'Publish a message to a PubNub channel.',
  {
    channel: z.string().describe('PubNub channel to publish to'),
    message: z.string().describe('Message to publish'),
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


// Tool: "get_pubnub_presence" (fetch presence information for PubNub channels and channel groups)
server.tool(
  'get_pubnub_presence',
  'Fetch presence information for PubNub channels and channel groups.',
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
