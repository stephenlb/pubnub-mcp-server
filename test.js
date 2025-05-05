#!/usr/bin/env node
/**
 * test.js
 * A simple MCP client test script for the PubNub MCP server (index.js)
 * using @modelcontextprotocol/sdk client over stdio transport.
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["./index.js"],
  });
  const client = new Client({
    name: "pubnub-mcp-client",
    version: "1.0.0",
  });

  console.log("Connecting to MCP server...");
  await client.connect(transport);
  console.log("Connected.");

  // List available prompts
  const { prompts } = await client.listPrompts();
  console.log("Available prompts:", prompts.map((p) => p.name).join(", "));

  // List available resources
  const { resources } = await client.listResources();
  console.log("Available resources:", resources.map((r) => r.uri).join(", "));

  // List available tools
  const { tools } = await client.listTools();
  console.log("Available tools:", tools.map((t) => t.name).join(", "));

  // Test prompt: say_hello with default
  const promptDefault = await client.getPrompt({
    name: "say_hello",
    arguments: {},
  });
  console.log("say_hello (default):", promptDefault.messages[0].content.text);

  // Test prompt: say_hello with custom name
  const promptCustom = await client.getPrompt({
    name: "say_hello",
    arguments: { name: "Alice" },
  });
  console.log("say_hello (Alice):", promptCustom.messages[0].content.text);

  // Test tool: pubnub_docs (static file)
  console.log("Calling tool: pubnub_docs (functions)");
  const pubnubDocs = await client.callTool({
    name: "pubnub_docs",
    arguments: { doc: "functions" },
  });
  if (pubnubDocs.content?.length) {
    console.log(
      "pubnub_docs (functions) preview:",
      pubnubDocs.content[0].text.slice(0, 200),
      "..."
    );
  }

  // Test tool: fetch_pubnub_sdk_docs for JavaScript SDK
  console.log("Calling tool: fetch_pubnub_sdk_docs (javascript)");
  const jsDocs = await client.callTool({
    name: "fetch_pubnub_sdk_docs",
    arguments: { language: "javascript" },
  });
  if (jsDocs.content?.length) {
    console.log(
      "fetch_pubnub_sdk_docs (javascript) preview:",
      jsDocs.content[0].text.slice(0, 200),
      "..."
    );
  }

  // Close connection
  await client.close();
  console.log("Connection closed.");
}

main().catch((err) => {
  console.error("Test script failed:", err);
  process.exit(1);
});
