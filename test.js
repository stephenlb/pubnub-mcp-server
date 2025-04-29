#!/usr/bin/env node
/**
 * test.js
 *
 * A simple MCP client test script using @modelcontextprotocol/sdk to connect to the
 * PubNub MCP server (index.js) over stdio transport, list resources and tools,
 * read a resource, call a tool, then close the connection.
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  // Spawn the MCP server script over stdio
  const transport = new StdioClientTransport({
    command: "node",
    args: ["./index.js"]
  });

  const client = new Client({
    name: "pubnub-mcp-client",
    version: "1.0.0"
  });

  console.log("Connecting to MCP server...");
  await client.connect(transport);
  console.log("Connected to MCP server.");

  // List available resources
  const resources = await client.listResources();
  console.log("Resources:", resources);

  // List available tools
  const tools = await client.listTools();
  console.log("Tools:", tools);

  // Read the first resource, if any
  if (resources.length > 0) {
    const uri = resources[0].uri;
    console.log(`Reading resource: ${uri}`);
    const resource = await client.readResource({ uri });
    console.log("Resource contents:", resource);
  }

  // Call the fetchPubNubDocs tool for JavaScript SDK
  console.log("Calling tool 'fetchPubNubDocs'...");
  const result = await client.callTool({
    name: "fetchPubNubDocs",
    arguments: { docType: "javascript" }
  });
  if (result.content && result.content.length > 0) {
    const preview = result.content[0].text;
    console.log("Tool result preview (first 200 chars):\n", preview.slice(0, 200), "...");
  } else {
    console.log("Tool returned no content.");
  }

  // Close the client connection
  await client.close();
  console.log("Connection closed. Exiting.");
}

main().catch((err) => {
  console.error("MCP client test failed:", err);
  process.exit(1);
});