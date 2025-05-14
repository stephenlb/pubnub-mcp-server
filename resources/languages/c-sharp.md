TITLE: Publishing and Subscribing with PubNub C# SDK
DESCRIPTION: This snippet illustrates the basic publish and subscribe flow. It shows how to create a message dictionary, subscribe to a specific channel, and then asynchronously publish the message to that channel. It also demonstrates how to retrieve the publish result and status.
SOURCE: https://github.com/pubnub/c-sharp/blob/master/README.md#_snippet_2

LANGUAGE: csharp
CODE:
```
Dictionary<string, string> message = new Dictionary<string, string>();
    message.Add("msg", "Hello world!");

pubnub.Subscribe<string>()
        .Channels(new string[]{
            "my_channel"
        }).Execute();

PNResult<PNPublishResult> publishResponse = await pubnub.Publish()
                                            .Message(message)
                                            .Channel("my_channel")
                                            .ExecuteAsync();
PNPublishResult publishResult = publishResponse.Result;
PNStatus status = publishResponse.Status;
Console.WriteLine("pub timetoken: " + publishResult.Timetoken.ToString());
Console.WriteLine("pub status code : " + status.StatusCode.ToString());
```

----------------------------------------

TITLE: Configuring PubNub C# SDK
DESCRIPTION: This snippet shows the minimum configuration required to initialize the PubNub SDK in C#. It demonstrates how to create a PNConfiguration object, set the UserId, SubscribeKey, and PublishKey, and instantiate the Pubnub client. This setup is essential before performing any PubNub operations.
SOURCE: https://github.com/pubnub/c-sharp/blob/master/README.md#_snippet_0

LANGUAGE: csharp
CODE:
```
using PubnubApi;

PNConfiguration pnConfiguration = new PNConfiguration(new UserId("myUniqueUserId"));
pnConfiguration.SubscribeKey = "mySubscribeKey";
pnConfiguration.PublishKey = "myPublishKey";
Pubnub pubnub = new Pubnub(pnConfiguration);
```

----------------------------------------

TITLE: Adding PubNub Subscribe Event Listeners (C#)
DESCRIPTION: This code demonstrates how to add event listeners to the Pubnub client using SubscribeCallbackExt. It includes delegates to handle incoming messages (PNMessageResult) and presence events (PNPresenceEventResult), showing how to access data like channel, publisher, timetoken, and message content.
SOURCE: https://github.com/pubnub/c-sharp/blob/master/README.md#_snippet_1

LANGUAGE: csharp
CODE:
```
pubnub.AddListener(new SubscribeCallbackExt(
    delegate (Pubnub pnObj, PNMessageResult<object> pubMsg)
    {
        if (pubMsg != null) {
            Debug.WriteLine("In Example, SubscribeCallback received PNMessageResult");
            Debug.WriteLine("In Example, SubscribeCallback messsage channel = " + pubMsg.Channel);
            Debug.WriteLine("In Example, SubscribeCallback messsage channelGroup = " + pubMsg.Subscription);
            Debug.WriteLine("In Example, SubscribeCallback messsage publishTimetoken = " + pubMsg.Timetoken);
            Debug.WriteLine("In Example, SubscribeCallback messsage publisher = " + pubMsg.Publisher);
            string jsonString = pubMsg.Message.ToString();
            Dictionary<string, string> msg = pubnub.JsonPluggableLibrary.DeserializeToObject<Dictionary<string,string>>(jsonString);
            Debug.WriteLine("msg: " + msg["msg"]);
        }
    },
    delegate (Pubnub pnObj, PNPresenceEventResult presenceEvnt)
    {
        if (presenceEvnt != null) {
            Debug.WriteLine("In Example, SubscribeCallback received PNPresenceEventResult");
            Debug.WriteLine(presenceEvnt.Channel + " " + presenceEvnt.Occupancy + " " + presenceEvnt.Event);
        }
    }
))
```

----------------------------------------

TITLE: Opening Android Asset File in C#
DESCRIPTION: Demonstrates how to open a raw asset file (e.g., "my_asset.txt") from the application's assets directory using the `Assets.Open` method within an Android Activity's `OnCreate` method. This provides an `InputStream` to read the file content.
SOURCE: https://github.com/pubnub/c-sharp/blob/master/src/Examples/mono-for-android/PubNubMessaging.Example/Assets/AboutAssets.txt#_snippet_0

LANGUAGE: C#
CODE:
```
public class ReadAsset : Activity
{
    protected override void OnCreate (Bundle bundle)
    {
        base.OnCreate (bundle);

        InputStream input = Assets.Open ("my_asset.txt");
    }
}
```

----------------------------------------

TITLE: Loading Typeface from Android Asset in C#
DESCRIPTION: Shows how to load a font file (e.g., "fonts/samplefont.ttf") directly from the application's assets directory using the `Typeface.CreateFromAsset` method, which is a common pattern for functions that automatically utilize assets.
SOURCE: https://github.com/pubnub/c-sharp/blob/master/src/Examples/mono-for-android/PubNubMessaging.Example/Assets/AboutAssets.txt#_snippet_1

LANGUAGE: C#
CODE:
```
Typeface tf = Typeface.CreateFromAsset (Context.Assets, "fonts/samplefont.ttf");
```

----------------------------------------

TITLE: Generated R Class for Android Resources (C#)
DESCRIPTION: This C# code snippet shows the structure of the automatically generated 'R' class. This class contains nested classes (e.g., 'drawable', 'layout', 'strings') with constant integer fields representing the unique IDs assigned to each resource item during the build process. These IDs are used by native Android APIs to reference resources instead of file paths.
SOURCE: https://github.com/pubnub/c-sharp/blob/master/src/Examples/mono-for-android/PubNubMessaging.Example/Resources/AboutResources.txt#_snippet_0

LANGUAGE: csharp
CODE:
```
public class R {
    public class drawable {
        public const int icon = 0x123;
    }

    public class layout {
        public const int main = 0x456;
    }

    public class strings {
        public const int first_string = 0xabc;
        public const int second_string = 0xbcd;
    }
}
```