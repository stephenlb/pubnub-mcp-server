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
    'write_pubnub_app',  // should expose the app creation instructions tool
  ];
  for (const tool of expectedTools) {
    assert(
      toolNames.includes(tool),
      `Missing expected tool: ${tool}. Available tools: ${toolNames.join(', ')}`
    );
  }
  console.log('All expected tools are present.');

  console.log("Testing 'read_pubnub_resources' tool with document 'how_to_write_a_pubnub_app'...");
  const pubnubResourcesResult = await client.callTool({
    name: 'read_pubnub_resources',
    arguments: { document: 'how_to_write_a_pubnub_app' },
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
      publishResult.content[0].text.length > 0,
    "'publish_pubnub_message' tool returned no content."
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
      getMessagesResult.content.length > 0 &&
      getMessagesResult.content[0].text.length > 0,
    "'get_pubnub_messages' tool returned no content."
  );
  console.log("'get_pubnub_messages' tool returned content successfully.");
  // Test the 'get_pubnub_presence' tool
  console.log("Testing 'get_pubnub_presence' tool...");
  const presenceResult = await client.callTool({
    name: 'get_pubnub_presence',
    arguments: { channels: ['test-channel'] },
  });
  assert(
    Array.isArray(presenceResult.content) &&
      presenceResult.content.length > 0 &&
      presenceResult.content[0].text.length > 0,
    "'get_pubnub_presence' tool returned no content."
  );
  console.log("'get_pubnub_presence' tool returned content successfully.");
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
  
  // Additional tests for server.tool arguments and options

  console.log("Testing 'read_pubnub_sdk_docs' tool default apiReference behavior...");
  const sdkDefaultResult = await client.callTool({
    name: 'read_pubnub_sdk_docs',
    arguments: { language: 'javascript' },
  });
  assert(
    Array.isArray(sdkDefaultResult.content) && sdkDefaultResult.content.length > 0,
    "'read_pubnub_sdk_docs' default behavior returned no content."
  );
  console.log("'read_pubnub_sdk_docs' default behavior returned content successfully.");
  // Test the 'read_pubnub_sdk_docs' tool with 'functions' apiReference
  console.log("Testing 'read_pubnub_sdk_docs' tool with apiReference 'functions'...");
  const sdkFunctionsResult = await client.callTool({
    name: 'read_pubnub_sdk_docs',
    arguments: { language: 'javascript', apiReference: 'functions' },
  });
  assert(
    Array.isArray(sdkFunctionsResult.content) && sdkFunctionsResult.content.length > 0,
    "'read_pubnub_sdk_docs' tool with 'functions' returned no content."
  );
  // Verify that the functions documentation is included
  assert(
    sdkFunctionsResult.content[0].text.includes('# PubNub Functions Development Guidelines'),
    "Expected functions documentation header in 'read_pubnub_sdk_docs' tool output."
  );
  console.log("'read_pubnub_sdk_docs' tool with 'functions' returned content successfully.");

  console.log("Testing 'read_pubnub_sdk_docs' tool with language 'dart' and default apiReference behavior...");
  const dartSdkResult = await client.callTool({
    name: 'read_pubnub_sdk_docs',
    arguments: { language: 'dart' },
  });
  assert(
    Array.isArray(dartSdkResult.content) && dartSdkResult.content.length > 0,
    "'read_pubnub_sdk_docs' tool with language 'dart' returned no content."
  );
  assert(
    dartSdkResult.content[0].text.includes('TITLE: Installing PubNub Dart SDK using Pub'),
    "Expected Dart SDK installation header in 'read_pubnub_sdk_docs' tool output."
  );
  console.log("'read_pubnub_sdk_docs' tool with language 'dart' returned content successfully.");

  console.log("Testing 'read_pubnub_resources' tool with document 'pubnub_concepts'...");
  const conceptsResult = await client.callTool({
    name: 'read_pubnub_resources',
    arguments: { document: 'pubnub_concepts' },
  });
  assert(
    Array.isArray(conceptsResult.content) && conceptsResult.content.length > 0,
    "'read_pubnub_resources' with 'pubnub_concepts' returned no content."
  );
  console.log("'read_pubnub_resources' returned concepts content successfully.");
  // Test for chat_sdk resource
  console.log("Testing 'read_pubnub_resources' tool with document 'chat_sdk'...");
  const chatSdkResult = await client.callTool({
    name: 'read_pubnub_resources',
    arguments: { document: 'chat_sdk' },
  });
  assert(
    Array.isArray(chatSdkResult.content) && chatSdkResult.content.length > 0,
    "'read_pubnub_resources' with 'chat_sdk' returned no content."
  );
  assert(
    chatSdkResult.content[0].text.includes('Sample chat app'),
    "Expected 'Sample chat app' in 'chat_sdk' result"
  );
  console.log("'read_pubnub_resources' tool with 'chat_sdk' returned content successfully.");
  // Test for pubnub_chat_sdk resource
  console.log("Testing 'read_pubnub_resources' tool with document 'pubnub_chat_sdk'...");
  const pubnubChatSdkResult = await client.callTool({
    name: 'read_pubnub_resources',
    arguments: { document: 'pubnub_chat_sdk' },
  });
  assert(
    Array.isArray(pubnubChatSdkResult.content) && pubnubChatSdkResult.content.length > 0,
    "'read_pubnub_resources' with 'pubnub_chat_sdk' returned no content."
  );
  assert(
    pubnubChatSdkResult.content[0].text.includes('Sample chat app'),
    "Expected 'Sample chat app' in 'pubnub_chat_sdk' result"
  );
  console.log("'read_pubnub_resources' tool with 'pubnub_chat_sdk' returned content successfully.");

  console.log("Testing 'read_pubnub_resources' tool with document 'how_to_use_app_context_objects_with_dart'...");
  const dartAppContextResult = await client.callTool({
    name: 'read_pubnub_resources',
    arguments: { document: 'how_to_use_app_context_objects_with_dart' },
  });
  assert(
    Array.isArray(dartAppContextResult.content) && dartAppContextResult.content.length > 0,
    "'read_pubnub_resources' with 'how_to_use_app_context_objects_with_dart' returned no content."
  );
  assert(
    dartAppContextResult.content[0].text.includes('App Context'),
    "Expected 'App Context' in 'how_to_use_app_context_objects_with_dart' result"
  );
  console.log("'read_pubnub_resources' tool with 'how_to_use_app_context_objects_with_dart' returned content successfully.");

  console.log("Testing 'read_pubnub_resources' tool with document 'dart'...");
  const dartLangResult = await client.callTool({
    name: 'read_pubnub_resources',
    arguments: { document: 'dart' },
  });
  assert(
    Array.isArray(dartLangResult.content) && dartLangResult.content.length > 0,
    "'read_pubnub_resources' with 'dart' returned no content."
  );
  assert(
    dartLangResult.content[0].text.includes('TITLE: Installing PubNub Dart SDK using Pub'),
    "Expected Dart language resource header in 'read_pubnub_resources' tool output."
  );
  console.log("'read_pubnub_resources' tool with 'dart' returned content successfully.");

  // Test error handling for 'read_pubnub_resources' tool with invalid document
  console.log("Testing 'read_pubnub_resources' tool with invalid document...");
  try {
    await client.callTool({
      name: 'read_pubnub_resources',
      arguments: { document: 'nonexistent_doc' },
    });
    assert(false, "Expected 'read_pubnub_resources' with invalid document to throw an error.");
  } catch (err) {
    assert(
      err.message.includes('Invalid arguments for tool read_pubnub_resources'),
      `Unexpected error for invalid document: ${err.message}`
    );
  }
  console.log("'read_pubnub_resources' invalid document error handling works successfully.");

  // Additional test for 'get_pubnub_messages' tool with multiple channels
  console.log("Testing 'get_pubnub_messages' tool with multiple channels...");
  const multiMessagesResult = await client.callTool({
    name: 'get_pubnub_messages',
    arguments: { channels: ['test-channel', 'another-channel'] },
  });
  assert(
    Array.isArray(multiMessagesResult.content) &&
      multiMessagesResult.content.length > 0 &&
      multiMessagesResult.content[0].text.length > 0,
    "'get_pubnub_messages' with multiple channels returned no content."
  );
  console.log("'get_pubnub_messages' multiple channels returned content successfully.");

  // Additional test for 'get_pubnub_presence' tool with channelGroups option
  console.log("Testing 'get_pubnub_presence' tool with channelGroups option...");
  const presenceCgResult = await client.callTool({
    name: 'get_pubnub_presence',
    arguments: { channelGroups: ['test-channel-group'] },
  });
  assert(
    Array.isArray(presenceCgResult.content) &&
      presenceCgResult.content.length > 0 &&
      presenceCgResult.content[0].text.length > 0,
    "'get_pubnub_presence' with channelGroups returned no content."
  );
  console.log("'get_pubnub_presence' channelGroups returned content successfully.");

  // Invalid argument tests
  console.log("Testing 'get_pubnub_messages' tool with empty channels (should error)...");
  try {
    await client.callTool({
      name: 'get_pubnub_messages',
      arguments: { channels: [] },
    });
    assert(false, "Expected 'get_pubnub_messages' with empty channels to throw an error.");
  } catch (err) {
    assert(
      err.message.includes('Invalid arguments for tool get_pubnub_messages'),
      `Unexpected error for empty channels: ${err.message}`
    );
  }
  console.log("'get_pubnub_messages' empty channels error handling works successfully.");

  console.log("Testing 'write_pubnub_app' tool with invalid appType (should error)...");
  try {
    await client.callTool({
      name: 'write_pubnub_app',
      arguments: { appType: 'chat' },
    });
    assert(false, "Expected 'write_pubnub_app' with invalid appType to throw an error.");
  } catch (err) {
    assert(
      err.message.includes('Invalid arguments for tool write_pubnub_app'),
      `Unexpected error for invalid appType: ${err.message}`
    );
  }
  console.log("'write_pubnub_app' invalid appType error handling works successfully.");

  console.log("Testing 'read_pubnub_sdk_docs' tool with invalid language (should error)...");
  try {
    await client.callTool({
      name: 'read_pubnub_sdk_docs',
      arguments: { language: 'haskell', apiReference: 'configuration' },
    });
    assert(false, "Expected 'read_pubnub_sdk_docs' with invalid language to throw an error.");
  } catch (err) {
    assert(
      err.message.includes('Invalid arguments for tool read_pubnub_sdk_docs'),
      `Unexpected error for invalid language: ${err.message}`
    );
  }
  console.log("'read_pubnub_sdk_docs' invalid language error handling works successfully.");

  console.log("Testing 'read_pubnub_sdk_docs' tool with missing language (should error)...");
  try {
    await client.callTool({
      name: 'read_pubnub_sdk_docs',
      arguments: { apiReference: 'configuration' },
    });
    assert(false, "Expected 'read_pubnub_sdk_docs' missing language to throw an error.");
  } catch (err) {
    assert(
      err.message.includes('Invalid arguments for tool read_pubnub_sdk_docs'),
      `Unexpected error for missing language: ${err.message}`
    );
  }
  console.log("'read_pubnub_sdk_docs' missing language error handling works successfully.");
  
  console.log('All tests passed.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
