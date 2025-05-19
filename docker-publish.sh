#!/bin/bash
docker push stephenlb/pubnub-mcp-server:latest
docker tag pubnub-mcp-server stephenlb/pubnub-mcp-server:latest
docker buildx build --platform linux/arm64 -t stephenlb/pubnub-mcp-server:latest --push .
