TITLE: Configuring PubNub Client in Kotlin
DESCRIPTION: Configure the PubNub client instance in Kotlin using your user ID, subscribe key, and publish key. This involves building a PNConfiguration object and creating the PubNub instance.
SOURCE: https://github.com/pubnub/kotlin/blob/master/README.md#_snippet_2

LANGUAGE: Kotlin
CODE:
```
val config = PNConfiguration.builder(UserId("myUserId"), "mySubKey") {
    publishKey = "myPubKey"
}
val pubnub = PubNub.create(config.build())
```

----------------------------------------

TITLE: Adding PubNub Dependency with Gradle
DESCRIPTION: Add the PubNub Kotlin SDK dependency to your project's gradle.build file using Gradle. Specify the implementation dependency with the group ID, artifact ID, and version.
SOURCE: https://github.com/pubnub/kotlin/blob/master/README.md#_snippet_1

LANGUAGE: Groovy
CODE:
```
implementation ("com.pubnub:pubnub-kotlin:10.0.0")
```

----------------------------------------

TITLE: Adding PubNub Dependency with Maven
DESCRIPTION: Add the PubNub Kotlin SDK dependency to your project's pom.xml file using Maven. This includes the group ID, artifact ID, and version of the SDK.
SOURCE: https://github.com/pubnub/kotlin/blob/master/README.md#_snippet_0

LANGUAGE: XML
CODE:
```
<dependency>
   <groupId>com.pubnub</groupId>
   <artifactId>pubnub-kotlin</artifactId>
   <version>10.5.1</version>
</dependency>
```

----------------------------------------

TITLE: Adding Event Listeners in Kotlin
DESCRIPTION: Add various event listeners to a PubNub subscription and the PubNub client in Kotlin. This includes handling messages, signals, actions, files, objects, presence events, and connection status updates.
SOURCE: https://github.com/pubnub/kotlin/blob/master/README.md#_snippet_3

LANGUAGE: Kotlin
CODE:
```
// Create a subscription to a specific channel
val subscription = pubnub.channel("my_channel").subscription(SubscriptionOptions.receivePresenceEvents())

// Add a listener to the subscription for handling various event types
subscription.addListener(object : EventListener {
    override fun message(pubnub: PubNub, message: PNMessageResult) {
        // Log or process message
        println("Message: ${message.message}")
    }

    override fun signal(pubnub: PubNub, signal: PNSignalResult) {
        // Handle signals
        println("Signal: ${signal.message}")
    }

    override fun messageAction(pubnub: PubNub, messageAction: PNMessageActionResult) {
        // Handle message reactions
        println("Message Reaction: ${messageAction.data}")
    }

    override fun file(pubnub: PubNub, file: PNFileEventResult) {
        // Handle file events
        println("File: ${file.file.name}")
    }

    override fun objects(pubnub: PubNub, obj: PNObjectEventResult) {
        // Handle metadata updates
        println("App Context: ${obj.event}")
    }

    override fun presence(pubnub: PubNub, presence: PNPresenceEventResult) {
        // Handle presence updates
        // requires a subscription with presence
        println("Presence: ${presence.uuid} - ${presence.event}")
    }
})

// Adding the status listener to the PubNub client
pubnub.addListener(object : StatusListener() {
    override fun status(pubnub: PubNub, status: PNStatus) {
        // This block is executed asynchronously for each status update
        println("Connection Status: ${status.category}")
    }
})
```

----------------------------------------

TITLE: Subscribe to Channels - PubNub Kotlin
DESCRIPTION: Shows a simplified way to initiate a subscription using a subscription object, likely part of a newer API or pattern.
SOURCE: https://github.com/pubnub/kotlin/blob/master/README.md#_snippet_7

LANGUAGE: kotlin
CODE:
```
subscription.subscribe()
```

----------------------------------------

TITLE: Publish Message (New Way) - PubNub Kotlin
DESCRIPTION: Demonstrates publishing a message using a channel object obtained from the PubNub instance, handling the asynchronous result with onSuccess and onFailure callbacks.
SOURCE: https://github.com/pubnub/kotlin/blob/master/README.md#_snippet_9

LANGUAGE: kotlin
CODE:
```
    val channel = pubnub.channel("my_channel")
    channel.publish(message = "hello").async { result ->
        result.onSuccess { response ->
            println("Message timetoken: ${response.timetoken}")
        }.onFailure { exception ->
            println("ERROR: Failed to publish message")
            println("Error details: ${exception.message}")
        }
    }

```

----------------------------------------

TITLE: Creating a Subscription Set in Kotlin
DESCRIPTION: Create a SubscriptionSet in Kotlin to manage subscriptions to multiple channels simultaneously. This allows grouping channels for unified event handling.
SOURCE: https://github.com/pubnub/kotlin/blob/master/README.md#_snippet_4

LANGUAGE: Kotlin
CODE:
```
// for subscription set
val subscriptionSet = pubnub.subscriptionSetOf(
    // Specify channels with default options
    channels = setOf("my_channel", "other_channel")
)
```

----------------------------------------

TITLE: Adding Listener to Subscription Set in Kotlin
DESCRIPTION: Add an EventListener specifically to a SubscriptionSet in Kotlin. This listener will receive events from all channels included in the set.
SOURCE: https://github.com/pubnub/kotlin/blob/master/README.md#_snippet_5

LANGUAGE: Kotlin
CODE:
```
subscriptionSet.addListener(object : EventListener {
    override fun message(pubnub: PubNub, message: PNMessageResult) {
        // Log or process message
        println("Message: ${message.message}")
    }
})
```

----------------------------------------

TITLE: Execute Integration Tests via Gradle
DESCRIPTION: This snippet shows how to set the PubNub subscribe key using an environment variable and then execute the `build` and `integrationTest` Gradle tasks. This is the command-line method for running the integration tests.
SOURCE: https://github.com/pubnub/kotlin/blob/master/pubnub-gson/pubnub-gson-impl/src/integrationTest/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
> export subKey=<SUBSCRIBE_KEY>
> ./gradlew build integrationTest
```

----------------------------------------

TITLE: Subscribe to Channels (Contextual) - PubNub Kotlin
DESCRIPTION: This snippet appears immediately after the "Publish old way" example, likely providing context or showing a related operation. It demonstrates subscribing to a channel using the older method.
SOURCE: https://github.com/pubnub/kotlin/blob/master/README.md#_snippet_11

LANGUAGE: kotlin
CODE:
```
pubnub.subscribe(channels = listOf("my_channel"))
```

----------------------------------------

TITLE: Add Event Listeners (Old Way) - PubNub Kotlin
DESCRIPTION: Demonstrates how to add a SubscribeCallback listener to a PubNub instance using the older API style to handle various events like status changes, presence, messages, signals, and message actions.
SOURCE: https://github.com/pubnub/kotlin/blob/master/README.md#_snippet_6

LANGUAGE: kotlin
CODE:
```
pubnub.addListener(object : SubscribeCallback() {

    override fun status(pubnub: PubNub, status: PNStatus) {
        println("Status category: ${status.category}")
        // PNConnectedCategory, PNReconnectedCategory, PNDisconnectedCategory

        println("Status operation: ${status.operation}")
        // PNSubscribeOperation, PNHeartbeatOperation

        println("Status error: ${status.error}")
        // true or false
    }

    override fun presence(pubnub: PubNub, pnPresenceEventResult: PNPresenceEventResult) {
        println("Presence event: ${pnPresenceEventResult.event}")
        println("Presence channel: ${pnPresenceEventResult.channel}")
        println("Presence uuid: ${pnPresenceEventResult.uuid}")
        println("Presence timetoken: ${pnPresenceEventResult.timetoken}")
        println("Presence occupancy: ${pnPresenceEventResult.occupancy}")
    }

    override fun message(pubnub: PubNub, pnMessageResult: PNMessageResult) {
        println("Message payload: ${pnMessageResult.message}")
        println("Message channel: ${pnMessageResult.channel}")
        println("Message publisher: ${pnMessageResult.publisher}")
        println("Message timetoken: ${pnMessageResult.timetoken}")
    }

    override fun signal(pubnub: PubNub, pnSignalResult: PNSignalResult) {
        println("Signal payload: ${pnSignalResult.message}")
        println("Signal channel: ${pnSignalResult.channel}")
        println("Signal publisher: ${pnSignalResult.publisher}")
        println("Signal timetoken: ${pnSignalResult.timetoken}")
    }

    override fun messageAction(pubnub: PubNub, pnMessageActionResult: PNMessageActionResult) {
        with(pnMessageActionResult.messageAction) {
            println("Message action type: $type")
            println("Message action value: $value")
            println("Message action uuid: $uuid")
            println("Message action actionTimetoken: $actionTimetoken")
            println("Message action messageTimetoken: $messageTimetoken")
        }

        println("Message action subscriptions: ${pnMessageActionResult.subscription}")
        println("Message action channel: ${pnMessageActionResult.channel}")
        println("Message action timetoken: ${pnMessageActionResult.timetoken}")
    }
})
```

----------------------------------------

TITLE: Publish Message (Old Way) - PubNub Kotlin
DESCRIPTION: Shows the older method for publishing a message directly on the pubnub instance, handling the asynchronous result with onSuccess and onFailure callbacks.
SOURCE: https://github.com/pubnub/kotlin/blob/master/README.md#_snippet_10

LANGUAGE: kotlin
CODE:
```
pubnub.publish(channel = "my_channel", message = "hello")
    .async { result -> 
    // the result is always of a nullable type
    // it's null if there were errors (status.error)
    // otherwise it's usable

    // handle publish result
    result.onSuccess { res ->
        println("Message timetoken: ${res!!.timetoken}")
    }.onFailure { exception ->
        // handle error
        exception.printStackTrace()
    }
}
```

----------------------------------------

TITLE: Subscribe to Channels (Old Way) - PubNub Kotlin
DESCRIPTION: Illustrates the older method for subscribing to channels and optionally including presence events directly on the pubnub instance.
SOURCE: https://github.com/pubnub/kotlin/blob/master/README.md#_snippet_8

LANGUAGE: kotlin
CODE:
```
pubnub.subscribe(channels = listOf("my_channel"), withPresence = true)
```