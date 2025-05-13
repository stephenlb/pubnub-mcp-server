# How to Send Large Messages with PubNub (Up to 32KB)

PubNub supports sending messages up to a maximum size of **32,768 bytes (32 KiB)**. This limit applies to the UTF-8 encoded payload of the message. While this is a generous limit for many real-time use cases, here's how to work with larger messages effectively and what to consider.

## Understanding the 32KB Limit

*   **Payload Data:** The 32KB limit refers to the actual data you are sending in the `message` field of your publish call after it has been serialized (e.g., to a JSON string) and UTF-8 encoded.
*   **Not Just Text:** While often used for text-based JSON, this limit applies whether your payload represents structured data, a simple string, or even a Base64 encoded binary.
*   **Overhead:** PubNub SDKs and the PubNub network add some minimal overhead for message envelope information (channel name, timetoken, publisher ID, etc.), but the 32KB is specifically for your message content.

## Strategies for Sending Larger Data (Within the 32KB Limit)

If your data is approaching or might exceed the 32KB limit, consider these strategies before resorting to splitting messages:

1.  **Optimize Your Payload:**
    *   **Remove Non-Essential Data:** Ensure you are only sending data that is absolutely necessary for the real-time update.
    *   **Use Concise Keys (for JSON):** Shorter keys in JSON objects result in a smaller stringified representation.
    *   **Data Normalization:** Avoid sending redundant data that clients might already have or can derive.
    *   **Consider Data Types:** Sending numbers is usually more compact than sending their string representations if they don't need to be strings.

2.  **Compression (Application Level):**
    *   If your payload is highly compressible (e.g., verbose text or JSON), you can compress it on the client-side before publishing and decompress it on the receiving client-side.
    *   **Libraries:** Use standard compression libraries (like zlib/gzip through pako.js in JavaScript, or built-in modules in other languages).
    *   **Process:**
        1.  Publisher: `original_data` -> `compress(original_data)` -> `base64_encode(compressed_data)` -> Publish this string.
        2.  Subscriber: Receive string -> `base64_decode(received_string)` -> `decompress(decoded_data)` -> `original_data`.
    *   **Note:** Base64 encoding will increase the size of the compressed data by about 33%, so the compression must be significant enough to overcome this and still fit within 32KB.

## What If My Data Is Still Larger Than 32KB? 

If your data inherently cannot fit within a single 32KB message even after optimization and compression, you will need to split it into multiple smaller chunks. PubNub does **not** automatically handle message splitting and reassembly for payloads larger than 32KB. This logic must be implemented in your application.

**Chunking Strategy:**

1.  **Define a Chunking Protocol:**
    *   **Metadata:** Each chunk needs metadata to allow the receiver to reassemble the full message. 

2.  **Publisher Logic:**
    *   Generate a unique `messageId`.
    *   Split the large data into segments, each (after encoding, e.g., Base64 if binary) fitting well within the 32KB limit (e.g., aim for 28-30KB per chunk to be safe).
    *   Determine `totalChunks`.
    *   Publish each chunk as a separate PubNub message, including the metadata. Consider publishing to the same channel or a dedicated channel for chunks.

3.  **Subscriber Logic:**
    *   Listen for incoming chunk messages.
    *   Buffer chunks locally, grouped by `messageId`.
    *   Keep track of received `chunkIndex` for each `messageId`.
    *   Once all `totalChunks` for a given `messageId` have been received:
        1.  Order the chunks by `chunkIndex`.
        2.  Concatenate the `data` from each chunk.
        3.  Decode/decompress if necessary.
        4.  Process the fully reassembled large message.
    *   **Error Handling/Timeouts:** Implement logic to handle missing chunks or timeouts (e.g., if not all chunks arrive within a certain period, discard the partial message).

**Considerations for Chunking:**

*   **Complexity:** Adds significant complexity to both publisher and subscriber logic.
*   **Latency:** The full message is only available after all chunks have arrived, increasing perceived latency.
*   **Error Handling:** Robustly handling lost or out-of-order chunks is critical.
*   **Alternative: PubNub File Sharing:** If the "large message" is actually a file, consider using PubNub's File Sharing API instead, which is designed for file transfers (up to 5MB by default, potentially larger for some plans). You publish a message announcing the file, and clients download it directly. This is often simpler than manual chunking for file-like data.

For most real-time updates, keeping messages under 32KB is ideal. If dealing with larger data entities, first explore optimization and compression. If chunking is necessary, plan its implementation carefully. If the data is a file, PubNub's File Sharing feature is usually a better fit.

