# How to Use Stream Controller with PubNub (Multiplexing, Channel Groups, Wildcard Subscribe)

PubNub's Stream Controller is an add-on feature that allows a single client connection to efficiently subscribe to multiple channels, or even a dynamic set of channels, without needing to establish a separate TCP connection for each. This is crucial for scalability, performance, and reducing resource usage on both the client and server.

Stream Controller encompasses three main capabilities:
1.  **Channel Multiplexing (Subscribing to multiple named channels)**
2.  **Channel Groups**
3.  **Wildcard Subscribe**

**Enabling Stream Controller:**
To use Channel Groups and Wildcard Subscribe, you typically need to enable the "Stream Controller" add-on for your keyset in the PubNub Admin Portal. Basic multiplexing (subscribing to a list of channels) is often a core SDK capability.

## 1. Channel Multiplexing (Subscribing to multiple named channels)

*   **Concept:** A single PubNub client instance can subscribe to a list of specific channel names in one subscribe call. All messages from these channels will be delivered over the same underlying network connection.
*   **Usage:**
    ```javascript
    // JavaScript SDK Example
    pubnub.subscribe({
      channels: ['news_updates', 'sports_scores', 'weather_alerts_sf']
    });
    ```
*   **Recommended Limit:** While you can subscribe to many channels this way, PubNub generally recommends multiplexing **up to 10-30 channels** per client for optimal performance. For larger numbers, Channel Groups are preferred.
*   **Use Cases:** When a client needs to listen to a relatively small, known set of channels.

## 2. Channel Groups

*   **Concept:** A Channel Group is a named collection of channels managed on the PubNub server. A client subscribes to the Channel Group name, and PubNub delivers messages from all channels currently in that group to the client over a single connection.
*   **Key Features:**
    *   **Scalability:** Subscribe to thousands of channels via a few group subscriptions.
        *   Add up to **2,000 channels** to a single channel group (this limit can sometimes be adjusted via the Admin Portal or support for paid plans).
        *   Each client can subscribe to up to **10 channel groups**.
        *   This allows a client to effectively listen to up to 20,000 channels (10 groups * 2,000 channels/group).
    *   **Dynamic Management:** Channels can be added to or removed from a group dynamically by your server or authorized clients, without the subscribing clients needing to change their subscription list.
    *   **No Publishing to Groups:** You cannot publish a message directly *to* a channel group name. You publish to the individual channels *within* the group.
*   **Usage:**
    *   **Adding Channels to a Group (usually server-side or admin client):**
        ```javascript
        // JavaScript SDK Example
        pubnub.channelGroups.addChannels(
          {
            channels: ['user_A_feed', 'user_B_feed', 'project_X_updates'],
            channelGroup: "my_aggregated_feed"
          },
          function(status) { /* ... handle status ... */ }
        );
        ```
    *   **Subscribing to a Channel Group (client-side):**
        ```javascript
        // JavaScript SDK Example
        pubnub.subscribe({
          channelGroups: ["my_aggregated_feed", "global_announcements_group"]
        });
        ```
*   **Important:** A channel group must have at least one channel added to it before a client attempts to subscribe to it. Subscribing to an empty channel group will result in a 400 error. Removing the last channel from a group a client is subscribed to can also cause issues.
*   **Use Cases:** User-specific news feeds, topic-based aggregations, managing large numbers of per-user or per-device channels.

## 3. Wildcard Subscribe

*   **Concept:** Allows a client to subscribe to all channels that match a specified pattern using a wildcard (`*`). The period (`.`) is used as a delimiter for hierarchy.
*   **Pattern Rules:**
    *   The wildcard pattern must end with `.*`.
    *   You can have up to **two dots (three levels deep)** in your pattern.
        *   Valid: `news.*`, `sports.scores.*`, `users.user123.status.*`
        *   Invalid: `news.sports.cricket.*` (too many levels for some older interpretations, though some modern systems might support more; always test), `news.*.updates` (asterisk not at the end).
*   **Usage:**
    ```javascript
    // JavaScript SDK Example
    pubnub.subscribe({
      channels: ['stocks.*'] // Subscribes to stocks.aapl, stocks.goog, stocks.tech.msft, etc.
    });
    ```
*   **No Publishing to Wildcards:** You cannot publish a message directly *to* a wildcard pattern (e.g., you can't publish to `stocks.*`). You publish to the specific channels that match the pattern (e.g., `stocks.aapl`).
*   **Cannot be in Channel Groups:** Wildcard channel patterns cannot be added to Channel Groups.
*   **Use Cases:** Hierarchical data, IoT sensor data (e.g., `sensors.floor1.temp.*`), location tracking based on grids (e.g., `geo.grid_A1.*`).

## Benefits of Stream Controller

*   **Reduced Client Resources:** Fewer open network connections mean less memory, CPU, and battery usage on the client device.
*   **Improved Performance:** Reduces connection management overhead.
*   **Scalability:** Enables applications to handle a vast number of information streams efficiently.

By leveraging these Stream Controller features, you can build more sophisticated and scalable real-time applications. Remember to enable Stream Controller in your PubNub Admin Portal for Channel Groups and Wildcard Subscribe functionality.

