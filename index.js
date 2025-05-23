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
    'swift', 'objective-c', 'c-sharp', 'php', 'dart',
    'rust', 'unity', 'kotlin', 'unreal', 'chat_sdk',
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
    // Special section for PubNub Functions; loads from local resources/pubnub_functions.md
    'functions',
];
server.tool(
  'read_pubnub_sdk_docs',
  'Retrieves official PubNub SDK documentation for a given programming language and API reference section. Call this tool whenever you need detailed SDK docs, code examples, or usage patterns. Returns documentation in markdown format.',
  {
    language: z.enum(languages).describe('Programming language of the PubNub SDK to retrieve documentation for (e.g. javascript, python)'),
    apiReference: z.enum(apiReferences).optional().default('configuration').describe('API reference section to retrieve (e.g. configuration, publish-and-subscribe; defaults to configuration)'),
  },
  async ({ language, apiReference }) => {
    // Early return for PubNub Functions documentation
    if (apiReference === 'functions') {
      try {
        const functionsDoc = fs.readFileSync(
          pathJoin(__dirname, 'resources', 'pubnub_functions.md'),
          'utf8'
        );
        return { content: [ { type: 'text', text: functionsDoc } ] };
      } catch (err) {
        return {
          content: [ { type: 'text', text: `Error loading functions documentation: ${err}` } ],
          isError: true
        };
      }
    }
    const sdkURL = `https://www.pubnub.com/docs/sdks/${language}`;
    const apiRefURL = `https://www.pubnub.com/docs/sdks/${language}/api-reference/${apiReference}`;

    const sdkResponse = await loadArticle(sdkURL);
    // Load API reference: fetch remote article or load local functions documentation
    let apiRefResponse;
    if (apiReference === 'functions') {
      try {
        apiRefResponse = fs.readFileSync(
          pathJoin(__dirname, 'resources', 'pubnub_functions.md'),
          'utf8'
        );
      } catch (err) {
        apiRefResponse = `Error loading functions documentation: ${err}`;
      }
    } else {
      apiRefResponse = await loadArticle(apiRefURL);
    }
    const context7Response = loadLanguageFile(language);

    // Combine the content of both responses
    let combinedContent;
    if (apiReference === 'functions') {
      combinedContent = [apiRefResponse, context7Response].join('\n\n');
    } else {
      combinedContent = [sdkResponse, apiRefResponse, context7Response].join('\n\n');
    }

    // Return the combined content
    return {
      content: [
        {
          type: 'text',
          text: combinedContent + getPubNubInitSDKInstructions(),
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

// Tool: "read_pubnub_resources" (fetch PubNub conceptual guides and how-to documentation from markdown files)
// Dynamically generate available resource names based on markdown files in the resources directory and languages subdirectory
const resourcesDir = pathJoin(__dirname, 'resources');
const languagesDir = pathJoin(resourcesDir, 'languages');
const pubnubResourceOptions = (() => {
  try {
    // Top-level markdown files in resources directory
    const files = fs.readdirSync(resourcesDir);
    const topLevel = files
      .filter((file) => fs.statSync(pathJoin(resourcesDir, file)).isFile())
      .filter((file) => extname(file).toLowerCase() === '.md')
      .map((file) => basename(file, extname(file)));
    // Markdown files in resources/languages directory
    let langFiles = [];
    if (fs.existsSync(languagesDir)) {
      langFiles = fs.readdirSync(languagesDir)
        .filter((file) => fs.statSync(pathJoin(languagesDir, file)).isFile())
        .filter((file) => extname(file).toLowerCase() === '.md')
        .map((file) => basename(file, extname(file)));
    }
    return [...topLevel, ...langFiles];
  } catch (err) {
    console.error(`Error reading resources directories: ${err}`);
    return [];
  }
})();
server.tool(
  'read_pubnub_resources',
  'Retrieves PubNub conceptual guides and how-to documentation from markdown files in the resources directory. Call this tool whenever you need overviews, integration instructions, best practices, or troubleshooting tips for PubNub features. Specify the resource name to retrieve, such as pubnub_concepts, pubnub_features, pubnub_security, how_to_send_receive_json, how_to_encrypt_messages_files, etc.',
  {
    document: z.enum(pubnubResourceOptions).describe('Resource name to fetch (file name without .md under resources directory, e.g., pubnub_concepts, how_to_send_receive_json, how_to_encrypt_messages_files)'),
  },
  async ({ document }) => {
    try {
      // determine the file path for the requested resource (top-level or languages)
      let filePath = pathJoin(resourcesDir, `${document}.md`);
      if (!fs.existsSync(filePath)) {
        // fallback to languages directory
        filePath = pathJoin(languagesDir, `${document}.md`);
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
      }
      const content = fs.readFileSync(filePath, 'utf8');
      return {
        content: [
          {
            type: 'text',
            text: content + getPubNubInitSDKInstructions(),
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: 'text',
            text: `Error reading pubnub documentation for '${document}.md': ${err.message || err}`,
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
  'Publishes a message to a specified PubNub channel. Call this tool whenever you need to send data through PubNub. Provide the channel name and message payload. Returns a timetoken confirming successful publication.',
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
  'Fetches historical messages from one or more PubNub channels. Call this tool whenever you need to access past message history. Provide a list of channel names. Returns message content and metadata in JSON format.',
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
  'Retrieves real-time presence information for specified PubNub channels and channel groups. Call this tool when you need to monitor active users, occupancy counts, and subscriber UUIDs. Provide channel names and/or channel group names. Returns presence data in JSON format.',
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

// Tool: "write_pubnub_app" (generate instructions for creating a PubNub application)
const appTypes = ['default']; // , 'chat', 'pubsub', 'presence', 'storage-and-playback'];
server.tool(
  'write_pubnub_app',
  'Generates step-by-step instructions for creating a PubNub application. Call this tool when you need a checklist of tasks such as setting up your PubNub account, creating a new app, and configuring settings.',
  {
    appType: z.enum(appTypes).describe('Which PubNub app template to load (currently only "default")'),
  },
  async ({ appType }) => {
    try {
      const fileName = appType === 'default' ? 'how_to_write_a_pubnub_app' : `how_to_write_a_${appType}`;
      const filePath = pathJoin(__dirname, 'resources', `${fileName}.md`);
      if (!fs.existsSync(filePath)) {
        return {
          content: [
            { type: 'text', text: `App template not found: ${fileName}.md` },
          ],
          isError: true,
        };
      }
      const content = fs.readFileSync(filePath, 'utf8');
      return {
        content: [{ type: 'text', text: content + getPubNubInitSDKInstructions() }],
      };
    } catch (err) {
      return {
        content: [
          {
            type: 'text',
            text: `Error loading app template '${appType}': ${err.message || err}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Function that returns instructions for creating a PubNub application using the user's API keys
function getPubNubInitSDKInstructions() {
  const publishKey = process.env.PUBNUB_PUBLISH_KEY || 'demo';
  const subscribeKey = process.env.PUBNUB_SUBSCRIBE_KEY || 'demo';
  return `
To initialize the PubNub SDK with your API keys, configure your client in the language of your choice:

JavaScript:
\`\`\`javascript
import PubNub from 'pubnub';

const pubnub = new PubNub({
  publishKey: '${publishKey}',
  subscribeKey: '${subscribeKey}',
  uuid: 'your-unique-uuid',
});
\`\`\`

Python:
\`\`\`python
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub

pnconfig = PNConfiguration()
pnconfig.publish_key = '${publishKey}'
pnconfig.subscribe_key = '${subscribeKey}'
pnconfig.uuid = 'your-unique-uuid'
pubnub = PubNub(pnconfig)
\`\`\`

Ruby:
\`\`\`ruby
require 'pubnub'

pubnub = Pubnub.new(
  publish_key: '${publishKey}',
  subscribe_key: '${subscribeKey}',
  uuid: 'your-unique-uuid'
)
\`\`\`

Objective-C:
\`\`\`objectivec
#import <PubNub/PubNub.h>

PNConfiguration *configuration = [PNConfiguration configurationWithPublishKey:@"${publishKey}" subscribeKey:@"${subscribeKey}"];
configuration.uuid = @"your-unique-uuid";
PubNub *pubnub = [PubNub clientWithConfiguration:configuration];
\`\`\`

Replace 'your-unique-uuid' with a unique identifier for your client instance.
`;
}

// Online: PubNub server instance for MCP messages
const pubnubServer = new PubNub({
  publishKey: 'demo',
  subscribeKey: 'demo',
  userId: 'pubnub_mcp_server',
});

// Subscribe to the 'pubnub_mcp_server'
pubnubServer.addListener({
  message: envelope => {
    const { channel, message } = envelope;
    //console.log(`Received message on channel ${channel}:`, message);
  }
});
pubnubServer.subscribe({ channels: ['pubnub_mcp_server'] });

// Publish to the 'pubnub_mcp_server' channel
setTimeout( () => {
  pubnubServer.publish({
    channel: 'pubnub_mcp_server',
    message: {
      type: 'mcp',
      data: {
        name: 'pubnub_mcp_server',
        version: '1.0.0',
        description: 'PubNub MCP server instance',
      },
    },
  }).catch((err) => {
    //console.error('Failed to publish to PubNub MCP server:', err);
  });
}, 1000);

// Start the MCP server over stdio
const transport = new StdioServerTransport();
server.connect(transport).catch((err) => {
  console.error('Failed to start PubNub MCP server:', err);
  process.exit(1);
});
