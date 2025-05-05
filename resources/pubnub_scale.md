## How do I monitor latency from my location?

PubNub SDKs have built-in latency monitoring and there are many third party latency tools you can implement into your application. You can also check the following any time:
- [PubNub Status Page Chart](https://status.pubnub.com/)
- [PubNub Speed-o-Meter](https://www.pubnub.com/developers/speed/)

---

## How fast can I publish messages?

Messages can be published as fast as needed. However, maximum throughput will be limited by factors such as network bandwidth, server/device CPU/RAM limitations, and ISP, among other examples. Our recommendation is to publish 10–15 messages/sec per channel. On the subscribe side, you will see the same limitations, so consider how many messages a subscriber can consume based on the use case:
- For human readers: consider how many messages is too many.
- For data-driven realtime graphs: consider how many messages per second are needed to provide the necessary graphing experience.

See also: [Soft & Hard Limitations](https://support.pubnub.com/hc/en-us/articles/360051204972)  
For any questions, contact us at [support@pubnub.com](mailto:support@pubnub.com).

---

## How many concurrent connections can I use?

PubNub can support millions of concurrent connections. Many customers have millions of users connecting and exchanging messages, amounting to billions of transactions per day.  
If your application will have more than 1000 concurrent connections (devices/users), contact us to discuss a Pro plan for volume discounts and a best practice architecture review with one of our experts to optimize your application.  
For more details, please contact [PubNub Support](mailto:support@pubnub.com).

---

## What is PubNub response time in China?

PubNub uses Points of Presence closest to client locations to minimize latency, but does not have a PoP within China. Due to China's firewall, connectivity and latency may vary per use case. However, PubNub has many customers with users inside China operating with minimal network issues.  
We recommend minimal testing with your PubNub POC application before expanding to increased throughput/stress tests.  
For any questions, contact us at [support@pubnub.com](mailto:support@pubnub.com).

---

## What is PubNub's average response time?

PubNub's goal is to deliver messages end-to-end within 1/10th of a second (100ms), with a global average of less than 1/4 second (< 250ms) across all customers, end users, and networks worldwide. Most delivery time is spent on connectivity between devices and the PubNub network (outside PubNub's network), affected by device internet connection, ISP, and distance from the PubNub PoP (point of presence/data center).  
To mitigate these variables, PubNub adds points of presence for optimal performance.  
You can review [PubNub's performance stats as reported by Pingdom](https://www.pingdom.com/) including uptime and latency.

---

## Can PubNub support millions of users and millions of channels?

Yes. Creating and using millions of channels and users/devices poses no technical challenge to PubNub (this is a core service offering).  
See also: [How many concurrent connections can I use?](#how-many-concurrent-connections-can-i-use)

---

## How many channels can I use?

There is no limit to the number of channels your app can use, nor is there any additional cost associated with the number of channels used. Channels are transient resources created instantly when a message is published to an arbitrary channel name—use them as needed for your application.

See also:  
- [How many concurrent connections can I use?](#how-many-concurrent-connections-can-i-use)
- [What is a channel?](https://www.pubnub.com/docs/general/channels)
- [Managing channels](https://www.pubnub.com/docs/chat/manage-channels)

---

## Does multi-region configuration apply to stored messages?

Yes, stored messages are replicated across multiple availability zones in several geographical data center locations.

---

## How many channels does multiplexing support?

We recommend using channel multiplexing for up to 10 channels. If your app requires a single client to subscribe to more than 10 channels, use channel groups.  
- You can add up to 2000 channels to a channel group.
- Each client can subscribe to 10 channel groups for a total of 20,000 channels.

---

## Does PubNub support HTTP Streaming & Pipelining?

Yes, PubNub's network supports sending unlimited publishes without waiting for a response on the same TCP socket connection.  
You can learn more about how [PubNub HTTP Streaming and Pipelining works](https://www.pubnub.com/blog/http-streaming-and-pipelining/).