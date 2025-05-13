# How to Manage Concurrent Connections with PubNub

PubNub is designed to support a massive number of concurrent connections, making it suitable for applications with large user bases. 

## PubNub's Capacity

*   **Millions of Connections:** PubNub can support millions of concurrent connections (devices/users). Many customers have millions of users connecting and exchanging messages, leading to billions or even trillions of transactions.
*   **No Hard Limits (Generally):** PubNub does not impose hard limits on the number of concurrent users connected to the platform overall.
    *   For PubNub Chat, while there's no limit on total concurrent users, it's recommended to limit online users in a *single chat room or space* to around 10,000 for optimal performance. For larger groups, consider sharding users into multiple spaces.
*   **Horizontal Scalability:** PubNub's infrastructure is built to scale horizontally, automatically handling spikes in traffic and ensuring consistent performance even during surges.

## When to Contact PubNub

*   If your application anticipates having **more than 1000 concurrent connections (devices/users) regularly**, it's recommended to contact PubNub.
*   **Benefits:**
    *   Discuss a Pro plan for potential volume discounts.
    *   Request a best practice architecture review with a PubNub expert to optimize your application for scale.
*   **Contact:** [PubNub Support](mailto:support@pubnub.com) or your dedicated account manager.

## Technical Aspects of Connections

*   **Connection Definition:** A "connection" in PubNub refers to an active client (e.g., a mobile app, browser, or IoT device) that is subscribed to one or more channels.
*   **Efficient Protocols:** PubNub utilizes efficient protocols like WebSockets and HTTP/2, enabling lightweight, persistent connections that reduce overhead and optimize bandwidth. This is crucial for supporting high concurrency.
*   **Long-Lived Keep-Alive Connections:** PubNub SDKs typically establish long-lived connections (e.g., one hour keep-alive, with pings every 5 minutes) to maintain connectivity efficiently, which is particularly important for mobile battery life.
*   **TCP Sockets:** Each PubNub client instance generally creates a small number of TCP socket connections (e.g., often two: one for subscribes and another for non-subscribe operations like publish, history, etc.).
*   **Global Edge Network:** PubNub's 15+ globally distributed data centers (Points of Presence - PoPs) ensure that users connect to the nearest server, minimizing latency and distributing connection load.

## Browser Connection Limits and Custom Origins

*   **Browser Limits:** Browsers impose their own limits on the number of concurrent connections a single tab can make to a specific hostname (e.g., Chrome typically allows 6 connections per hostname).
*   **Custom Origin:** If your application makes many types of requests to PubNub from the same client (beyond just a single subscribe loop), or if you have multiple PubNub instances in one page, you might approach these browser limits. A custom origin (e.g., `yoursubdomain.pubnubapi.com`) can help by allowing PubNub to route traffic per customer more effectively. While not a direct solution for browser per-hostname limits, it's part of a robust scaling strategy.
    *   Refer to "Custom origin - what is it and how to use it" in `pubnub_troubleshooting.md` for more details on requesting one.

## Best Practices for High Concurrency

*   **Efficient Channel Subscriptions:**
    *   Use **Multiplexing** to subscribe to multiple channels (up to ~30) over a single connection.
    *   For larger numbers of channels, use **Channel Groups** (up to 2,000 channels per group, 10 groups per client).
    *   Employ **Wildcard Subscriptions** for hierarchical channel structures.
*   **Optimize Message Payloads:** Keep messages small to reduce bandwidth and processing load per connection.
*   **Connection Management in SDKs:** Rely on the PubNub SDKs to manage connection establishment, keep-alives, and reconnections. Implement listeners for connection status events to handle them gracefully in your application.
*   **Presence Management:** For applications needing to know who is online, use PubNub's Presence feature efficiently. Be mindful of the number of presence events generated in very large channels.
*   **Authentication and Authorization:** Secure your connections and channels using PubNub Access Manager, especially at scale.

