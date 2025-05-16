Here is your content converted to Markdown format, using ## for subtitles (instead of "Title") and proper markdown formatting:

---

## How does PubNub work?

PubNub is a programmable network for developing realtime applications; an evolution from three-tier architecture, purpose-built to handle all the complexities of data streams. PubNub operates at the edge of the network to handle and apply logic to real-time data, thereby minimizing latency to 250 milliseconds or less worldwide, and guaranteeing reliability and scalability.

Please read the [How PubNub Works guide](#) to get a solid understanding of what PubNub can do for your applications.  
See also: [Where do I get started learning PubNub?](#)

---

## What is a userId (formerly UUID)?

The `userId` is a unique string of up to 64-characters that is used to identify a client (end user, device, or server) that connects to PubNub. User IDs are also important for other features like Presence and Message Persistence to work as expected. It is required to pass a `userId` when you instantiate a PubNub instance.

A `userId` should be persisted for the lifetime of a user or a device that connects to PubNub. If you have enabled Presence for your key set, not setting a userId that is consistent for an end user may result in unexpected presence behavior. You can accomplish this by either passing the userId to the client upon successful login or by persisting the userId on the client where it can be retrieved the next time the PubNub instance is instantiated.

Please, refer to the following documentation for more information about userId configuration: [Users & Devices User Setup](#)

> **Note:** Older SDK versions referred to the userId as UUID, and did not require UUID provision on client instantiation, whereas our new SDKs require it. In case of any questions, contact us at support@pubnub.com

---

## What is PubNub?

PubNub, based in San Francisco, CA, is a complete platform for building, managing, and monetizing real-time interactive experiences in any app, regardless of purpose, scale, or complexity.

Whether you’re in the early development phase and want to get to market faster, or you are looking to increase engagement and accelerate monetization in your existing app, PubNub provides the economies of scale and expertise necessary to grow your business at any speed while freeing your developers to focus on core initiatives.

PubNub's primary offering is a real-time publish/subscribe messaging API, built on a global edge messaging network with multiple replicated data centers worldwide. The network currently connects over 1 billion unique devices (smartphones, browsers, IoT devices, and servers) and facilitates more than 3 trillion transactions per month.

Over the past decade, PubNub has developed the most comprehensive feature set in the industry for building and managing interactive real-time experiences. Designed from the ground up with developers in mind, PubNub enables product teams to quickly create real-time apps while giving full control over how those apps look, function, and evolve over time.

With the addition of live analytics and decision-making features to trigger new app behaviors through no-code dashboards, PubNub has evolved into the only full-lifecycle real-time developer platform.

See Also:  
- [What is the PubNub Realtime Network? (video)](#)
- [Where do I get started learning PubNub?](#)

---

## What happens to messages published when no one is listening?

Nothing different than if there was a subscriber on that channel. Publish (senders) and subscribe (listeners/receivers) are completely decoupled so there is no dependency between the two. All published messages are cached for quick retrieval when a subscriber returns from a network disconnect. In other words, if the client is configured for message catch up, those missed messages can be recovered when the client comes back online and resubscribes to the channel.

- Messages are cached for up to 20 minutes and limited to the last 100 messages.
- If Message Persistence feature is enabled for the key set (pub/sub keys), then all messages are stored for as long as the configured retention time.

This allows a client application to get messages (using the history API) that were sent while that client was offline for a long period of time.

See also: [Retrieving messages and storage options](#)

---

## What is a channel?

Channels are how messages are sent and received. Clients that subscribe to a channel will receive messages that are published to it.

- Channels are lightweight and flexible. They exist merely by using them. Just publish or subscribe to a channel and nothing more.
- You can use as many channels as your app requires. There is no additional charge for the number of channels you use.
- What you use channels for is completely defined by your application requirements (private chat, group chat, broadcasting, fan-in use cases, etc.).

There are no predefined properties that need to be configured with channels. It is up to you to allow more users to start subscribing and publishing to a channel.

---

## Does PubNub offer a self-hosted solution?

No. PubNub offers a hosted network solution only. It is designed to provide robust and scalable infrastructure for deploying realtime applications while being more cost-effective than self-hosted solutions. PubNub Network infrastructure is secure and provides advanced encryption including 2048-bit TSL and AES-256 in all client SDKs.

---

## Does PubNub use Amazon Messaging Services?

PubNub does not use Amazon Messaging Services like SQS and SNS. These services may seem similar at first glance, but are actually based on an entirely different architecture to solve different business problems. Amazon Messaging Services do not provide pushing of data. They require every device to which you push data to either be running an HTTP server or to be capable of receiving a message via email. Neither of these options is applicable for sending data to users in realtime.

---

## Is PubNub better than a realtime server running Node.JS?

You can build a realtime data push service using Node.JS and Socket.IO and manage it yourself, scale it (with a lot of effort), etc. In contrast, PubNub provides this capability (plus many advanced features) as a network service and simple-to-learn APIs in > 70 SDKs for web, mobile, desktop, server and embedded platforms, all maintained in-house as free and open source under an MIT license.

PubNub infrastructure spans 15 data centers and that immense capacity is provided on a pay-as-you-go basis so that developers can start small with no upfront infrastructure costs.

PubNub is commonly used in the Node.JS/Socket.IO environment to provide scalable deployment capabilities for use-cases like IoT, social interaction, business collaboration, VoIP, or large-scale broadcasting.

---

## What is the subscribe cycle?

*(Article content missing in input. Based on title, this article would explain the fundamental long-polling subscribe mechanism.)*

---

## Why use PubNub rather than push notifications?

There are a number of reasons why it makes sense to use PubNub in addition to, or instead of, push notifications (such as Apple APNS or Google FCM):

- Application is deployed across multiple devices from different vendors, including iOS, Android, etc.
- Developers require ease-of-integration and consistent interfaces/behavior across diverse devices.
- Push notification networks generally cannot acknowledge message receipt (no bi-directional communication).
- PubNub can deliver and encrypt sensitive data securely (SSL and AES).
- Message sizes are restricted (4KB for GCM/MPNS, 2KB for APNS); PubNub supports up to 32KB.
- Missed messages can be retrieved using PubNub's Storage & Playback and history API (not possible with mobile push notifications).
- You can detect who is online with PubNub Presence.

... and much more.

---

## How do I identify a device?

Device identity is best represented by a `userId` and can be either tracked via the Presence add-on feature or published as part of the message or as a standalone message. For more information please check [Users & Devices](#).

---

## Required uuid/userId parameter

It is now **required** to provide the `userId` parameter while configuring the PubNub object. Previously, not setting the parameter by developers resulted in SDKs generating random userIDs every time a connection was created to PubNub. This, in turn, affected usage metrics, billing and Presence features.

Currently, updated SDKs return an error indicating missing parameter, in case it has not been set.

### Setting userID

Examples in JavaScript SDK:

**Instantiating PubNub instance:**
```javascript
var pubnub = new PubNub({
    subscribeKey : "mySubscribeKey",
    publishKey : "myPublishKey",
    userId : "myUniqueUserId"
});
```
**Calling a method to explicitly set it:**
```javascript
pubnub.setUserId(string)
```

See also: [Users and Devices](#)

In case of any questions, contact us at support@pubnub.com

---

## How many messages can a channel contain?

Any channel can handle an **unlimited number of messages** that are published to it. However, a channel can only retain a total of **100 messages** for short term retrieval. A channel acts as a FIFO queue (first in, first out) and as new messages are published, old messages are popped off.

---
