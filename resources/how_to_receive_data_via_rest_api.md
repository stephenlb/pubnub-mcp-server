# How to Receive Data (Subscribe) Using the PubNub REST API

While PubNub strongly recommends using its official SDKs for their robustness, built-in features (like automatic reconnection, error handling, and message formatting), and ease of use, it is possible to subscribe to PubNub channels and receive messages directly using the PubNub REST API. This approach requires manual handling of the subscribe loop and connection management.

## The Subscribe Cycle with REST

Subscribing via the REST API involves making a series of long-polling HTTP GET requests. 

1.  **Initial Subscribe Request:**
    *   Make an HTTP GET request to the PubNub subscribe endpoint.
    *   **Endpoint Format (Simplified):**
        `https://<your-subscribe-key>.pndsn.com/v2/subscribe/<your-subscribe-key>/<channel-list>/0?uuid=<your-uuid>&tt=<timetoken>[&pnsdk=<your-client-name>]`
    *   **Key Components:**
        *   `<your-subscribe-key>`: Your PubNub Subscribe Key.
        *   `<channel-list>`: A comma-separated list of channels to subscribe to (e.g., `channel1,channel2`). Ensure channel names are URL-encoded if they contain special characters (though it's best to use simple channel names).
        *   `uuid=<your-uuid>`: A unique identifier for this client.
        *   `tt=<timetoken>`: The timetoken. For the very first request to a channel, use `0`. For subsequent requests, use the timetoken received in the previous response.
        *   `pnsdk=<your-client-name>` (Optional but Recommended): A string identifying your client (e.g., `MyCustomRESTClient-v1.0`). This helps in debugging and analytics.
        *   Other optional parameters: `auth` (for auth-key if PAM is enabled), `channel-group` (for channel group subscriptions), `tr` (region parameter).

2.  **Long Poll:**
    *   The PubNub server will hold this GET request open until:
        *   A message is published to one of the subscribed channels.
        *   A timeout occurs on the server side (this is normal and part of the long-polling mechanism, typically around 310 seconds).
        *   A presence event occurs (if subscribed to presence).

3.  **Receiving the Response:**
    *   When an event occurs or the long poll times out, the server sends a JSON response.
    *   **Response Format (Simplified):**
        ```json
        {
          "t": {
            "t": "16170000001234567", // Timetoken for the next request
            "r": 1 // Region ID
          },
          "m": [
            // Array of messages, if any
            {
              "a": "4", // Publisher's client ID (shard)
              "f": 0,   // Message flags
              "i": "ClientUUID-publisher", // Publisher's UUID
              "p": {
                "t": "16170000000000000" // Original publish timetoken
              },
              "k": "your-subscribe-key",
              "c": "channel1", // Channel the message was on
              "d": { "text": "Hello world" } // The actual message payload
            }
            // ... more messages
          ]
        }
        ```
    *   **Key parts of the response:**
        *   `t.t`: The **new timetoken**. You **must** use this timetoken in your next subscribe request to ensure you don't miss messages or receive duplicates.
        *   `m`: An array of message objects. Each object contains the message payload (`d`), the channel it was published on (`c`), the publisher's UUID (`i`), and other metadata.

4.  **Processing Messages:**
    *   Parse the JSON response.
    *   Iterate through the `m` array and process each message.

5.  **Immediate Resubscribe:**
    *   **Crucially**, as soon as you receive a response (or if your client-side request times out or errors), you must immediately make a new HTTP GET subscribe request using the **new timetoken** (`t.t`) received in the previous response.
    *   This continuous cycle of request-response-resubscribe forms the subscribe loop.

## Important Considerations for REST API Subscription

*   **Timetoken Management:** Correctly extracting and using the new timetoken from each response for the subsequent request is critical for message continuity.
*   **Error Handling:** You must implement robust error handling for network errors, HTTP errors (e.g., 4xx, 5xx status codes), request timeouts on the client side, and malformed JSON responses.
*   **Reconnection Logic:** If a request fails, you need to implement logic to retry the subscribe request, potentially with backoff strategies.
*   **No Automatic Catch-up (Beyond Timetoken):** The REST API provides messages based on the timetoken. It doesn't have the advanced "catch-up" and message replay logic that SDKs often provide for more extended disconnects unless you manually implement history calls.
*   **Presence:** To receive presence events, you need to subscribe to the presence channel variant (e.g., `channel1-pnpres`). The presence event structure will be different from regular messages.
*   **Access Manager (PAM):** If PAM is enabled on your keyset, you'll need to include the `auth` parameter with a valid auth-key in your subscribe requests. The auth-key itself will also need `read` permission on the channels.
*   **HTTPS:** Always use HTTPS for secure communication.
*   **Complexity:** Implementing a reliable PubNub subscriber via the REST API is significantly more complex than using an SDK due to the need to manually handle all aspects of the subscribe loop, error conditions, and connection state.

For detailed specifications of the REST API endpoints, parameters, and response formats, refer to the official PubNub REST API documentation on the PubNub developer portal. If you need assistance, contact PubNub Support at [support@pubnub.com](mailto:support@pubnub.com).

