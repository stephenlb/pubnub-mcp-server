#!/usr/bin/env python3
"""Update Docker Hub repository overview (full description) using local README.md"""

import os
import sys
import argparse
import json
import urllib.request
import urllib.error

def get_token(username, password):
    url = "https://hub.docker.com/v2/users/login/"
    payload = {"username": username, "password": password}
    data_bytes = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data_bytes,
                                 headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        msg = e.read().decode('utf-8') if hasattr(e, 'read') else ''
        print(f"Error obtaining token: {e.code} {e.reason} {msg}", file=sys.stderr)
        sys.exit(1)
    data = json.loads(body)
    token = data.get('token')
    if not token:
        print("Token not found in response.", file=sys.stderr)
        sys.exit(1)
    return token

def update_full_description(namespace, repository, token, description):
    url = f"https://hub.docker.com/v2/repositories/{namespace}/{repository}/"
    headers = {
        "Content-Type": "application/json",
    }
    payload = {"full_description": description}
    data_bytes = json.dumps(payload).encode('utf-8')
    headers['Authorization'] = f"JWT {token}"
    req = urllib.request.Request(url, data=data_bytes, method='PATCH', headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            pass
    except urllib.error.HTTPError as e:
        msg = e.read().decode('utf-8') if hasattr(e, 'read') else ''
        print(f"Error updating overview: {e.code} {e.reason} {msg}", file=sys.stderr)
        sys.exit(1)
    print("Overview updated successfully.")

def main():
    parser = argparse.ArgumentParser(description="Update Docker Hub overview with a README.md file.")
    parser.add_argument("--namespace", default="pubnub",
                        help="Docker Hub namespace (default: pubnub)")
    parser.add_argument("--repository", default="pubnub-mcp-server",
                        help="Docker Hub repository name (default: pubnub-mcp-server)")
    parser.add_argument("--file", default="README.md",
                        help="Path to README file to use as overview (default: README.md)")
    parser.add_argument("--token",
                        help="Docker Hub API token (env: DOCKERHUB_TOKEN)")
    parser.add_argument("--username",
                        help="Docker Hub username (env: DOCKERHUB_USERNAME)")
    parser.add_argument("--password",
                        help="Docker Hub password (env: DOCKERHUB_PASSWORD)")

    args = parser.parse_args()

    token = args.token or os.environ.get("DOCKERHUB_TOKEN")
    if not token:
        username = args.username or os.environ.get("DOCKERHUB_USERNAME")
        password = args.password or os.environ.get("DOCKERHUB_PASSWORD")
        if not username or not password:
            parser.error("Either --token or both --username and --password (or env vars) must be provided.")
        token = get_token(username, password)

    try:
        with open(args.file, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {args.file}: {e}", file=sys.stderr)
        sys.exit(1)

    update_full_description(args.namespace, args.repository, token, content)

if __name__ == "__main__":
    main()