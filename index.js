#!/usr/bin/env node

"use strict";

import fs from "fs";
import TurndownService from "turndown";

// Immediately advertise available tools and resources
console.log(JSON.stringify({
  type: "tool_list",
  tools: [
    {
      name: "fetch_pubnub_docs",
      description: "Fetches PubNub SDK docs (JavaScript, Python, Java) and returns them as Markdown",
      run: {
        input: [
          { name: "sdk", type: "string", required: true, description: "One of: javascript, python, java" }
        ]
      }
    }
  ]
}));

console.log(JSON.stringify({
  type: "resource_list",
  resources: [
    {
      name: "pubnub_functions",
      description: "Static content about PubNub Functions from local file"
    }
  ]
}));

// Listen for requests on stdin
process.stdin.on("data", async (data) => {
  let parsed;
  try {
    parsed = JSON.parse(data.toString());
  } catch (err) {
    console.error("Invalid JSON input:", err);
    return;
  }

  // Handle tool invocation
  if (parsed.tool === "fetch_pubnub_docs") {
    let sdk = parsed.args && parsed.args.sdk ? parsed.args.sdk : "javascript";
    let url = null;
    switch (sdk.toLowerCase()) {
      case "python":
        url = "https://www.pubnub.com/docs/sdks/python";
        break;
      case "java":
        url = "https://www.pubnub.com/docs/sdks/java";
        break;
      default:
        url = "https://www.pubnub.com/docs/sdks/javascript";
        break;
    }

    try {
      const response = await fetch(url);
      const html = await response.text();
      const turndownService = new TurndownService();
      const markdown = turndownService.turndown(html);

      console.log(JSON.stringify({
        content: `Fetched and converted PubNub ${sdk} Docs:\n\n${markdown}`
      }));
    } catch (error) {
      console.log(JSON.stringify({
        content: `Error fetching docs: ${error.message}`,
        isError: true
      }));
    }
  }

  // Handle resource request
  if (parsed.resource === "pubnub_functions") {
    try {
      const content = fs.readFileSync("resources/pubnub_functions.md", "utf8");
      console.log(JSON.stringify({
        content: content
      }));
    } catch (error) {
      console.log(JSON.stringify({
        content: `Error reading resource file: ${error.message}`,
        isError: true
      }));
    }
  }
});
