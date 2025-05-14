TITLE: Configure and Initialize PubNub SDK (Java)
DESCRIPTION: Demonstrates how to create a PNConfiguration object with a UserId, subscribe key, and publish key, and then use it to instantiate the PubNub client. Requires valid keys from the PubNub Admin Portal.
SOURCE: https://github.com/pubnub/java/blob/master/README.md#_snippet_2

LANGUAGE: Java
CODE:
```
PNConfiguration pnConfiguration = new PNConfiguration(new UserId("myUserId"));
pnConfiguration.setSubscribeKey("mySubscribeKey");
pnConfiguration.setPublishKey("myPublishKey");

PubNub pubnub = new PubNub(pnConfiguration);
```

----------------------------------------

TITLE: Publishing a Message with PubNub - Java
DESCRIPTION: This code demonstrates how to publish a message to a PubNub channel using the asynchronous API. It shows how to specify the channel and message, and handle the success or failure of the publish operation using a callback.
SOURCE: https://github.com/pubnub/java/blob/master/README.md#_snippet_6

LANGUAGE: Java
CODE:
```
pubnub.publish().channel(channelName)
  .message(messageJsonObject)
  .async((result, publishStatus) -> {
    if (!publishStatus.isError()) {
        // Message successfully published to specified channel.
    } else { // Request processing failed.
        // Handle message publish error
        // Check 'category' property to find out
        // issues because of which the request failed.
        // Request can be resent using: [status retry];
    }
});
```

----------------------------------------

TITLE: Adding PubNub Event Listeners in Java
DESCRIPTION: This snippet shows how to add a `SubscribeCallback` listener to the PubNub client. The `SubscribeCallback` is an abstract class requiring implementation of methods to handle different event types: `status` for connection and operation status, `message` for incoming messages, `presence` for join/leave/state changes, and `signal` for incoming signals.
SOURCE: https://github.com/pubnub/java/blob/master/README.md#_snippet_3

LANGUAGE: Java
CODE:
```
// SubscribeCallback is an Abstract Java class. It requires that you implement all Abstract methods of the parent class even if you don't need all the handler methods.

pubnub.addListener(new SubscribeCallback() {
    // PubNub status
    @Override
    public void status(PubNub pubnub, PNStatus status) {
        switch (status.getOperation()) {
            // combine unsubscribe and subscribe handling for ease of use
            case PNSubscribeOperation:
            case PNUnsubscribeOperation:
                // Note: subscribe statuses never have traditional errors,
                // just categories to represent different issues or successes
                // that occur as part of subscribe
                switch (status.getCategory()) {
                    case PNConnectedCategory:
                        // No error or issue whatsoever.
                    case PNReconnectedCategory:
                        // Subscribe temporarily failed but reconnected.
                        // There is no longer any issue.
                    case PNDisconnectedCategory:
                        // No error in unsubscribing from everything.
                    case PNUnexpectedDisconnectCategory:
                        // Usually an issue with the internet connection.
                        // This is an error: handle appropriately.
                    case PNAccessDeniedCategory:
                        // PAM does not allow this client to subscribe to this
                        // channel and channel group configuration. This is
                        // another explicit error.
                    default:
                        // You can directly specify more errors by creating
                        // explicit cases for other error categories of
                        // `PNStatusCategory` such as `PNTimeoutCategory` or
                        // `PNMalformedFilterExpressionCategory` or
                        // `PNDecryptionErrorCategory`.
                }

            case PNHeartbeatOperation:
                // Heartbeat operations can in fact have errors,
                // so it's important to check first for an error.
                // For more information on how to configure heartbeat notifications
                // through the status PNObjectEventListener callback, refer to
                // /docs/android-java/api-reference-configuration#configuration_basic_usage
                if (status.isError()) {
                    // There was an error with the heartbeat operation, handle here
                } else {
                    // heartbeat operation was successful
                }
            default: {
                // Encountered unknown status type
            }
        }
    }

    // Messages
    @Override
    public void message(PubNub pubnub, PNMessageResult message) {
        String messagePublisher = message.getPublisher();
        System.out.println("Message publisher: " + messagePublisher);
        System.out.println("Message Payload: " + message.getMessage());
        System.out.println("Message Subscription: " + message.getSubscription());
        System.out.println("Message Channel: " + message.getChannel());
        System.out.println("Message timetoken: " + message.getTimetoken());
    }

    // Presence
    @Override
    public void presence(@NotNull PubNub pubnub, @NotNull PNPresenceEventResult presence) {
        System.out.println("Presence Event: " + presence.getEvent());
        // Can be join, leave, state-change or timeout

        System.out.println("Presence Channel: " + presence.getChannel());
        // The channel to which the message was published

        System.out.println("Presence Occupancy: " + presence.getOccupancy());
        // Number of users subscribed to the channel

        System.out.println("Presence State: " + presence.getState());
        // User state

        System.out.println("Presence UUID: " + presence.getUuid());
        // UUID to which this event is related

        presence.getJoin();
        // List of users that have joined the channel (if event is 'interval')

        presence.getLeave();
        // List of users that have left the channel (if event is 'interval')

        presence.getTimeout();
        // List of users that have timed-out off the channel (if event is 'interval')

        presence.getHereNowRefresh();
        // Indicates to the client that it should call 'hereNow()' to get the
        // complete list of users present in the channel.
    }

    // Signals
    @Override
    public void signal(PubNub pubnub, PNSignalResult pnSignalResult) {
        System.out.println("Signal publisher: " + signal.getPublisher());
        System.out.println("Signal payload: " + signal.getMessage());
        System.out.println("Signal subscription: " + signal.getSubscription());
        System.out.println("Signal channel: " + signal.getChannel());
    }
})
```

----------------------------------------

TITLE: Add PubNub SDK Dependency (Gradle)
DESCRIPTION: Explains how to include the PubNub Gson SDK in a Gradle project by adding the implementation dependency to the gradle.build file. Specifies the group ID, artifact ID, and version.
SOURCE: https://github.com/pubnub/java/blob/master/README.md#_snippet_1

LANGUAGE: Groovy
CODE:
```
implementation 'com.pubnub:pubnub-gson:6.4.5'
```

----------------------------------------

TITLE: Add PubNub SDK Dependency (Maven)
DESCRIPTION: Explains how to include the PubNub Gson SDK in a Maven project by adding the dependency to the pom.xml file. Specifies the group ID, artifact ID, and version.
SOURCE: https://github.com/pubnub/java/blob/master/README.md#_snippet_0

LANGUAGE: XML
CODE:
```
<dependency>
  <groupId>com.pubnub</groupId>
  <artifactId>pubnub-gson</artifactId>
  <version>6.4.5</version>
</dependency>
```

----------------------------------------

TITLE: Handling PubNub Signal and Message Action Events - Java
DESCRIPTION: This code demonstrates how to implement listener methods for PubNub signal and message action events. It shows how to access details like timetoken, type, value, UUID, and channel from the event results.
SOURCE: https://github.com/pubnub/java/blob/master/README.md#_snippet_4

LANGUAGE: Java
CODE:
```
System.out.println("Signal timetoken: " + signal.getTimetoken());
    }

    // Message actions
    @Override
    public void messageAction(PubNub pubnub, PNMessageActionResult pnActionResult) {
        PNMessageAction pnMessageAction = pnActionResult.getAction();
        System.out.println("Message action type: " + pnMessageAction.getType());
        System.out.println("Message action value: " + pnMessageAction.getValue());
        System.out.println("Message action uuid: " + pnMessageAction.getUuid());
        System.out.println("Message action actionTimetoken: " + pnMessageAction.getActionTimetoken());
        System.out.println("Message action messageTimetoken: " + pnMessageAction.getMessageTimetoken());]
        System.out.println("Message action subscription: " + pnActionResult.getSubscription());
        System.out.println("Message action channel: " + pnActionResult.getChannel());
        System.out.println("Message action timetoken: " + pnActionResult.getTimetoken());
    }
```

----------------------------------------

TITLE: Handling PubNub File Events - Java
DESCRIPTION: This code demonstrates how to implement a listener method for PubNub file events. It shows how to access details like channel, publisher, message, timetoken, and file metadata (id, name, url) from the event result.
SOURCE: https://github.com/pubnub/java/blob/master/README.md#_snippet_5

LANGUAGE: Java
CODE:
```
@Override
    public void file(PubNub pubnub, PNFileEventResult pnFileEventResult) {
        System.out.println("File channel: " + pnFileEventResult.getChannel());
        System.out.println("File publisher: " + pnFileEventResult.getPublisher());
        System.out.println("File message: " + pnFileEventResult.getMessage());
        System.out.println("File timetoken: " + pnFileEventResult.getTimetoken());
        System.out.println("File file.id: " + pnFileEventResult.getFile().getId());
        System.out.println("File file.name: " + pnFileEventResult.getFile().getName());
        System.out.println("File file.url: " + pnFileEventResult.getFile().getUrl());
    }
});
```

----------------------------------------

TITLE: Compiling Java Project with Gradle
DESCRIPTION: Executes the 'clean' task to remove build artifacts and then the 'compile' task to compile the project source code using Gradle.
SOURCE: https://github.com/pubnub/java/blob/master/DEVELOPER.md#_snippet_0

LANGUAGE: shell
CODE:
```
gradle clean compile
```

----------------------------------------

TITLE: Building Shadow JAR (Fat Jar) in Steps with Gradle
DESCRIPTION: Performs the build process for a 'fat' JAR (shadowJar) in separate steps: cleaning, running tests, and finally building the shadow JAR.
SOURCE: https://github.com/pubnub/java/blob/master/DEVELOPER.md#_snippet_2

LANGUAGE: shell
CODE:
```
gradle clean
```

LANGUAGE: shell
CODE:
```
gradle clean test
```

LANGUAGE: shell
CODE:
```
gradle build shadowJar
```

----------------------------------------

TITLE: Building Shadow JAR (Fat Jar) with Gradle
DESCRIPTION: Cleans the project, builds it, and creates a 'fat' JAR (shadowJar) containing all project dependencies using a single Gradle command.
SOURCE: https://github.com/pubnub/java/blob/master/DEVELOPER.md#_snippet_1

LANGUAGE: shell
CODE:
```
gradle clean build shadowJar
```

----------------------------------------

TITLE: Running Integration Tests with Gradle (Bash)
DESCRIPTION: This command demonstrates how to set the PubNub subscribe key using an environment variable and then execute the Gradle build and integration tests. This method overrides the value in the `test.properties` file.
SOURCE: https://github.com/pubnub/java/blob/master/src/integrationTest/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
export subKey=<SUBSCRIBE_KEY>
./gradlew build integrationTest
```

----------------------------------------

TITLE: Deploying to Nexus with Javadoc using Gradle
DESCRIPTION: Cleans the project, builds it, generates Javadoc documentation, and uploads the project artifacts to a configured Nexus repository.
SOURCE: https://github.com/pubnub/java/blob/master/DEVELOPER.md#_snippet_3

LANGUAGE: shell
CODE:
```
gradle clean build javadoc upload
```