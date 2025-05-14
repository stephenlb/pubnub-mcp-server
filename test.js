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

  // Test the 'publish_pubnub_message' tool
  console.log("Testing 'publish_pubnub_message' tool...");
  const publishResult = await client.callTool({
    name: 'publish_pubnub_message',
    arguments: { channel: 'test-channel', message: 'Hello from test!' },
  });
  assert(
    Array.isArray(publishResult.content) &&
      publishResult.content.length > 0 &&
      publishResult.content[0].text.includes('Timetoken'),
    "'publish_pubnub_message' tool did not return a timetoken."
  );
  console.log("'publish_pubnub_message' tool published message successfully.");
  // Test the 'get_pubnub_messages' tool
  console.log("Testing 'get_pubnub_messages' tool...");
  const getMessagesResult = await client.callTool({
    name: 'get_pubnub_messages',
    arguments: { channels: ['test-channel'] },
  });
  assert(
    Array.isArray(getMessagesResult.content) &&
      getMessagesResult.content.length > 0,
    "'get_pubnub_messages' tool returned no content."
  );
  const rawHistory = getMessagesResult.content[0].text;
  let history;
  try {
    history = JSON.parse(rawHistory);
  } catch (err) {
    assert(false, `Invalid JSON returned by 'get_pubnub_messages': ${err}`);
  }
  assert(
    history.channels && history.channels['test-channel'],
    "'get_pubnub_messages' did not include the test channel."
  );
  console.log("'get_pubnub_messages' tool returned message history successfully.");
  // Test the 'get_pubnub_presence' tool
  console.log("Testing 'get_pubnub_presence' tool...");
  const presenceResult = await client.callTool({
    name: 'get_pubnub_presence',
    arguments: { channels: ['test-channel'] },
  });
  assert(
    Array.isArray(presenceResult.content) && presenceResult.content.length > 0,
    "'get_pubnub_presence' tool returned no content."
  );
  const rawPresence = presenceResult.content[0].text;
  let presence;
  try {
    presence = JSON.parse(rawPresence);
  } catch (err) {
    assert(false, `Invalid JSON returned by 'get_pubnub_presence': ${err}`);
  }
  assert(
    presence.channels && presence.channels['test-channel'],
    "'get_pubnub_presence' did not include the test channel."
  );
  console.log("'get_pubnub_presence' tool returned presence information successfully.");
  // Test the 'write_pubnub_app' tool
  console.log("Testing 'write_pubnub_app' tool...");
  const writeAppResult = await client.callTool({
    name: 'write_pubnub_app',
    arguments: { appType: 'default' },
  });
  assert(
    Array.isArray(writeAppResult.content) && writeAppResult.content.length > 0,
    "'write_pubnub_app' tool returned no content."
  );
  console.log("'write_pubnub_app' tool returned content successfully.");

  console.log('All tests passed.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
