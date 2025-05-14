TITLE: Publishing and Subscribing in Go
DESCRIPTION: Shows how to subscribe to a specific channel ("hello_world"), wait for the connection to be established (using the doneConnect channel from the listener setup), and then publish a message to that channel using the PubNub client instance. Includes basic error handling for the publish operation.
SOURCE: https://github.com/pubnub/go/blob/master/README.md#_snippet_3

LANGUAGE: Go
CODE:
```
msg := map[string]interface{}{
        "msg": "Hello world!"
}

pn.Subscribe().
    Channels([]string{"hello_world"}).
    Execute()

<-doneConnect

response, status, err := pn.Publish().
    Channel("hello_world").Message(msg).Execute()

if err != nil {
     // Request processing failed.
     // Handle message publish error
}
```

----------------------------------------

TITLE: Adding Event Listeners in Go
DESCRIPTION: Illustrates how to create a PubNub listener, set up channels for synchronization (e.g., doneConnect, donePublish), and run a goroutine to process incoming status, message, and presence events from the listener's channels. The listener must be added to the PubNub client instance.
SOURCE: https://github.com/pubnub/go/blob/master/README.md#_snippet_2

LANGUAGE: Go
CODE:
```
listener := pubnub.NewListener()
doneConnect := make(chan bool)
donePublish := make(chan bool)

msg := map[string]interface{}{
    "msg": "Hello world",
}
go func() {
    for {
        select {
        case status := <-listener.Status:
            switch status.Category {
            case pubnub.PNDisconnectedCategory:
                // This event happens when radio / connectivity is lost
            case pubnub.PNConnectedCategory:
                // Connect event. You can do stuff like publish, and know you'll get it.
                // Or just use the connected event to confirm you are subscribed for
                // UI / internal notifications, etc
                doneConnect <- true
            case pubnub.PNReconnectedCategory:
                // Happens as part of our regular operation. This event happens when
                // radio / connectivity is lost, then regained.
            }
        case message := <-listener.Message:
            // Handle new message stored in message.message
            if message.Channel != "" {
                // Message has been received on channel group stored in
                // message.Channel
            } else {
                // Message has been received on channel stored in
                // message.Subscription
            }
            if msg, ok := message.Message.(map[string]interface{}); ok {
                fmt.Println(msg["msg"])
            }
            /*
                log the following items with your favorite logger
                    - message.Message
                    - message.Subscription
                    - message.Timetoken
            */

            donePublish <- true
        case <-listener.Presence:
            // handle presence
        }
    }
}()

pn.AddListener(listener)
```

----------------------------------------

TITLE: Configuring PubNub Client in Go
DESCRIPTION: Demonstrates how to create a new PubNub configuration object, set the subscribe and publish keys, and initialize the PubNub client instance using the provided configuration. Requires valid keys from the PubNub Admin Portal.
SOURCE: https://github.com/pubnub/go/blob/master/README.md#_snippet_1

LANGUAGE: Go
CODE:
```
func main() {
    config := pubnub.NewConfigWithUserId("userId")
    config.SubscribeKey = "mySubscribeKey"
    config.PublishKey = "myPublishKey"

    pn := pubnub.NewPubNub(config)
}
```

----------------------------------------

TITLE: Installing PubNub Go SDK
DESCRIPTION: Command to fetch and install the PubNub Go SDK using the standard Go package manager. This is the first step to integrate the SDK into a Go project.
SOURCE: https://github.com/pubnub/go/blob/master/README.md#_snippet_0

LANGUAGE: Go
CODE:
```
go get github.com/pubnub/go
```