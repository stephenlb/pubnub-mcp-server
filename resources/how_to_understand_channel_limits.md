# Understanding PubNub Channel Limits and Usage

PubNub offers a flexible and scalable channel system. Here's a breakdown of limits, capabilities, and best practices related to channels, channel groups, and wildcard subscriptions.

## General Channel Capabilities

*   **Number of Channels:** There is **no limit** to the number of channels your application can use within a PubNub key set. Channels are created dynamically when a message is published to an arbitrary channel name or when a client subscribes to it.
*   **Cost:** There is no additional cost associated with the number of channels used.
*   **Users per Channel:** There is generally no hard limit to the number of users (subscribers) in a single channel. PubNub can support broadcasting to millions of users on a single channel.
    *   **Performance Note for Chat:** For optimal performance in interactive chat rooms, it's recommended to keep the number of *active online users* in a single chat channel to around 10,000. For larger audiences, consider sharding or using broadcast-only channels.
*   **Messages per Channel:** A channel can handle an unlimited number of published messages.
    *   **Short-Term Cache (Message Buffer):** Each channel (or multiplexed connection) has an in-memory queue that retains the last 100 messages published to it for a short period (up to 20 minutes, but messages can be pushed off sooner if the publish rate is high). This limit is configurable for your sub-key by contacting PubNub support.
*   **Channel Name Length:** Up to 92 characters.
*   **Valid Channel Name Characters:**
    *   UTF-8 compatible.
    *   **Invalid Characters:** Comma (,), Colon (:), Asterisk (*), Slash (/), Backslash (\\), Space, Unicode zero, Non-printable ASCII control characters.
    *   The period (.) is not invalid but is reserved for special features like Wildcard Subscribe and Function bindings. Avoid using it unless intentionally leveraging these features.

## Multiplexing (Subscribing to Multiple Channels)

*   **Capability:** A single client connection can subscribe to multiple channels simultaneously.
*   **Recommended Limit:** PubNub recommends multiplexing **no more than 30 channels** per subscribe call for optimal performance, and possibly fewer for larger applications. While some documentation mentions 10-50 or a hard limit of 100 in SDKs, sticking to the lower end is safer for general use.
*   **Usage:** Designed for scenarios where a client needs to listen to a relatively small, dynamic set of channels.

## Channel Groups (Stream Controller Add-on)

*To use Channel Groups, the Stream Controller add-on must be enabled for your keyset in the Admin Portal.*

*   **Purpose:** Allows a client to subscribe to a large number of channels using a single identifier (the channel group name). The list of channels within a group is managed on the server.
*   **Channels per Channel Group:**
    *   You can add up to **2,000 channels** to a single channel group (default might be 100 or 1,000 for some keys; paid accounts can modify this limit in the Admin Portal or by contacting support).
*   **Channel Groups per Client:** Each client (PubNub instance) can subscribe to a maximum of **10 channel groups**.
*   **Total Channels via Channel Groups:** This allows a single client to subscribe to up to 20,000 channels (10 groups * 2,000 channels/group).
*   **Publishing:** You **cannot** publish directly to a channel group. You publish to the individual channels within the group.
*   **Management:** Channels can be added to or removed from a channel group by your server or authorized clients.

## Wildcard Subscribe (Stream Controller Add-on)

*To use Wildcard Subscribe, the Stream Controller add-on must be enabled for your keyset in the Admin Portal.*

*   **Purpose:** Allows a client to subscribe to all channels that match a specific pattern (e.g., `users.*`, `news.sports.*`).
*   **Pattern Rules:**
    *   Limited to **two dots (three levels)**. For example, `a.*` or `a.b.*` are valid, but `a.b.c.*` is not.
    *   The wildcard pattern must always end with `.*`. The asterisk (*) cannot be in the middle of a pattern (e.g., `a.*.c` is invalid).
*   **Number of Matching Channels:** There's effectively no limit to the number of actual channels a client can be subscribed to via a single wildcard pattern.
*   **Publishing:** You **cannot** publish directly to a wildcard channel pattern (e.g., you can't publish to `news.*`). You publish to the specific channels that would match the pattern (e.g., `news.cricket`).
*   **Channel Groups:** Wildcard channel names are not allowed within Channel Groups.

## Key Takeaways for Scalable Channel Design

*   **Channels are "cheap":** Don't hesitate to use many channels if your application logic requires it.
*   **Choose the right subscription mechanism:**
    *   Use **multiplexing** for a small, dynamic set of channels per client.
    *   Use **channel groups** when clients need to listen to hundreds or thousands of channels, and the list is better managed centrally.
    *   Use **wildcard subscribe** for hierarchical channel structures where clients need to listen to all sub-channels under a parent.
*   **Valid Naming:** Adhere to channel naming conventions to avoid issues.
*   **Message Throughput vs. Channel Count:** While there are no direct limits on channel numbers, the overall message rate and subscriber capacity are still factors to consider for performance. Ensure your subscribers can handle the message volume from all subscribed channels.

