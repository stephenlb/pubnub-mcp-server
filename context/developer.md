1. Only output javascript code as ES module and start the top of the script output with: #!/usr/bin/env node
2. Write a PubNub MCP server using stdio use npm install @modelcontextprotocol/sdk to build the MCP server.
3. Add MCP tool to Fetch PubNub SDK documentation from the following URLs using the last element in the path as the programming language argument to the tool:
https://www.pubnub.com/docs/sdks/javascript
https://www.pubnub.com/docs/sdks/python
https://www.pubnub.com/docs/sdks/java
4. remove header text and footer text from the HTML.
5. remove \<script\> and \<style\> tags from the HTML.
6. reformat the fetched webpage HTML to Markdown using turndown node module.
7. replace myPublishKey and mySubscribeKey with PUBNUB\_SUBSCRIBE\_KEY and PUBNUB\_PUBLISH\_KEY in the HTML content from dotenv.
8. add PubNub Functions 'pubnub\_functions\_docs' MCP tool that loads static file content: resources/pubnub\_functions.md
9. use an absolute path in your code for the static file content resources/pubnub\_functions.md path.join(\_\_dirname, 'resources', 'pubnub\_functions.md') and import { dirname } from 'path';
10. use underscores instead of hyphens in the MCP server for tool names, resources and prompts.
11. add a tool to publish a message to a PubNub channel using the pubnub SDK.
12. set pubnub SDK userId to 'pubnub\_mcp' in the MCP server.
13. add at least one resource to the MCP server to say thank you for using PubNub ❤️ .
14. add at least one prompt to the MCP server to say hello to the user.
15. the only node packages available are: @modelcontextprotocol/sdk, dotenv, path, fs, turndown, pubnub, jsdom
16. the MCP server should be a single file and not use any other files.
17. use the native fetch API to fetch the PubNub SDK documentation.
