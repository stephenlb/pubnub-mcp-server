#!/bin/zsh

echo '{"method":"tools/list","params":{},"jsonrpc":"2.0","id":6}' | node index.js
echo '{"method":"prompts/list","params":{},"jsonrpc":"2.0","id":6}' | node index.js
echo '{"method":"resources/list","params":{},"jsonrpc":"2.0","id":6}' | node index.js
