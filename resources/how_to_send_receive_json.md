# How to Send and Receive JSON Objects with PubNub

PubNub is designed to seamlessly handle JSON (JavaScript Object Notation) as a primary data format for messages. This makes it easy to send structured data between your clients and servers.

## Publishing JSON Objects

When you publish a message using a PubNub SDK, you can typically pass a JavaScript object or array (or equivalent data structures in other languages like Dictionaries in Python/Swift, HashMaps in Java, etc.) directly as the message payload. 

1.  **Serialize to JSON String:** Convert your native object/array into a JSON formatted string.
2.  **UTF-8 Encode:** Encode this JSON string as UTF-8.
3.  **Publish:** Send the encoded JSON string to the PubNub network.

**Example (JavaScript SDK):**

```javascript
const PubNub = require('pubnub');

const pubnub = new PubNub({
  publishKey: 'pub-c-YourPublishKey',
  subscribeKey: 'sub-c-YourSubscribeKey',
  uuid: 'myUniqueUUID'
});

const message = {
  user: 'Alice',
  text: 'Hello, World!',
  timestamp: Date.now()
};

pubnub.publish(
  {
    channel: 'chat_channel',
    message: message
  },
  (status, response) => {
    if (!status.error) {
      console.log('Message published with timetoken:', response.timetoken);
    } else {
      console.error('Publish error:', status);
    }
  }
);
```

**Example (Python SDK):**

```python
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub

pnconfig = PNConfiguration()
pnconfig.publish_key = 'pub-c-YourPublishKey'
pnconfig.subscribe_key = 'sub-c-YourSubscribeKey'
pnconfig.uuid = 'myUniqueUUID'

pubnub = PubNub(pnconfig)

message = {
    'user': 'Alice',
    'text': 'Hello, World!',
    'timestamp': 1620000000000
}

pubnub.publish().channel('chat_channel').message(message).async(
    lambda envelope, status: print('Publish status:', status, 'Response:', envelope)
)
```

**Example (Java SDK):**

```java
import com.pubnub.api.PNConfiguration;
import com.pubnub.api.PubNub;
import com.pubnub.api.callbacks.PNCallback;
import com.pubnub.api.models.consumer.PNPublishResult;
import com.pubnub.api.models.consumer.PNStatus;

import java.util.HashMap;
import java.util.Map;

PNConfiguration pnConfiguration = new PNConfiguration();
pnConfiguration.setPublishKey("pub-c-YourPublishKey");
pnConfiguration.setSubscribeKey("sub-c-YourSubscribeKey");
pnConfiguration.setUuid("myUniqueUUID");

PubNub pubnub = new PubNub(pnConfiguration);

Map<String, Object> message = new HashMap<>();
message.put("user", "Alice");
message.put("text", "Hello, World!");
message.put("timestamp", System.currentTimeMillis());

pubnub.publish()
      .channel("chat_channel")
      .message(message)
      .async(new PNCallback<PNPublishResult>() {
          @Override
          public void onResponse(PNPublishResult result, PNStatus status) {
              if (!status.isError()) {
                  System.out.println("Published timetoken: " + result.getTimetoken());
              } else {
                  System.err.println("Publish error: " + status.getErrorData());
              }
          }
      });
```

## Receiving JSON Objects

PubNub SDKs automatically parse incoming JSON messages and deliver them as native objects. You just need to subscribe to channels and handle the message event.

**Example (JavaScript SDK):**

```javascript
pubnub.addListener({
  message: (event) => {
    const receivedMessage = event.message;
    console.log('Received JSON message:', receivedMessage);
  },
});

pubnub.subscribe({
  channels: ['chat_channel']
});
```

**Example (Python SDK):**

```python
from pubnub.callbacks import SubscribeCallback
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub

class MySubscribeCallback(SubscribeCallback):
    def message(self, pubnub, message):
        print('Received JSON message:', message.message)

pnconfig = PNConfiguration()
pnconfig.publish_key = 'pub-c-YourPublishKey'
pnconfig.subscribe_key = 'sub-c-YourSubscribeKey'
pnconfig.uuid = 'myUniqueUUID'

pubnub = PubNub(pnconfig)
pubnub.add_listener(MySubscribeCallback())
pubnub.subscribe().channels('chat_channel').execute()
```

**Example (Java SDK):**

```java
import com.pubnub.api.callbacks.SubscribeCallback;
import com.pubnub.api.models.consumer.PNMessageResult;
import com.pubnub.api.models.consumer.PNPresenceEventResult;

pubnub.addListener(new SubscribeCallback() {
    @Override
    public void status(PubNub pubnub, PNStatus status) {}

    @Override
    public void message(PubNub pubnub, PNMessageResult message) {
        System.out.println("Received JSON message: " + message.getMessage());
    }

    @Override
    public void presence(PubNub pubnub, PNPresenceEventResult presence) {}
});

pubnub.subscribe().channels(Arrays.asList("chat_channel")).execute();
```

## Best Practices

- Keep JSON payloads small to stay well within PubNub's 32KB message size limit.
- Always handle errors in the publish and subscribe callbacks.
- Validate JSON structure to avoid unexpected data on clients.
- Avoid including sensitive data in plaintext; use PubNub's cipher key for end-to-end encryption.
- For large or binary data, consider PubNub File Sharing or chunking strategies.
- Use consistent field names and data types across clients to simplify development.

## Troubleshooting

- JSON parsing errors: Ensure messages are valid JSON objects or arrays.
- Performance: Deeply nested objects can affect serialization/deserialization performance.
- Character encoding: PubNub uses UTF-8 encoding; ensure your data is encoded properly.
- SDK version compatibility: Use compatible SDK versions across your clients.

For more information, see the PubNub docs: https://www.pubnub.com/docs or contact support@pubnub.com.
