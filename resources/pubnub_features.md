## Key features

---

## Does PubNub store messages?

By default, PubNub does **not** store data transmitted through its realtime network. PubNub has an optional add-on called **Message Persistence** that stores all published messages automatically for a preconfigured period of time: from 1 up to 30 days, and Unlimited. Stored messages can be retrieved via a history API. 

PubNub is equipped with AES-256 encryption (used and approved by the US Government) which is built into all PubNub SDKs. With AES, all messages are encrypted & decrypted at the end-points so the data is not readable as it goes through PubNub. PubNub's AES/TLS solution is the most effective for both meeting HIPAA compliance requirements while providing access to the history API, as needed.

---

## How do I access messages published prior to subscribing?

PubNub caches up to 100 published messages in-memory. When a new client subscribes, it will by default only deliver messages that occur after the subscribe happens, even if there are existing messages in the cache. You can retrieve in-memory cached messages for a new connection by subscribing with an older timetoken, typically for up to 5 minutes from the time messages were published.

However, historical message durability depends on the memory management status of the cluster you connect to. To guarantee access to historical messages, enable the Message Persistence feature and use the history API, which lets you retrieve messages for up to 30 days back on any channel or even unlimited retention.  

---

## How do I connect to multiple channels simultaneously?

The **Stream Controller** feature (Channel Multiplexing, Channel Groups & Wildcard Subscribe) allows a single client connection to subscribe to multiple channels.  

---

## How long are messages available?

The channel's in-memory message queue is a **temporary cache** that holds onto messages for up to 20 minutes and is limited to 100 messages (the most recent 100 messages). If messages are published at a fast rate, messages can be pushed off the queue and unavailable before the 20 minutes period.

For **long term, reliable persistence and retrieval of missed messages**, you should enable Message Persistence, and use the history API to retrieve those messages.  

---

## Can I subscribe to a channel group with no channels?

Make sure the channel group has **at least one channel** added to it before subscribing. Subscribing to a channel group with no channels will result in a 400 response code. Removing the last channel from a channel group will also result in a 400 response code. 

---

## How do I add a channel to a channel group?

```javascript
pubnub.channelGroups.addChannels(
  { channels: [ 'ch1', 'ch2' ], channelGroup: "myChannelGroup" },
  function(status) {
    if (status.error) {
      console.log("operation failed w/ status: ", status);
    } else {
      console.log("operation done!");
    }
  }
);
```

See also: [how to subscribe to a channel group](#), [how to remove a channel from a channel group](#)

---

## How do I remove a channel from a channel group?

```javascript
pubnub.channel_group_remove_channel({
  callback: function(m){console.log(m)},
  channels: 'channel_1',
  channel_group: 'group_a'
});
```

See also: [how to add a channel to a group](#), [what happens when you remove the last channel from a channel group](#)

---

## Is there a limit to the number of channel groups a single client can subscribe to?

Each client connection (instance of the PubNub object) can subscribe to a **total of 10 channel groups**.

---

## Is there a limit to the number of channel groups in my PubNub key set?

There is **no limit** on the number of channel groups that can be created under a key set.

---

## Is there a limit to the number of channels I can add to a single channel group?

You can **add 100 channels inside a single channel group**.

---

## What are channel groups?

**Channel Groups** is a feature that is part of the **Stream Controller** add-on. Channel groups is a way to subscribe to multiple channels with a single connection (multiplexing). You can add 100 channels to a single channel group and subscribe to a total of 10 channel groups. The list of channels in a channel group is maintained on the server instead of the client and channels can be added or removed by the client or the server.

---

## How to upload multiple files?

Currently, the **Files API** supports one at a time file upload. In order to upload multiple files you need to add them to a queue and send with separate payloads. For more information about sharing files, check our official documentation. For questions, contact support@pubnub.com

---

## How do I retrieve files from storage?

Fetching files from storage is achieved by using the **History API** in combination with Files SDK methods:
1. Obtain the file message using History API, or `listFiles` method.
2. Display/download the file using SDK methods based on the obtained file information.

For more information:  
- [File sharing](#)
- [Message Persistence](#)
- [JavaScript SDK Files API](#)

In case of questions, contact support@pubnub.com

---

## Can I use PubNub to share files?

PubNub allows you to share videos, images, or documents of **up to 5 MB** using the Files feature. Log in to your admin account and enable it in your key set configuration. Sending a file is similar to publishing a message; specify the channel and provide the file. You can also include text as a caption. To receive files, a client must add a listener for file messages and be subscribed to the channel. 

For additional resources:
- [File sharing](#)
- [Sending images and files](#)
- [Files API for PubNub JavaScript SDK](#)

Support: support@pubnub.com

---

## How long can messages be stored?

You can set the message persistence retention time to **1, 7, 30, 90, 180, 365 days or Unlimited**.  
- Free tier users: up to 7 days  
- Starter Plan: up to 180 days  
- Above 180 days: requires Pro Plan  

To change retention, log in and update settings in the Message Persistence feature. Retention changes may lead to existing data loss—contact support for dual database read.

---

## Can I store messages for select channels?

**No**, the Message Persistence add-on is enabled for each key, so all messages are persisted for all channels published to that key by default.  
**Note:** For select SDKs (Objective-C, Java, Android, JavaScript, Node.js, etc.), the publish method supports a parameter to prevent message persistence. E.g., in JavaScript, use `store_in_history`.  
Consult each SDK's docs for details.

---

## How do I use the start, end and count parameters in a history request?

- The **count** parameter restricts the number of messages to return (max 100 per request).
- If both **start** and **end** are provided, the **reverse** parameter is ignored, and messages are returned from start towards end.
- If no count is provided, max 100 messages are returned.

See more about using history in tutorials and the API reference.

---

## In what order are stored messages retrieved?

Messages are **always returned in oldest to newest order**. You can retrieve different slices via the `start`, `end`, `reverse` options, but order remains oldest → newest. See the Storage API docs for more.

---

## How many stored messages can be retrieved?

- Specify a **count** parameter (max 100) in the history request.
- To retrieve more, **use paging** with the start and end timetoken parameters. `start` is exclusive, `end` is inclusive.
- Stop paging when fewer than 100 messages are returned.

See also:
- [Official Message Persistence documentation](#)
- [JS SDK API reference](#)

Support: support@pubnub.com

---

## Are stored messages affected by changing message size limits?

All account types, including Sandbox, can send messages **up to 32KB**. The pricing is based on the average size of all messages sent each month.

---

## Does multiplexing work with message history?

**Yes**, you can retrieve stored messages from multiple channels with a single call. Use the `fetchMessages` method to fetch messages from storage on one or more channels.

---

## What add-on features are available in PubNub?

PubNub offers powerful add-ons:
- **Presence**: Awareness of who is connected, when someone joins, leaves, or changes state
- **Stream Controller**: Listen to multiple channels via a single connection
- **Message Persistence**: Easy retrieval of published messages (1–30 days or unlimited)
- **Access Manager**: Fine-grain access control at channel and user level
- **Push Notifications**
- **Functions**: Microservice feature for realtime apps logic executed within the Data Stream Network
- **App Context**: Store metadata about users/channels/membership
- **Files**: Upload and share files (up to 5 MB)

---

## How do I subscribe to a wildcard channel?

**Use `.*` to denote a wildcard.**  
Example:

```javascript
pubnub.subscribe({ channels: ['stocks.*'] });
```

This subscribes to all channels prefixed with `stocks.` (e.g., `stocks.tech`, `stocks.tech.aapl`, ...).

For more, see: [Wildcard Subscribe docs](#)

---

## How many channel segments are supported with wildcard subscribe?

Currently, **up to three levels deep** with your channel