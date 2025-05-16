# How to Optimize Mobile Battery Usage with PubNub

PubNub is designed with mobile battery efficiency in mind, but developers can further optimize their applications to minimize power consumption on battery-operated devices.

## PubNub's Built-in Optimizations

PubNub SDKs and the network employ several strategies by default to be battery-friendly:

1.  **Long-Lived Connections:** Instead of frequent new connections (which are power-intensive), PubNub establishes long-lived, persistent TCP socket connections. These connections can be kept alive for extended periods (e.g., one hour by default for some SDKs) with minimal keep-alive traffic.
2.  **Efficient Keep-Alives:** To maintain the connection through NATs and firewalls, periodic keep-alive messages (pings) are sent. These are typically infrequent (e.g., every 5 minutes) and very small, minimizing data transfer and radio usage.
3.  **Automatic Transport Selection:** PubNub SDKs intelligently choose the best available transport protocol for the current network environment. Efficient protocols reduce overhead and data usage.
4.  **Low Bandwidth Overhead:** The PubNub protocol itself is designed to be lightweight, adding minimal overhead to your message data.

## Developer Tips for Further Battery Savings

While PubNub handles much of the optimization, you can make choices in your application design to further conserve battery:

1.  **Keep Message Payloads Compact:**
    *   **Send Only Essential Data:** The smaller the message, the less data needs to be transmitted, and the less time the device's radio needs to be active.
    *   **Use Concise Field Names:** In JSON objects, shorter keys mean smaller overall message size.
    *   **Consider Data Serialization:** For very high-volume data, explore binary serialization formats if appropriate, though PubNub handles JSON efficiently.

2.  **Aggregate Payloads (Batching):**
    *   If your application needs to send many small pieces of information frequently, consider aggregating them into fewer, slightly larger messages. This reduces the number of publish operations and can be more efficient than many tiny transmissions. For example, send a batch of sensor readings every few seconds instead of individual readings every few milliseconds.

3.  **Use Stream Controller Features Efficiently:**
    *   **Multiplexing:** If a client needs to subscribe to multiple channels (e.g., up to 10-30 channels), use the SDK's multiplexing capability to subscribe to all of them over a single TCP connection. This is far more battery-efficient than creating a separate connection for each channel.
    *   **Channel Groups:** When subscribing to a large number of channels (hundreds or thousands), use Channel Groups. 

4.  **Smart Subscription Management:**
    *   **Subscribe Only When Needed:** Only subscribe to channels when the application is active and the user needs real-time updates for that specific content. Unsubscribe from channels that are no longer relevant to the current application view or state.
    *   **Background Behavior:** Be mindful of background activity. While PubNub connections can persist in the background on some mobile OSes, continuous background data transfer can drain the battery. Consider if real-time updates are truly needed when the app is not in the foreground. For critical background updates, mobile push notifications (APNS/FCM) might be a more battery-efficient complement for waking the app.

5.  **Manage Presence Subscriptions Wisely:**
    *   Subscribing to presence events on channels with very high occupancy can lead to a lot of presence messages. If detailed presence for thousands of users isn't critical, consider subscribing to presence only on smaller, more relevant channels, or use summary presence information if available.

6.  **Connection `restore` Setting:**
    *   The `restore: true` setting (often default) in PubNub SDKs helps catch up on missed messages after a reconnection. While generally good, if the disconnected period was long and many messages accumulated, fetching them all could use a burst of data. This is usually minor but a consideration for extreme cases.

7.  **Leverage Mobile OS Power-Saving Features:**
    *   Align your app's PubNub activity with platform best practices for background tasks and network access on iOS and Android.

By combining PubNub's inherent efficiencies with these application-level strategies, you can build real-time mobile applications that are both responsive and considerate of user battery life.

