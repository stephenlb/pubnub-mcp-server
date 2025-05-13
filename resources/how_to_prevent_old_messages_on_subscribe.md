# How to Prevent Old Published Messages from Reaching Subscribers Upon (Re)Connect

When a PubNub client subscribes or resubscribes to a channel, you might want to control whether it receives messages that were published while it was offline or before its current subscription. 

## PubNub's Default "Catch-Up" Behavior

By default, when a PubNub client SDK connects and subscribes to a channel (or reconnects after a temporary disconnection), it attempts to "catch up" on messages it might have missed.

*   **Mechanism:** The SDK usually stores the timetoken of the last successfully received message. Upon reconnection, it subscribes using this timetoken, and PubNub's servers send any messages published after that timetoken.
*   **Short-Term Cache:** PubNub servers maintain a short-term in-memory cache (or "message buffer") for each channel, typically holding the last 100 messages or messages published within the last ~2-20 minutes (this can vary and messages are pushed out if the publish rate is high). The default catch-up uses this cache.

This default behavior is often desirable as it ensures users don't miss recent activity during brief network hiccups.

## Preventing Old Messages from the Short-Term Cache

If you want a client to *only* receive messages published *from the moment it successfully subscribes forward*, and ignore any messages waiting in the short-term server cache from a previous session or disconnect, you can use the `restore` option (or its equivalent in your specific SDK).

1.  **Set `restore: false` (or equivalent):**
    *   When initializing your PubNub client instance or when making a subscribe call, look for a parameter typically named `restore` (common in JavaScript SDKs) or a similar configuration option related to "resuming" or "catching up" subscriptions.
    *   Setting this to `false` tells the SDK not to attempt to use the last known timetoken to retrieve missed messages from the short-term cache upon connecting/reconnecting. The client will effectively subscribe from the current time ("now").

    **Example (Conceptual JavaScript SDK):**
    ```javascript
    var pubnub = new PubNub({
      subscribeKey: "YOUR_SUBSCRIBE_KEY",
      userId: "someUserId",
      restore: false // This will prevent catch-up from the short-term cache
    });

    pubnub.subscribe({
      channels: ['my_channel']
    });
    ```
    *Consult your specific SDK's documentation for the exact parameter name and usage.*

## Ignoring Messages Based on Timestamps (Application-Level Logic)

Even if the SDK delivers messages from the cache, you can implement client-side logic to ignore messages that are too old based on your application's definition of "old."

1.  **Include a Timestamp in Your Messages:** When publishing messages, include a UTC timestamp in the message payload.
    ```javascript
    // Publisher
    let messagePayload = {
      text: "Hello from " + senderName,
      timestamp_ms: Date.now() // Milliseconds since epoch, UTC
    };
    pubnub.publish({ channel: 'my_channel', message: messagePayload });
    ```
    Or, as in the example PHP code snippet:
    ```php
    // $t = time() . ""; // Seconds since epoch as string
    // $m = array("serial" => $t, "payload" => "Hello from PHP! " . 

2.  **Client-Side Filtering:** When a subscriber receives a message, it checks the timestamp in the payload.
    *   The client decides on a staleness threshold (e.g., ignore messages older than 60 seconds).
    *   If `(Date.now() - receivedMessage.timestamp_ms) > 60000`, then the client can choose to discard the message or handle it differently (e.g., display it as an "older message").

    ```javascript
    // Subscriber (JavaScript conceptual)
    pubnub.addListener({
      message: function(messageEvent) {
        const STALE_THRESHOLD_MS = 60000; // 60 seconds
        const messageTimestamp = messageEvent.message.timestamp_ms; // Assuming this field exists

        if (messageTimestamp && (Date.now() - messageTimestamp) > STALE_THRESHOLD_MS) {
          console.log("Ignoring stale message:", messageEvent.message);
          return; // Don't process further
        }

        // Process fresh message
        console.log("Processing fresh message:", messageEvent.message);
      }
    });
    ```

This timestamping approach gives you fine-grained control within your application logic.

## Interaction with Message Persistence (History)

*   **`restore: false`** primarily affects the automatic catch-up from the short-term, volatile server-side cache.
*   It does **not** prevent you from explicitly fetching older messages using the PubNub History API if Message Persistence is enabled on your keyset. If you want to load historical context when a user opens a chat room, you would make a separate history call, regardless of the `restore` setting.

Choose the method that best suits your application's requirements for message delivery upon connection or reconnection. Using `restore: false` is a direct SDK-level instruction, while timestamp-based filtering provides application-level control.

