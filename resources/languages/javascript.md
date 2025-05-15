TITLE: Initializing PubNub SDK (JavaScript)
DESCRIPTION: This code snippet demonstrates how to create a new instance of the PubNub SDK. You must provide your publishKey and subscribeKey obtained from the PubNub Admin Portal, along with a unique userId to identify the client.
SOURCE: https://github.com/pubnub/javascript/blob/master/README.md#_snippet_1

LIBRARY: PubNub
URL: <script src="https://cdn.pubnub.com/sdk/javascript/pubnub.9.5.2.min.js"></script>

LANGUAGE: JavaScript
CODE:
```
pubnub = new PubNub({
  publishKey: 'myPublishKey',
  subscribeKey: 'mySubscribeKey',
  userId: 'myUniqueUserId'
});
```

----------------------------------------

TITLE: Installing PubNub SDK with npm (Shell)
DESCRIPTION: This command installs the PubNub JavaScript SDK package from the npm registry into your project's dependencies. It's the recommended way to integrate the SDK into Node.js or modern frontend projects using package managers.
SOURCE: https://github.com/pubnub/javascript/blob/master/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
npm install pubnub
```

----------------------------------------

TITLE: Add Event Listeners to PubNub Subscription - JavaScript
DESCRIPTION: Demonstrates how to create a PubNub channel and subscription and attach various event listeners (message, presence, signal, objects, messageAction, file) using both direct properties and the generic addListener method.
SOURCE: https://github.com/pubnub/javascript/blob/master/README.md#_snippet_2

LANGUAGE: javascript
CODE:
```
// create a subscription from a channel entity
const channel = pubnub.channel('my_channel');
const subscription = channel.subscription();
subscription.subscribe();

// Event-specific listeners
subscription.onMessage =  (messageEvent) => { console.log("Message event: ", messageEvent); };
subscription.onPresence =  (presenceEvent) => { console.log("Presence event: ", presenceEvent); };
subscription.onMessage = (messageEvent) => { console.log("Message event: ", messageEvent); };
subscription.onPresence = (presenceEvent) => { console.log("Presence event: ", presenceEvent); };
subscription.onSignal = (signalEvent) => { console.log("Signal event: ", signalEvent); };
subscription.onObjects = (objectsEvent) => { console.log("Objects event: ", objectsEvent); };
subscription.onMessageAction = (messageActionEvent) => { console.log("Message Action event: ", messageActionEvent); };
subscription.onFile = (fileEvent) => { console.log("File event: ", fileEvent); };

// Generic listeners
subscription.addListener({
  // Messages
  message: function (m) {
    const channelName = m.channel; // Channel on which the message was published
    const channelGroup = m.subscription; // Channel group or wildcard subscription match (if exists)
    const pubTT = m.timetoken; // Publish timetoken
    const msg = m.message; // Message payload
    const publisher = m.publisher; // Message publisher
  },
  // Presence
  // requires a subscription with presence
  presence: function (p) {
    const action = p.action; // Can be join, leave, state-change, or timeout
    const channelName = p.channel; // Channel to which the message belongs
    const occupancy = p.occupancy; // Number of users subscribed to the channel
    const state = p.state; // User state
    const channelGroup = p.subscription; //  Channel group or wildcard subscription match, if any
    const publishTime = p.timestamp; // Publish timetoken
    const timetoken = p.timetoken; // Current timetoken
    const uuid = p.uuid; // UUIDs of users who are subscribed to the channel
  },
  // Signals
  signal: function (s) {
    const channelName = s.channel; // Channel to which the signal belongs
    const channelGroup = s.subscription; // Channel group or wildcard subscription match, if any
    const pubTT = s.timetoken; // Publish timetoken
    const msg = s.message; // Payload
    const publisher = s.publisher; // Message publisher
  },
  // App Context
  objects: (objectEvent) => {
    const channel = objectEvent.channel; // Channel to which the event belongs
    const channelGroup = objectEvent.subscription; // Channel group
    const timetoken = objectEvent.timetoken; // Event timetoken
    const publisher = objectEvent.publisher; // UUID that made the call
    const event = objectEvent.event; // Name of the event that occurred
    const type = objectEvent.type; // Type of the event that occurred
    const data = objectEvent.data; // Data from the event that occurred
  },
  // Message Reactions
  messageAction: function (ma) {
    const channelName = ma.channel; // Channel to which the message belongs
    const publisher = ma.publisher; // Message publisher
    const event = ma.event; // Message action added or removed
    const type = ma.data.type; // Message action type
    const value = ma.data.value; // Message action value
    const messageTimetoken = ma.data.messageTimetoken; // Timetoken of the original message
    const actionTimetoken = ma.data.actionTimetoken; // Timetoken of the message action
  },
  // File Sharing
  file: function (event) {
    const channelName = event.channel; // Channel to which the file belongs
    const channelGroup = event.subscription; // Channel group or wildcard subscription match (if exists)
    const publisher = event.publisher; // File publisher
    const timetoken = event.timetoken; // Event timetoken

    const message = event.message; // Optional message attached to the file
    const fileId = event.file.id; // File unique id
    const fileName = event.file.name;// File name
    const fileUrl = event.file.url; // File direct URL
  }
});
```

----------------------------------------

TITLE: Publish Message to PubNub Channel - JavaScript
DESCRIPTION: Shows how to publish a message to a specific PubNub channel using the publish method, including options for sending via POST, storing in history, and including metadata. Includes basic error handling.
SOURCE: https://github.com/pubnub/javascript/blob/master/README.md#_snippet_3

LANGUAGE: javascript
CODE:
```
const channel = pubnub.channel('my_channel');
const subscription = channel.subscription();
subscription.subscribe();

try {
    // channel.publish is not a function 
    // you have to use pubnub.publish
    const result = await pubnub.publish({
        message: {
            such: "object",
        },
        channel: "my_channel",
        sendByPost: false, // true to send via post
        storeInHistory: false, //override default Message Persistence options
        meta: {
            cool: "meta",
        }, // publish extra meta with the request
    });
} catch (status) {
    console.log(status);
}
```


