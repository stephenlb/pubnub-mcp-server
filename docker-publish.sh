#!/bin/bash
#docker tag pubnub-mcp-server stephenlb/pubnub-mcp-server:latest
#docker push stephenlb/pubnub-mcp-server:latest
#docker buildx create --name multiarch --driver docker-container --use
docker buildx use multiarch
docker buildx build --platform linux/arm64,linux/amd64 -t pubnub/pubnub-mcp-server:latest --push .
