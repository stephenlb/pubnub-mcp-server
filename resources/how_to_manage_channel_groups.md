# How to Manage PubNub Channel Groups

Channel Groups are a powerful feature of PubNub's Stream Controller add-on, allowing a single client to subscribe to a large number of channels (up to 2,000 per group, and 10 groups per client) through a single named group. The management of which channels belong to a group is done server-side or by privileged clients.

**Prerequisite:** The "Stream Controller" add-on must be enabled for your keyset in the PubNub Admin Portal to use Channel Group functionality.

## Core Channel Group Operations

These operations are typically performed using a PubNub SDK that has administrative privileges (e.g., running on your server with your Secret Key for PAM-enabled keysets, or simply with Pub/Sub keys if PAM is not strictly enforced for these operations on your keyset).

1. 

2.  **Removing Channels from a Channel Group:**
    *   **Purpose:** Disassociates one or more channels from a channel group.
    *   **SDK Method (JavaScript example):** `pubnub.channelGroups.removeChannels(params, callback)`
    *   **Parameters (`params` object):**
        *   `channelGroup` (String): The name of the channel group.
        *   `channels` (Array of Strings): An array of channel names to remove from the group.
    *   **Example (using `channel_group_remove_channel` from an older SDK style for illustration):**
        ```javascript
        // Conceptual - newer SDKs use pubnub.channelGroups.removeChannels
        // pubnub.channel_group_remove_channel({
        //   channel_group: 'user_123_feeds',
        //   channels: 'finance_feed_for_user_123', // Can be a single string or array for some methods
        //   callback: function(response){ console.log(response); }
        // });
        ```
        **Modern SDK (JavaScript):**
        ```javascript
        // pubnub.channelGroups.removeChannels(
        //   {
        //     channelGroup: "user_123_feeds",
        //     channels: ["finance_feed_for_user_123"]
        //   },
        //   function(status) { /* ... handle status ... 

3. 

4.  **Deleting a Channel Group:**
    *   **Purpose:** Removes the channel group itself and disassociates all its channels. This does *not* delete the channels themselves, only their membership in this group.
    *   **SDK Method (JavaScript example):** `pubnub.channelGroups.deleteGroup(params, callback)`
    *   **Parameters (`params` object):**
        *   `channelGroup` (String): The name of the channel group to delete.
    *   **Example:**
        ```javascript
        // pubnub.channelGroups.deleteGroup(
        //   {
        //     channelGroup: "old_user_feeds"
        //   },
        //   function(status) { /* ... handle status ... 

## Client-Side Subscription to Channel Groups

Clients subscribe to the channel group name, not the individual channels within it (when using this feature).

