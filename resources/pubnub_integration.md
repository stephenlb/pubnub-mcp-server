Development and Integration

---

## What are valid channel names?

Channel names are UTF-8 compatible and can be up to 92 characters. Invalid characters include:

- Comma ,
- Colon :
- Asterisk *
- Slash /
- Backslash \
- Space
- Unicode zero
- Non-printable ASCII control characters

Some APIs/SDKs might tolerate some of the above characters, but compatibility is not guaranteed. Avoid them.  
**Note:** The period (.) is not invalid but is reserved for wildcard features; avoid using it unless intentionally using wildcards or Function binding.

You can [validate your channel name here](#).

---

## Can PubNub be used for realtime, multi-player games?

Yes. See resources on [PubNub Gaming Use Cases](#) and [PubNub Gaming Blogs](#).

---

## Can PubNub be used for sporting events?

Yes, PubNub supports high message volumes and is used for massive events like SuperBowl apps, pro sports fan engagement, etc. If using for such events, submit the Virtual Event Form. For questions, contact [PubNub Support](mailto:support@pubnub.com).

---

## Does PubNub run on browsers lacking CORS2 support?

Yes, PubNub automatically falls back to alternative transports for browsers without full client-side cross-origin request (CORS2) support. PubNub does **not** support CORS1; only CORS2 with fallback options.

---

## Does PubNub support the UDP protocol?

No. PubNub client libraries communicate over a TCP socket connection only.

---

## Does PubNub use a lot of battery power?

PubNub is optimized for mobile battery life by using long-lived keep-alive connections (one hour), pings every 5 minutes, and selecting the best transport automatically.

**Battery-saving tips:**
- Keep messages compact
- Aggregate payloads to send fewer messages
- Use Stream Controller (Multiplexing, channel Groups, Wildcard Subscribe) for multiple channels over a single connection

---

## How do I receive data using REST API?

Make an HTTP GET subscribe request and, for each new subscribe request, include the new 17-digit timetoken returned by PubNub in the response.

See also:
- [PubNub REST API Docs](#)
- [Subscribe Cycle](#)  
Contact [support@pubnub.com](mailto:support@pubnub.com) for help.

---

## What transports are supported?

PubNub uses the most efficient protocol for any programming environment through SDKs, abstracting protocol complexities behind a consistent API. SDKs evolve to include the latest standards.

---

## Does PubNub provide Webhooks?

See the [knowledge base article: Can PubNub call my server via Webhooks when presence events occur?](#)

---

## Can I build a threaded messaging app using PubNub?

Yes. PubNub's Chat SDK has built-in threading. For other SDKs, implement threads by tagging messages with metadata, e.g., using the original message's timetoken as a thread key.

See: [Does PubNub offer an SDK dedicated for chat?](#)

---

## Can I publish a message via database trigger?

You can invoke a PubNub publish via a MySQL Trigger on UPDATE, INSERT, and DELETE.  
**Note:** Using triggers is not best practice for high-transaction apps; prefer application code for scalability.

**MySQL Example** (details shortened, see full source for complete published stored procedure):

```sql
DELIMITER $$
CREATE PROCEDURE publish_message(p1 DOUBLE, p2 DOUBLE, p3 BIGINT)
BEGIN
  DECLARE cmd CHAR(255);
  SET cmd = CONCAT('curl https://pubsub.pubnub.com/publish/demo/demo/0/mysql_triggers/0/%22',p1,',',p2,',',p3,'%22');
  SET result = sys_eval(cmd);
END$$;
```
**Publish on INSERT:**

```sql
CREATE TRIGGER publish_trigger AFTER INSERT ON your_table
FOR EACH ROW CALL publish_message(NEW.col1, NEW.col2, NEW.col3);
```
Monitor messages in the [PubNub Dev Console](#).

---

## Can I use PubNub to track moving objects?

PubNub does not guarantee message ordering or delivery. To build robust moving object tracking, embed a counter in the messages, have the subscriber check order, interpolate object positions on gaps, or use a physics model for movement. These techniques are common in gaming for handling latency.

---

## Does PubNub provide WebRTC and video chat?

**PubNub is a signaling protocol service** for WebRTC, not a media streaming server.  
- Use PubNub for signaling (session handshake, metadata exchange).
- Audio/video/data streams go P2P via WebRTC, not through PubNub.
- You will need STUN servers (for NAT traversal) and TURN servers (for relaying media if P2P fails), which are separate from PubNub.

**Resources:**
- [PubNub WebRTC Reference App](#)
- [Xirsys for TURN/STUN](#)
- [Sinch mobile communication platform](#)
- [PeerJS](#)

---

## How do I add notifications to a chat room app?

Use:

- **Global notification channel:** Receives events like new messages (all users subscribe to this).
- **Chat room channel:** Broadcasts message text (users subscribe while in the room).

For more info, contact [support@pubnub.com](mailto:support@pubnub.com).

---

## How do I create device interaction on a geo grid?

Start with the [Geohashing Chat by User Proximity Tutorial](#) to learn about Geo Grid Device Interactivity.

---

## How do I synchronize multiple devices?

Use PubNub's time API for synchronization:
1. Get local time: `start = now()`
2. Request server timetoken: `timetoken = http://pubsub.pubnub.com/time/0`
3. Calculate delay: `delay = now() - start`
4. Convert timetoken to ms: `timetoken = timetoken / 10000`
5. Add delay: `client_time = timetoken + delay`

Each device uses `client_time` for coordinated actions, and re-syncs on app start.

---

## How do I prevent old published messages from reaching subscribers?

1. **Set `restore: false`:** Prevents old messages from being re-sent to users upon reconnect.
2. **Use timestamps:** Include a timestamp in each message, so clients can ignore old ones.

**PHP Example:**

```php
$t = time() . "";
$m = array("serial" => $t, "payload" => "Hello from PHP! " . $t);
$publish_success = $pubnub->publish(array('channel' => $c, 'message' => $m));
```

---

## Is a connection closed if I shut down the PubNub object?

- For Java and C#, the connection closes when the object memory is freed.
- For JavaScript/browser clients, the browser may keep the connection alive for a while after inactivity.

---

## How are PubNub SDKs licensed?

All PubNub SDKs are free and open-source (MIT licensed), unless stated otherwise in the SDK's license file. See [PubNub GitHub](https://github.com/pubnub/).

---

## What client libraries (SDKs) are currently supported?

PubNub supports over 70 free/open-source SDKs for mobile, desktop, web, embedded, and server platforms. [See docs page on PubNub's website](https://www.pubnub.com/docs) for current links. Contact [support@pubnub.com](mailto:support@pubnub.com) if you need help.

---

## When should I upgrade to a newer SDK version?

Use the latest available SDK to benefit from features and fixes. Update about every six months, or as fits your release cycle. Major releases should be planned with larger updates. See SDK EOL policy and follow relevant GitHub repos for update notices.

---

## Calculating message payload size before publishing

Maximum message size is **32,768 bytes (32 KiB)**. To avoid "Message Too Large" errors:

**Example function for JSON messages:**

```js
function calculate_payload_size(channel, message) {
    return encodeURIComponent(
        channel + JSON.stringify(message)
    ).length + 100;
}
```

```js
var channel = "chats.room1";
var msg = {"msg":"Let's meet up after work."};
var size = calculate_payload_size(channel, message);

if (size < 32768) {
  pubnub.publish({channel: channel, message: msg});
}
```

Always use UTF-8 encoding for accurate size estimation.

---

## Can I send and/or receive JSON objects?

Yes. Publish JSON as objects; PubNub SDKs handle serialization/deserialization for you.

---

## Can I send large messages with PubNub?

Yes, up to 32KB per message.

