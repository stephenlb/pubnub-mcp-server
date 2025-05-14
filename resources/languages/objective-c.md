TITLE: Add PubNub Listener - Objective-C
DESCRIPTION: Demonstrates how to add an object conforming to the `PNEventsListener` protocol to the PubNub client instance to start receiving events. The listener object will receive callbacks for various PubNub events.
SOURCE: https://github.com/pubnub/objective-c/blob/master/README.md#_snippet_2

LANGUAGE: objectivec
CODE:
```
// Listener's class should conform to `PNEventsListener` protocol
// in order to have access to available callbacks.

// Adding listener.
[pubnub addListener:self];
```

----------------------------------------

TITLE: Handle PubNub Message Event - Objective-C
DESCRIPTION: Implements the `client:didReceiveMessage:` callback to process incoming messages. It shows how to extract key message details like channel, subscription, timetoken, payload, and publisher from the `PNMessageResult` object.
SOURCE: https://github.com/pubnub/objective-c/blob/master/README.md#_snippet_3

LANGUAGE: objectivec
CODE:
```
- (void)client:(PubNub *)pubnub didReceiveMessage:(PNMessageResult *)message {
    NSString *channel = message.data.channel; // Channel on which the message has been published
    NSString *subscription = message.data.subscription; // Wild-card channel or channel on which PubNub client actually subscribed
    NSNumber *timetoken = message.data.timetoken; // Publish timetoken
    id msg = message.data.message; // Message payload
    NSString *publisher = message.data.publisher; // Message publisher
}
```

----------------------------------------

TITLE: Handle PubNub File Event - Objective-C
DESCRIPTION: Implements the `client:didReceiveFileEvent:` callback to process file upload events. It demonstrates extracting channel, subscription, associated message, publisher, and file details like download URL, identifier, and name.
SOURCE: https://github.com/pubnub/objective-c/blob/master/README.md#_snippet_8

LANGUAGE: objectivec
CODE:
```
- (void)client:(PubNub *)pubnub didReceiveFileEvent:(PNFileEventResult *)event {
    NSString *channel = event.data.channel; // Channel to which file has been uploaded
    NSString *subscription = event.data.subscription; // Wild-card channel or channel on which PubNub client actually subscribed
    id message = event.data.message; // Message added for uploaded file
    NSString *publisher = event.data.publisher; // UUID of file uploader
    NSURL *fileDownloadURL = event.data.file.downloadURL; // URL which can be used to download file
    NSString *fileIdentifier = event.data.file.identifier; // Unique file identifier
    NSString *fileName = event.data.file.name; // Name with which file has been stored remotely
}
```

----------------------------------------

TITLE: Handle PubNub Message Action Event - Objective-C
DESCRIPTION: Implements the `client:didReceiveMessageAction:` callback to process message action events (add/remove). It demonstrates extracting action details such as type, value, associated message timetoken, action timetoken, and the UUID of the user who performed the action.
SOURCE: https://github.com/pubnub/objective-c/blob/master/README.md#_snippet_5

LANGUAGE: objectivec
CODE:
```
- (void)client:(PubNub *)pubnub didReceiveMessageAction:(PNMessageActionResult *)action {
    NSString *channel = action.data.channel; // Channel on which the message has been published
    NSString *subscription = action.data.subscription; // Wild-card channel or channel on which PubNub client actually subscribed
    NSString *event = action.data.event; // Can be: added or removed
    NSString *type = action.data.action.type; // Message action type
    NSString *value = action.data.action.value; // Message action value
    NSNumber *messageTimetoken = action.data.action.messageTimetoken; // Timetoken of the original message
    NSNumber *actionTimetoken = action.data.action.actionTimetoken; // Timetoken of the message action
    NSString *uuid = action.data.action.uuid; // UUID of user which added / removed message action
}
```

----------------------------------------

TITLE: Initialize and Configure PubNub Client
DESCRIPTION: This Objective-C snippet demonstrates how to initialize and configure a PubNub client instance. It uses PNConfiguration to set the publish key, subscribe key, and a unique UUID before creating the PubNub client.
SOURCE: https://github.com/pubnub/objective-c/blob/master/README.md#_snippet_1

LANGUAGE: Objective-C
CODE:
```
// Initialize and configure PubNub client instance
PNConfiguration *configuration = [PNConfiguration configurationWithPublishKey: @"myPublishKey" subscribeKey:@"mySubscribeKey"];
configuration.uuid = @"myUniqueUUID";

self.client = [PubNub clientWithConfiguration:configuration];
```

----------------------------------------

TITLE: Handle PubNub Presence Event - Objective-C
DESCRIPTION: Implements the `client:didReceivePresenceEvent:` callback to process presence changes (join, leave, state-change, timeout, interval). It shows how to access event type, occupancy, timetoken, UUID, and state/interval-specific details.
SOURCE: https://github.com/pubnub/objective-c/blob/master/README.md#_snippet_6

LANGUAGE: objectivec
CODE:
```
- (void)client:(PubNub *)pubnub didReceivePresenceEvent:(PNPresenceEventResult *)event {
    NSString *channel = message.data.channel; // Channel on which presence changes
    NSString *subscription = message.data.subscription; // Wild-card channel or channel on which PubNub client actually subscribed
    NSString *presenceEvent = event.data.presenceEvent; // Can be: join, leave, state-change, timeout or interval
    NSNumber *occupancy = event.data.presence.occupancy; // Number of users subscribed to the channel (not available for state-change event)
    NSNumber *timetoken = event.data.presence.timetoken; // Presence change timetoken
    NSString *uuid = event.data.presence.uuid; // UUID of user for which presence change happened

    // Only for 'state-change' event
    NSDictionary *state = event.data.presence.state; // User state (only for state-change event)

    // Only for 'interval' event
    NSArray<NSString *> *join = event.data.presence.join; // UUID of users which recently joined channel
    NSArray<NSString *> *leave = event.data.presence.leave; // UUID of users which recently leaved channel
    NSArray<NSString *> *timeout = event.data.presence.timeout; // UUID of users which recently timed out on channel
}
```

----------------------------------------

TITLE: Handle PubNub Signal Event - Objective-C
DESCRIPTION: Implements the `client:didReceiveSignal:` callback to process incoming signals. It shows how to extract key signal details like channel, subscription, timetoken, payload, and publisher from the `PNSignalResult` object.
SOURCE: https://github.com/pubnub/objective-c/blob/master/README.md#_snippet_4

LANGUAGE: objectivec
CODE:
```
- (void)client:(PubNub *)pubnub didReceiveSignal:(PNSignalResult *)signal {
    NSString *channel = message.data.channel; // Channel on which the signal has been published
    NSString *subscription = message.data.subscription; // Wild-card channel or channel on which PubNub client actually subscribed
    NSNumber *timetoken = message.data.timetoken; // Signal timetoken
    id msg = message.data.message; // Signal payload
    NSString *publisher = message.data.publisher; // Signal publisher
}
```

----------------------------------------

TITLE: Handle PubNub Object Event - Objective-C
DESCRIPTION: Implements the `client:didReceiveObjectEvent:` callback to process object metadata updates (channel, UUID, membership). It shows how to extract the event type, entity type, timestamp, and the relevant updated metadata object.
SOURCE: https://github.com/pubnub/objective-c/blob/master/README.md#_snippet_7

LANGUAGE: objectivec
CODE:
```
- (void)client:(PubNub *)pubnub didReceiveObjectEvent:(PNObjectEventResult *)event {
    NSString *channel = event.data.channel; // Channel to which the event belongs
    NSString *subscription = event.data.subscription; // Wild-card channel or channel on which PubNub client actually subscribed
    NSString *event = event.data.event; // Can be: set or delete
    NSString *type = event.data.type; // Entity type: channel, uuid or membership
    NSNumber *timestamp = event.data.timestamp; // Event timestamp

    PNChannelMetadata *channelMetadata = event.data.channelMetadata; // Updated channel metadata (only for channel entity type)
    PNUUIDMetadata *uuidMetadata = event.data.uuidMetadata; // Updated channel metadata (only for uuid entity type)
    PNMembership *membership = event.data.membership; // Updated channel metadata (only for membership entity type)
}
```

----------------------------------------

TITLE: Publishing and Subscribing with PubNub Objective-C
DESCRIPTION: Demonstrates how to publish a simple message to a specified channel and how to subscribe to a list of channels with presence enabled using the PubNub Objective-C client. Includes basic error handling for the publish operation.
SOURCE: https://github.com/pubnub/objective-c/blob/master/README.md#_snippet_10

LANGUAGE: Objective-C
CODE:
```
[self.client publish:@{ @ "msg": @"hello" } toChannel:targetChannel
      withCompletion:^(PNPublishStatus *publishStatus) {
          if (!publishStatus.isError) {
              // Message successfully published to specified channel.
          } else {
              /**
               * Handle message publish error. Check 'category' property to find out
               * possible reason because of which request did fail.
               * Review 'errorData' property (which has PNErrorData data type) of status
               * object to get additional information about issue.
               *
               * Request can be resent using: [publishStatus retry];
               */
          }
}];

[self.client subscribeToChannels: @[@"hello-world-channel"] withPresence:YES];
```

----------------------------------------

TITLE: Handle PubNub Status Event - Objective-C
DESCRIPTION: Implements the `client:didReceiveStatus:` callback to process status updates from the PubNub client. This callback is crucial for monitoring the connection state and operation outcomes. Note: The provided snippet is incomplete.
SOURCE: https://github.com/pubnub/objective-c/blob/master/README.md#_snippet_9

LANGUAGE: objectivec
CODE:
```
- (void)client:(PubNub *)pubnub didReceiveStatus:(PNStatus *)status {
```

----------------------------------------

TITLE: Configure PubNub Pod Dependency in Podfile
DESCRIPTION: This Groovy snippet shows how to add the PubNub SDK as a dependency in a CocoaPods Podfile for an iOS project targeting version 9.0 or later. It specifies the use of frameworks and the PubNub pod version.
SOURCE: https://github.com/pubnub/objective-c/blob/master/README.md#_snippet_0

LANGUAGE: Groovy
CODE:
```
platform :ios, '9.0'

target 'application-target-name' do
    use_frameworks!

    pod "PubNub", "~> 4"
end
```