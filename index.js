#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();

import { fileURLToPath } from 'url';
import { dirname, join as pathJoin, extname, basename } from 'path';
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
  'Retrieve official PubNub SDK documentation for a specified programming language and optional API reference section. Use this tool to get code examples, usage patterns, and detailed explanations of PubNub SDK features.',
  {
    language: z.enum(languages).describe('Programming language of the PubNub SDK to retrieve documentation for (e.g. javascript, python)'),
    apiReference: z.enum(apiReferences).optional().default('configuration').describe('API reference section to retrieve (e.g. configuration, publish-and-subscribe; defaults to configuration)'),
  },
  async ({ language, apiReference }) => {
    const sdkURL = `https://www.pubnub.com/docs/sdks/${language}`;
    const apiRefURL = `https://www.pubnub.com/docs/sdks/${language}/api-reference/${apiReference}`;

    const sdkResponse = await loadArticle(sdkURL);
    const apiRefResponse = await loadArticle(apiRefURL);
    const context7Response = loadLanguageFile(language);

    // Combine the content of both responses
    const combinedContent = [sdkResponse, apiRefResponse, context7Response].join('\n\n');

    // Return the combined content
    return {
      content: [
        {
          type: 'text',
          text: combinedContent,
        },
      ],
    };
  }
);

// Function that loads a file from resources directory
function loadLanguageFile(file) {
  try {
    const content = fs.readFileSync(pathJoin(__dirname, 'resources', 'languages', `${file}.md`), 'utf8');
    return content;
  } catch (err) {
    console.error(`Error loading specific langauge file ${file}: ${err}`);
    return '';
  }
}

// Utility function that fetches the article content from the PubNub SDK documentation
async function loadArticle(url) {
  const response = await fetch(url);
  if (!response.ok) {
    return `Error fetching ${url}: ${response.status} ${response.statusText}`;
  }

  let html = await response.text();

  // Remove <script> and <style> tags
  const dom = new JSDOM(html);

  // Get the <article> content
  const article = dom.window.document.querySelector('article');

  // Convert to Markdown
  const td = new TurndownService();
  const markdown = td.turndown(article);

  return markdown;

}

// Tool: "pubnub_resources" (fetch PubNub documentation from markdown files in ./resources/ directory)
// Dynamically generate resource options based on markdown files in the ./resources directory
const resourcesDir = pathJoin(__dirname, 'resources');
const pubnubResouceOptions = (() => {
  try {
    const files = fs.readdirSync(resourcesDir);
    return files
      .filter((file) => fs.statSync(pathJoin(resourcesDir, file)).isFile())
      .filter((file) => extname(file).toLowerCase() === '.md')
      .map((file) => basename(file, extname(file)));
  } catch (err) {
    console.error(`Error reading resources directory: ${err}`);
    return [];
  }
})();
server.tool(
  'read_pubnub_resources',
  'Access PubNub "How to" and "resources" documentation stored as markdown files in the "resources" directory. Specify the documentation section to retrieve conceptual guides, feature overviews, integration instructions, scaling advice, security best practices, or troubleshooting tips.',
  {
    document: z.enum(pubnubResouceOptions).describe('Documentation section to fetch (concepts, features, functions, integration, scale, security, troubleshooting)'),
  },
  async ({ document }) => {
    try {
      // prepend 'pubnub_' prefix to locate the markdown file
      const filePath = pathJoin(__dirname, 'resources', `${document}.md`);
      if (!fs.existsSync(filePath)) {
        return {
          content: [
            {
              type: 'text',
              text: `Documentation file not found: ${document}.md`,
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
            text: `Error reading pubnub documentation for 'pubnub_${document}.md': ${err.message || err}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: "publish_pubnub_message" (publishes a message to a PubNub channel)
server.tool(
  'publish_pubnub_message',
  'Send a message to a specified PubNub channel. Provide the channel name and message payload; returns a timetoken confirming successful publication.',
  {
    channel: z.string().describe('Name of the PubNub channel (string) to publish the message to'),
    message: z.string().describe('Message payload as a string'),
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

// Tool: "get_pubnub_messages" (fetch message history for PubNub channels)
server.tool(
  'get_pubnub_messages',
  'Retrieve historical messages from specified PubNub channels, including message content and metadata. Provide an array of channel names to receive past communication records.',
  {
    channels: z.array(z.string()).min(1).describe('List of one or more PubNub channel names (strings) to retrieve historical messages from'),
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

// Tool: "get_pubnub_presence" (fetch presence information for PubNub channels and channel groups)
server.tool(
  'get_pubnub_presence',
  'Obtain real-time presence data (occupancy, UUIDs, etc.) for specified PubNub channels and channel groups. Useful for monitoring active subscribers and their status.',
  {
    channels: z.array(z.string()).default([]).describe('List of channel names (strings) to query presence data for'),
    channelGroups: z.array(z.string()).default([]).describe('List of channel group names (strings) to query presence data for'),
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

// Tool: "write_pubnub_app" Provides a checklist of instructions for creating a PubNub app
const appTypes = ['default']; // , 'chat', 'pubsub', 'presence', 'storage-and-playback'];
server.tool(
  'write_pubnub_app',
  'Provides instructions for creating a PubNub app. Includes a checklist of steps to follow, such as setting up the PubNub account, creating a new app, and configuring the app settings. This tool is useful for developers who are new to PubNub and need guidance on how to get started with building their first app.',
  {
    appType: z.enum(appTypes).describe('Which PubNub app template to load'),
  },
  async ({ offer }) => {
    try {
      const filePath = pathJoin(__dirname, 'resources', `how_to_write_a_pubnub_app.md`);
      if (!fs.existsSync(filePath)) {
        return {
          content: [
            { type: 'text', text: `App template not found: ${offer}.md` },
          ],
          isError: true,
        };
      }
      let content = fs.readFileSync(filePath, 'utf8');
      return {
        content: [{ type: 'text', text: content }],
      };
    } catch (err) {
      return {
        content: [
          {
            type: 'text',
            text: `Error loading app template '${offer}': ${err.message || err}`,
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
