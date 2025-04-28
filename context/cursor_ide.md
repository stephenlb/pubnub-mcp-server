# How to Add an MCP Server to Cursor

Below is a concise guide on configuring and using an MCP server in Cursor via the CLI (stdio) transport. Note that we have focused on instructions relevant to local (CLI) servers and excluded SSE details.

---

### Overview

Cursor supports connecting to external tools via the Model Context Protocol (MCP). By adding an MCP server, you enable Cursor to leverage additional tools and data sources directly, without manually feeding in project details or external information. 

**Key Points:**
- MCP servers can be written in any language (e.g., Python, Node.js).
- Local (CLI) servers communicate through `stdout` and are managed automatically by Cursor.
- Configuration is stored in a JSON file, either globally (`~/.cursor/mcp.json`) or per project (`.cursor/mcp.json`).

---

### Creating a CLI MCP Server

A minimal CLI-based MCP server writes and reads JSON messages via standard IO (`stdout` and `stdin`). Here’s an example in Node.js:

```js
#!/usr/bin/env node

// Simple Node.js MCP server
console.log(JSON.stringify({
  type: "tool_list",
  tools: [
    {
      name: "hello_tool",
      description: "Says hello",
      // The 'run' action is called when the tool is invoked by the Agent
      run: {
        input: [
          { name: "name", type: "string" }
        ]
      }
    }
  ]
}));

// Listen for requests from Cursor on stdin
process.stdin.on("data", (data) => {
  try {
    const request = JSON.parse(data.toString());
    if (request.tool === "hello_tool") {
      const name = request.args?.name || "world";
      const response = {
        content: `Hello, ${name}!`
      };
      console.log(JSON.stringify(response));
    }
  } catch (err) {
    console.error(err);
  }
});
```

Save this file (e.g., `helloServer.js`), and make it executable.

---

### Configuring the MCP Server in Cursor

Cursor recognizes MCP servers by reading a JSON config in one of two possible locations:

1. **Global Configuration**  
   `~/.cursor/mcp.json`  
   MCP servers in this file are available across all your projects.

2. **Project Configuration**  
   `.cursor/mcp.json` (within your project directory)  
   MCP servers in this file are only available within that specific project.

---

#### Example Configuration

Below is an example `.cursor/mcp.json` describing a CLI-based MCP server.

```json
{
  "mcpServers": {
    "hello-server": {
      "cmd": "node /path/to/helloServer.js",
      "env": {
        "API_KEY": "YOUR_API_KEY_VALUE"
      }
    }
  }
}
```

**Notes:**
- `hello-server` is the name you’ll see in Cursor.
- `cmd` should point to the shell command that launches your MCP server (e.g., `node /path/to/server.js`).
- `env` allows you to supply environment variables. These environment variables are passed to the MCP server process.

---

### Using the MCP Server in Chat

Once the configuration file is in place, restart Cursor (or open a new session). You can verify that your server was recognized in the MCP settings page under **Available Tools**.

The Chat Agent will automatically use any recognized MCP tools when relevant. To invoke a tool intentionally:
1. Mention the tool by name or description in your prompt, for example:  
   “Use the hello_tool from the hello-server to say hello to Jane.”
2. Cursor may ask for your approval before running a tool; approve to proceed.

---

### Enabling Auto-run (Optional)

If you trust a tool and want Cursor to invoke it without prompting for approval:
1. Go to the tool settings (MCP settings page in Cursor).
2. Enable “auto-run” or “Yolo mode.”

---

### Known Limitations

- **Tool Quantity**: Only the first 40 tools from all MCP servers are sent to the Agent if you have a large number of tools.
---

## Summary

1. **Create** a CLI MCP server in your preferred language (Node.js, Python, etc.).  
2. **Add** its details to either `.cursor/mcp.json` (for project-level usage) or `~/.cursor/mcp.json` (for global usage).  
3. **Restart** Cursor or open a new session. The server’s tools should appear in the MCP settings page under **Available Tools**.  
4. **Invoke** the tools in chat by name or description, or let Cursor use them automatically when relevant.

You’re now ready to extend Cursor’s capabilities with your own MCP servers!
