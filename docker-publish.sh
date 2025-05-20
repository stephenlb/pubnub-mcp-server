#!/bin/bash
#docker tag pubnub-mcp-server stephenlb/pubnub-mcp-server:latest
#docker push stephenlb/pubnub-mcp-server:latest
#docker buildx create --name multiarch --driver docker-container --use
docker buildx build --platform linux/amd64,linux/arm64 -t stephenlb/pubnub-mcp-server:latest --push .
