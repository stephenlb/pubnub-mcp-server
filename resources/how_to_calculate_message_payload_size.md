# How to Calculate PubNub Message Payload Size Before Publishing

PubNub messages can be up to **32,768 bytes (32 KiB)** in size. It's important to ensure your messages do not exceed this limit to avoid "Message Too Large" errors from the PubNub network. Calculating the approximate size of your message payload before publishing can help prevent these errors.

## Understanding What Contributes to Message Size

The 32KB limit generally applies to the UTF-8 encoded string representation of your message payload *as it's sent over the network*. For JSON objects, this means the stringified JSON, including keys, values, and structural characters like braces `{}`, brackets `[]`, quotes `""`, and commas `,`.

While the PubNub documentation often focuses on the payload itself, the URL used for publishing also has length limits imposed by proxies and servers. The channel name and other URL parameters contribute to the overall length of the HTTP request. SDKs typically handle this, but if you are crafting raw HTTP requests or have extremely long channel names, this is a background consideration. The 32KB specifically refers to the *message data segment* of the publish request.

## Calculating Size for JSON Messages

For messages that are JSON objects or arrays, the most common way to estimate size is to:
1.  Convert the JSON object/array to its string representation.
2.  Calculate the byte length of that UTF-8 string.

**Example JavaScript Function:**

This function provides a reasonable estimate for JSON messages. It simulates how the channel name and the JSON message might be encoded in a URL, adding a small buffer for other overhead.

