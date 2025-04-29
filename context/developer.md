1. Write a PubNub MCP server using stdio.
2. use npm install @modelcontextprotocol/sdk to build the MCP server.
3. Only output javascript code as ES module.
4. Add MCP tool to Fetch PubNub SDK documentation from the following URLs:
https://www.pubnub.com/docs/sdks/javascript
https://www.pubnub.com/docs/sdks/python
https://www.pubnub.com/docs/sdks/java
5. reformat the fetched webpage HTML to Markdown using turndown node module.
6. add PubNub Functions MCP resource from static file content found in resources/pubnub_functions.md
7. use an absolute path in your code for the static file content resources/pubnub_functions.md path.join(__dirname, 'resources', 'pubnub_functions.md')
