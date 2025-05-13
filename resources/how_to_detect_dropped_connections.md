# How to Detect and Manage Dropped Connections in PubNub

PubNub SDKs are designed to manage network connections robustly, including automatic detection of dropped connections and attempts to reconnect. As a developer, your role is to leverage the status events provided by the SDK to react appropriately in your application's UI and logic.

## PubNub SDK Connection Management

*   **Automatic Reconnection:** PubNub SDKs automatically handle temporary network interruptions (e.g., switching from Wi-Fi to cellular, brief outages). They will attempt to re-establish the connection and resubscribe to channels with the correct timetoken to catch up on missed messages (if `restore: true` is set, which is often the default).
*   **Status Events:** The primary way to detect and react to connection status changes, including drops, is by listening to status events emitted by the PubNub SDK instance.

## Listening to Status Events

All PubNub SDKs provide a mechanism to add listeners for status events. The exact syntax varies by SDK, but the concept is similar.

**Common Status Event Types You'll Encounter:**

*   **`PNConnectedCategory` (or similar "Connected" event):** Fired when the client successfully connects or reconnects to PubNub.
*   **`PNDisconnectedCategory` (or similar "Disconnected" event):** Fired when the client loses its connection to PubNub. This could be due to network issues, the client going offline, etc.
*   **`PNReconnectedCategory` (or similar "Reconnected" event):** Often a specific type of connected event indicating the SDK has successfully reconnected after a drop.
*   **`PNNetworkIssuesCategory` / `PNTimeoutCategory` (or similar):** May indicate specific network problems or timeouts encountered during subscribe attempts.
*   **`PNAccessDeniedCategory`:** Fired if connection is denied due to permissions issues (e.g., invalid auth-key with PAM).
*   **`PNNetworkUpCategory` / `PNNetworkDownCategory`:** Some SDKs provide explicit events when the client's local network interface goes up or down.

**Example (Conceptual JavaScript SDK Listener):**
```javascript
// var pubnub = new PubNub({ /* ... your config ... 

pubnub.addListener({
  status: function(statusEvent) {
    if (statusEvent.category === "PNConnectedCategory") {
      console.log("Successfully connected to PubNub!");
      // Your app logic for when connection is established
      // e.g., enable UI elements, fetch initial data
    } else if (statusEvent.category === "PNReconnectedCategory") {
      console.log("Successfully reconnected to PubNub!");
      // Your app logic for when connection is re-established
    } else if (statusEvent.category === "PNDisconnectedCategory") {
      console.warn("Disconnected from PubNub. Will attempt to reconnect.");
      // Your app logic for when connection is lost
      // e.g., show a "connecting..." message, disable chat input
      // The SDK will automatically try to reconnect.
    } else if (statusEvent.category === "PNNetworkDownCategory") {
      console.error("Network is down. PubNub connection lost.");
      // Notify user that their local network is unavailable
    } else if (statusEvent.category === "PNNetworkUpCategory") {
      console.log("Network is back up. PubNub will attempt to reconnect.");
    } else if (statusEvent.category === "PNAccessDeniedCategory") {
      console.error("Access Denied. 

// Remember to subscribe to channels to activate the connection
// pubnub.subscribe({ channels: ['my_channel'] });
```

## Application Logic for Dropped Connections

When you detect a `PNDisconnectedCategory` or similar event:

1.  **Notify the User:** Inform the user that the connection has been lost and the application is attempting to reconnect (e.g., display a banner, a spinner, or disable input fields).
2.  **Graceful Degradation:** Your application might need to temporarily disable features that rely on a live PubNub connection.
3.  **Rely on SDK Reconnection:** Trust the SDK to handle the reconnection attempts. You generally don't need to implement your own reconnection loop.
4.  **Handle Reconnection:** When a `PNConnectedCategory` or `PNReconnectedCategory` event occurs:
    *   Remove any "disconnected" UI indicators.
    *   Re-enable features.
    *   The SDK typically tries to "catch up" on messages published while disconnected (up to the history limit of the channel or if Message Persistence is used with history calls).

## "Catching Up" on Missed Messages

*   **Default Behavior:** When a client resubscribes after a disconnect, PubNub attempts to deliver messages published since the client's last known timetoken. This covers short-term disconnects (messages are typically held in a short-term cache for up to 20 minutes or 100 messages).
*   **`restore: false`:** If you initialize the PubNub object with `restore: false` (or a similar setting in your SDK), the client will *not* automatically receive messages published while it was disconnected upon resubscribing. It will only get new messages from that point forward.
*   **Message Persistence (History API):** For longer disconnects or to guarantee message retrieval, enable the Message Persistence add-on for your keyset. After reconnecting, you can use the History API to fetch messages that were published during the offline period, beyond what the default catch-up mechanism provides.

## Official Documentation

For detailed information on connection management, specific status event names, and best practices for your particular SDK, always refer to the official PubNub documentation for that SDK:
*   **Connection Management Docs:** [https://www.pubnub.com/docs/sdks/](https://www.pubnub.com/docs/sdks/) (select your SDK and look for sections on "Connection Management," "Status Events," or "Event Listeners").

If you have persistent or unusual connection issues, contact PubNub Support ([support@pubnub.com](mailto:support@pubnub.com)) with relevant logs and details about your SDK version and network environment.

