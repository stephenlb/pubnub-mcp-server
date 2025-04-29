1. Write a PubNub MCP server using stdio.
2. use npm install @modelcontextprotocol/sdk to build the MCP server.
3. Only output javascript code as ES module and start the top of the script output with: #!/usr/bin/env node
4. Add MCP tool to Fetch PubNub SDK documentation from the following URLs:
https://www.pubnub.com/docs/sdks/javascript
https://www.pubnub.com/docs/sdks/python
https://www.pubnub.com/docs/sdks/java
5. remove \<script\> and \<style\> tags from the HTML.
6. reformat the fetched webpage HTML to Markdown using turndown node module.
7. add PubNub Functions MCP resource from static file content found in resources/pubnub_functions.md
8. use an absolute path in your code for the static file content resources/pubnub_functions.md path.join(__dirname, 'resources', 'pubnub_functions.md')
9. add at least one prompt to the MCP server to say hello to the user.
10. use underscores instead of hyphens in the MCP server for tool names, resources and prompts.
