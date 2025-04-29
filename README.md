# PubNub Model Context Protocol (MCP) Server for Cursor IDE

This repository provides a CLI-based Model Context Protocol (MCP) server that exposes PubNub SDK documentation and PubNub Functions resources to LLM-powered tools.
By adding this server to Cursor IDE, you can:
- Fetch formatted PubNub JavaScript, Python, and Java SDK documentation.
- Access PubNub Functions documentation from a static Markdown file.

## Prerequisites

- Node.js (>= 14) and npm
- Cursor IDE with MCP support
- (Optional) PubNub account and API keys for live examples

## Installation

The preferred way to run the PubNub MCP server locally or add it to Cursor IDE is via npx:

```bash
npx -y @pubnub/mcp
```

This requires Node.js (>= 14) and npm (https://nodejs.org/).
`npx` will automatically fetch and run the latest MCP server.

## Configuration

Cursor IDE discovers MCP servers via a JSON config file.
Configure the PubNub MCP server globally or per project.

### Global Configuration

Edit or create `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "pubnub": {
      "command": "npx",
      "args": ["-y", "@pubnub/mcp"],
      "env": {
        "PUBNUB_SUBSCRIBE_KEY": "YOUR_SUBSCRIBE_KEY",
        "PUBNUB_PUBLISH_KEY": "YOUR_PUBLISH_KEY"
      }
    }
  }
}
```

### Project Configuration

In your project directory, create `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "pubnub": {
      "command": "npx",
      "args": ["-y", "@pubnub/mcp"],
      "env": {
        "PUBNUB_SUBSCRIBE_KEY": "YOUR_SUBSCRIBE_KEY",
        "PUBNUB_PUBLISH_KEY": "YOUR_PUBLISH_KEY"
      }
    }
  }
}
```

- `command` specifies the executable to launch the MCP server.
- `args` specifies the arguments to pass to the command.
- `env` sets environment variables for the server process.

## Using in Cursor IDE

1. Restart Cursor IDE or open a new session.
2. Open the MCP settings pane and verify the **pubnub** server is listed under **Available Tools & Resources**.
3. In chat, invoke available resources:
   - `pubnub://docs/javascript` — Fetch PubNub JavaScript SDK documentation
   - `pubnub://docs/python` — Fetch PubNub Python SDK documentation
   - `pubnub://docs/java` — Fetch PubNub Java SDK documentation
   - `pubnub://functions` — List PubNub Functions (static content from `resources/pubnub_functions.md`)
4. Approve resource execution when prompted, or enable **auto-run** in settings for trusted resources.

## Example Prompts

- "Show me the PubNub JavaScript SDK documentation for `subscribe()`."  
- "List all available PubNub Functions."  
- "Fetch the Python SDK docs for the `publish()` method."

## Troubleshooting

- Verify Node.js and npm installation.
- Ensure `server.js` has execute permission.
- Check that the `command`, `args`, and `env` settings are correct.
- Review Cursor IDE logs for MCP startup errors.

## Direct JSON-RPC Command-Line Usage

You can invoke the MCP server directly over STDIN/STDOUT using JSON-RPC v2.0.
Ensure your PubNub keys are set in the environment, for example:
```bash
PUBNUB_SUBSCRIBE_KEY=YOUR_SUBSCRIBE_KEY \
PUBNUB_PUBLISH_KEY=YOUR_PUBLISH_KEY \
  node index.js
```

Once the server is running (or using a one-off invocation), send requests by piping JSON into `node index.js`. Examples:
```bash
# 1) List available tools
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' \
  | node index.js

# 2) Fetch PubNub JavaScript SDK documentation
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":
  {"name":"fetch_pubnub_sdk_docs","arguments":{"language":"javascript"}}}' \
  | node index.js

# 3) Load PubNub Functions docs (static Markdown)
echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":
  {"name":"pubnub_functions_docs","arguments":{}}}' \
  | node index.js

# 4) Publish a message to a channel
echo '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":
  {"name":"publish_pubnub_message","arguments":
    {"channel":"my_channel","message":"Hello, PubNub!"}}}' \
  | node index.js

# 5) Read a static resource
echo '{"jsonrpc":"2.0","id":5,"method":"resources/read","params":
  {"uri":"thank_you_pubnub://thank_you"}}' \
  | node index.js
```

## Quick JSON-RPC Examples

Below are simplified JSON-RPC v2.0 command-line examples using STDIN/STDOUT to fetch PubNub SDK documentation and publish messages.

### 1) Fetch PubNub JavaScript SDK documentation
```bash
PUBNUB_SUBSCRIBE_KEY=YOUR_SUBSCRIBE_KEY \
PUBNUB_PUBLISH_KEY=YOUR_PUBLISH_KEY \
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"fetch_pubnub_sdk_docs","arguments":{"language":"javascript"}}}' \
  | node index.js
```

### 2) Publish a message to a PubNub channel
```bash
PUBNUB_SUBSCRIBE_KEY=YOUR_SUBSCRIBE_KEY \
PUBNUB_PUBLISH_KEY=YOUR_PUBLISH_KEY \
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"publish_pubnub_message","arguments":{"channel":"my_channel","message":"Hello, PubNub MCP JSON-RPC!"}}}' \
  | node index.js
```

## License

MIT
