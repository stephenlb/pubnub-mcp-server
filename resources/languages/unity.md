TITLE: Subscribing and Publishing with PubNub in C#
DESCRIPTION: Shows how to subscribe to a channel (`TestChannel`) and how to publish messages to that channel. Includes examples of publishing a simple string message and publishing a serialized object (like a transform position). Requires `await` for publish operations.
SOURCE: https://github.com/pubnub/unity/blob/master/README.md#_snippet_1

LANGUAGE: C#
CODE:
```
pubnub.Subscribe<string>().Channels(new[] { "TestChannel" }).Execute();

await pubnub.Publish().Channel("TestChannel").Message("Hello World from Unity!").ExecuteAsync();
// OR
await pubnub.Publish().Channel("TestChannel").Message(transform.position.GetJsonSafe()).ExecuteAsync();
```

----------------------------------------

TITLE: Adding PubNub Event Listeners in C#
DESCRIPTION: Demonstrates how to attach handler methods (`OnPnStatus`, `OnPnMessage`) to the `onStatus` and `onMessage` events of a PubNub listener object. The handler methods show basic logging of connection status and received messages.
SOURCE: https://github.com/pubnub/unity/blob/master/README.md#_snippet_0

LANGUAGE: C#
CODE:
```
listener.onStatus += OnPnStatus;
listener.onMessage += OnPnMessage;

void OnPnStatus(Pubnub pn, PNStatus status) {
    Debug.Log(status.Category == PNStatusCategory.PNConnectedCategory ? "Connected" : "Not connected");
}

void OnPnMessage(Pubnub pn, PNMessageResult<object> result) {
    Debug.Log($"Message received: {result.Message}");
}
```