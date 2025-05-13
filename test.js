#!/usr/bin/env node

import assert from 'assert';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function main() {
  console.log('Starting MCP server and client...');
  const client = new Client({ name: 'test-client', version: '1.0.0' });
  const transport = new StdioClientTransport({ command: 'node', args: ['index.js'] });
  await client.connect(transport);
  console.log('Connected to MCP server.');

  console.log('Listing available tools...');
  const { tools } = await client.listTools();
  const toolNames = tools.map((tool) => tool.name);
  const expectedTools = [
    'read_pubnub_sdk_docs',
    'read_pubnub_resources',
    'publish_pubnub_message',
    'get_pubnub_messages',
    'get_pubnub_presence',
  ];
  for (const tool of expectedTools) {
    assert(
      toolNames.includes(tool),
      `Missing expected tool: ${tool}. Available tools: ${toolNames.join(', ')}`
    );
  }
  console.log('All expected tools are present.');

  console.log("Testing 'read_pubnub_resources' tool...");
  const pubnubResourcesResult = await client.callTool({
    name: 'read_pubnub_resources',
    arguments: { document: 'pubnub_concepts' },
  });
  assert(
    Array.isArray(pubnubResourcesResult.content) && pubnubResourcesResult.content.length > 0,
    "'read_pubnub_resources' tool returned no content."
  );
  console.log("'read_pubnub_resources' tool returned content successfully.");

  // Test the 'read_pubnub_sdk_docs' tool
  console.log("Testing 'read_pubnub_sdk_docs' tool...");
  const sdkDocsResult = await client.callTool({
    name: 'read_pubnub_sdk_docs',
    arguments: { language: 'javascript', apiReference: 'configuration' },
  });
  assert(
    Array.isArray(sdkDocsResult.content) && sdkDocsResult.content.length > 0,
    "'read_pubnub_sdk_docs' tool returned no content."
  );
  console.log("'read_pubnub_sdk_docs' tool returned content successfully.");

  console.log('All tests passed.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
