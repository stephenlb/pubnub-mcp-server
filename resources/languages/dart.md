TITLE: Installing PubNub Dart SDK using Pub
DESCRIPTION: This YAML snippet shows how to add the `pubnub` package as a dependency in your `pubspec.yaml` file. This is the standard way to include the SDK in Dart or Flutter projects using the `pub` dependency management tool. After adding, run `dart pub get`.
SOURCE: https://github.com/pubnub/dart/blob/master/pubnub/README.md#_snippet_0

LANGUAGE: yaml
CODE:
```
dependencies:
  pubnub: ^5.2.0
```

----------------------------------------

TITLE: Integrating PubNub Dart SDK Dependency
DESCRIPTION: This YAML snippet shows how to add the PubNub Dart SDK as a dependency in your `pubspec.yml` file. It specifies the `pubnub` package and its version, allowing the `dart pub get` or `flutter pub get` command to install it.
SOURCE: https://github.com/pubnub/dart/blob/master/README.md#_snippet_0

LANGUAGE: YAML
CODE:
```
dependencies:
  pubnub: ^4.2.2
```

----------------------------------------

TITLE: Performing PubNub Publish and Subscribe in Dart
DESCRIPTION: This Dart snippet illustrates the basic publish and subscribe operations using the PubNub SDK. It defines a channel, subscribes to it, and then publishes a 'Hello world' message to that channel, demonstrating fundamental real-time communication.
SOURCE: https://github.com/pubnub/dart/blob/master/README.md#_snippet_5

LANGUAGE: Dart
CODE:
```
var channel = "getting_started";
var subscription = pubnub.subscribe(channels: {channel});

await pubnub.publish(channel, "Hello world");
```

----------------------------------------

TITLE: Creating a PubNub Keyset Instance
DESCRIPTION: This Dart code initializes a `Keyset` instance, which holds all necessary PubNub configuration. It requires `subscribeKey`, `publishKey`, and a `UUID`. For production, replace 'demo' keys with your actual keys from the PubNub dashboard.
SOURCE: https://github.com/pubnub/dart/blob/master/pubnub/README.md#_snippet_4

LANGUAGE: dart
CODE:
```
final myKeyset = Keyset(
  subscribeKey: 'demo',
  publishKey: 'demo',
  uuid: UUID('demo'));
```

----------------------------------------

TITLE: Configuring PubNub Dart SDK with Keys
DESCRIPTION: This Dart snippet demonstrates how to initialize the PubNub client by providing your `subscribeKey`, `publishKey`, and a unique `uuid` to the `Keyset` object. This configuration is essential for authenticating your application with the PubNub Data Streaming Network.
SOURCE: https://github.com/pubnub/dart/blob/master/README.md#_snippet_1

LANGUAGE: Dart
CODE:
```
var pubnub = PubNub(
      defaultKeyset:
          Keyset(subscribeKey: 'mySubscribeKey', publishKey: 'myPublishKey', uuid: UUID('ReplaceWithYourClientIdentifier')));
```

----------------------------------------

TITLE: Instantiating the PubNub Client
DESCRIPTION: This Dart snippet creates an instance of the `PubNub` client, passing the previously defined `myKeyset` as the `defaultKeyset`. This `pubnub` instance is then used for all subsequent operations like publishing and subscribing, unless a different keyset is explicitly provided.
SOURCE: https://github.com/pubnub/dart/blob/master/pubnub/README.md#_snippet_5

LANGUAGE: dart
CODE:
```
final pubnub = PubNub(defaultKeyset: myKeyset);
```

----------------------------------------

TITLE: Adding PubNub Message Event Listener in Dart
DESCRIPTION: This Dart snippet shows how to add a listener to the `messages` stream of a PubNub `Subscription` to handle various incoming message types. It uses a `switch` statement to differentiate between normal messages, signals, objects, message actions, and file events, printing relevant information for each.
SOURCE: https://github.com/pubnub/dart/blob/master/README.md#_snippet_2

LANGUAGE: Dart
CODE:
```
/*A Subscription contains a Dart Stream of messages from the channel(s) to which you are subscribed. You can transform that stream in the usual ways, or add a listener using listen:*/
  subscription.messages.listen((envelope) {
    switch (envelope.messageType) {
      case MessageType.normal:
          print('${envelope.publishedBy} sent a message: ${envelope.content}');
          break;
      case MessageType.signal:
          print('${envelope.publishedBy} sent a signal message: ${envelope.content}');
        break;
      case MessageType.objects:
          print('object event received from ${envelope.publishedBy} with data ${envelope.payload['data']}');
        break;
      case MessageType.messageAction:
          print('message action event ${envelope.payload['event']} received with data ${envelope.payload['data']}');
        break;
      case MessageType.file:
          var fileInfo = envelope.payload['file'];
          var id = fileInfo['id']; // unique file id
          var name = fileInfo['name']; // file name
          print('${envelope.publishedBy} sends file $name with message  ${envelope.payload['message']}');
        break;
      default:
        print('${envelope.publishedBy} sent a message: ${envelope.content}');
    }
  });
```

----------------------------------------

TITLE: Importing PubNub in Dart
DESCRIPTION: This Dart snippet illustrates two ways to import the PubNub SDK. You can either import all objects into the current namespace using `package:pubnub/core.dart` or import it into a named namespace (e.g., `pn`) using `package:pubnub/pubnub.dart` to avoid naming conflicts.
SOURCE: https://github.com/pubnub/dart/blob/master/pubnub/README.md#_snippet_3

LANGUAGE: dart
CODE:
```
// Import all PubNub objects into your namespace
import 'package:pubnub/core.dart';

// Or import PubNub into a named namespace
import 'package:pubnub/pubnub.dart' as pn;
```

----------------------------------------

TITLE: Publishing a Message to a Channel
DESCRIPTION: This Dart code demonstrates how to publish a message to a specified channel using the `publish` method of the `PubNub` instance. The message payload can be any JSON-serializable object, here shown as a simple map.
SOURCE: https://github.com/pubnub/dart/blob/master/pubnub/README.md#_snippet_6

LANGUAGE: dart
CODE:
```
pubnub.publish('my_channel', { 'content': 'Hello world!' });
```

----------------------------------------

TITLE: Subscribing to Multiple Channels
DESCRIPTION: This Dart code subscribes the PubNub client to a set of specified channels. The `subscribe` method returns a `Subscription` object, which provides access to the message stream from the subscribed channels.
SOURCE: https://github.com/pubnub/dart/blob/master/pubnub/README.md#_snippet_8

LANGUAGE: dart
CODE:
```
var subscription = pubnub.subscribe(channels: {'ch1', 'ch2'});
```

----------------------------------------

TITLE: Listening to Subscription Messages
DESCRIPTION: This Dart code shows how to process incoming messages from a `Subscription`. It uses the `listen` method on the `messages` stream to print each received message's UUID and payload. It also demonstrates using `firstWhere` to await a specific message.
SOURCE: https://github.com/pubnub/dart/blob/master/pubnub/README.md#_snippet_10

LANGUAGE: dart
CODE:
```
subscription.messages.listen((envelope) {
  print('${envelope.uuid} sent a message: ${envelope.payload}');
});

var envelope =
      await sub.messages.firstWhere((envelope) => envelope.channel == 'ch2');
```

----------------------------------------

TITLE: Publishing Messages using Channel Abstraction
DESCRIPTION: This Dart snippet shows how to use the `channel` abstraction for publishing multiple messages to the same channel. First, an instance of `Channel` is obtained, then its `publish` method can be called repeatedly with different JSON-serializable payloads.
SOURCE: https://github.com/pubnub/dart/blob/master/pubnub/README.md#_snippet_7

LANGUAGE: dart
CODE:
```
final myChannel = pubnub.channel('my_channel');

myChannel.publish(200);
myChannel.publish({ 'answer': 42 });
```

----------------------------------------

TITLE: Subscribing to a Single Channel Instance
DESCRIPTION: This Dart snippet demonstrates subscribing to a channel using a pre-existing `Channel` instance. This method is a convenient way to subscribe when you've already abstracted a specific channel, returning a `Subscription` object.
SOURCE: https://github.com/pubnub/dart/blob/master/pubnub/README.md#_snippet_9

LANGUAGE: dart
CODE:
```
var subscription = myChannel.subscribe();
```

----------------------------------------

TITLE: Adding PubNub Presence Event Listener in Dart
DESCRIPTION: This Dart snippet demonstrates how to add a listener to the `presence` stream of a PubNub `Subscription`. It captures and prints details about presence events, including the action, UUID of the participant, timetoken, and current channel occupancy.
SOURCE: https://github.com/pubnub/dart/blob/master/README.md#_snippet_3

LANGUAGE: Dart
CODE:
```
subscription.presence.listen((event) {
      print('''Presence Event with action: ${event.action},
      received from uuid: ${event.uuid}
      with time token: ${event.timetoken},
      Total Occupancy now is: ${event.occupancy}
      ''');
  });
```

----------------------------------------

TITLE: Fetching Channel History Gradually
DESCRIPTION: This Dart snippet retrieves past messages from a channel incrementally using `channel.history`. It fetches messages in chunks (e.g., 50 at a time) in descending order, allowing for gradual loading of historical data.
SOURCE: https://github.com/pubnub/dart/blob/master/pubnub/README.md#_snippet_11

LANGUAGE: dart
CODE:
```
var history = myChannel.history(chunkSize: 50);

await history.more();
print(history.messages.length); // 50
await history.more();
print(history.messages.length); // 100
```

----------------------------------------

TITLE: Fetching and Managing Channel History in Bulk
DESCRIPTION: This Dart code demonstrates fetching and managing channel history in bulk using `channel.messages`. It allows fetching messages from a specific timetoken, counting total messages, fetching all matched messages, and critically, deleting them. Use the `delete` method with caution as it permanently removes messages.
SOURCE: https://github.com/pubnub/dart/blob/master/pubnub/README.md#_snippet_12

LANGUAGE: dart
CODE:
```
var history = myChannel.messages(from: Timetoken(1234567890));

var count = await history.count();
print(count);

var messages = await history.fetch();
print(messages.length);

await history.delete(); // Beware! This will delete all messages matched
```

----------------------------------------

TITLE: Adding Named Keysets to PubNub Instance
DESCRIPTION: This Dart snippet shows how to add multiple `Keyset` instances to a `PubNub` client, associating each with a unique name. This allows for easy switching between different configurations when performing operations.
SOURCE: https://github.com/pubnub/dart/blob/master/pubnub/README.md#_snippet_13

LANGUAGE: dart
CODE:
```
pubnub.keysets.add(myKeyset1, name: 'keyset1');
pubnub.keysets.add(myKeyset2, name: 'keyset2');
```

----------------------------------------

TITLE: Using Named Keysets in PubNub Operations
DESCRIPTION: This Dart code demonstrates how to specify which named keyset to use for a particular PubNub operation. By passing the `using` parameter with the keyset's name, you can perform actions like publishing or creating channel instances with different configurations.
SOURCE: https://github.com/pubnub/dart/blob/master/pubnub/README.md#_snippet_14

LANGUAGE: dart
CODE:
```
pubnub.publish('channel', 42, using: 'keyset1');
var myChannel = pubnub.channel('channel', using: 'keyset2');
```

----------------------------------------

TITLE: Retrieving First Message by Channel in Dart
DESCRIPTION: This Dart snippet shows how to asynchronously wait for the first message on a specific channel from a PubNub subscription's message stream. It uses `firstWhere` to filter envelopes by channel, useful for ensuring a message from a particular channel is received.
SOURCE: https://github.com/pubnub/dart/blob/master/README.md#_snippet_4

LANGUAGE: Dart
CODE:
```
var envelope =
    await subscription.messages.firstWhere((envelope) => envelope.channel == 'my_channel');
```

----------------------------------------

TITLE: Using a Keyset Instance Directly in PubNub Operations
DESCRIPTION: This Dart snippet illustrates an alternative way to use a specific keyset for an operation without adding it to the `pubnub.keysets` collection. By passing the `keyset` parameter directly to a method, you can override the default keyset for that specific call.
SOURCE: https://github.com/pubnub/dart/blob/master/pubnub/README.md#_snippet_15

LANGUAGE: dart
CODE:
```
pubnub.subscribe(channels: {'channel'}, keyset: myKeyset1)
```

----------------------------------------

TITLE: Installing PubNub Dart SDK from Git
DESCRIPTION: This YAML configuration allows you to use the latest, unreleased version of the `pubnub` SDK by specifying its Git repository as a dependency in `pubspec.yaml`. The `path` ensures the correct subdirectory within the repository is used.
SOURCE: https://github.com/pubnub/dart/blob/master/pubnub/README.md#_snippet_1

LANGUAGE: yaml
CODE:
```
dependencies:
  pubnub:
    git: git://github.com/pubnub/dart.git
    path: pubnub
```

----------------------------------------

TITLE: Installing PubNub Dart SDK from Local Path
DESCRIPTION: This YAML snippet demonstrates how to link to a local copy of the PubNub Dart SDK repository. This is useful for local development and modification, allowing you to specify a relative path to your cloned repository in `pubspec.yaml`.
SOURCE: https://github.com/pubnub/dart/blob/master/pubnub/README.md#_snippet_2

LANGUAGE: yaml
CODE:
```
dependencies:
  pubnub:
    path: ../path-to-cloned-pubnub-repo
```

----------------------------------------

TITLE: Installing PubNub Dart Project Dependencies
DESCRIPTION: These Bash commands navigate into the cloned PubNub Dart repository directory and then run `dart pub get` to fetch and install all necessary project dependencies. This prepares the local environment for development.
SOURCE: https://github.com/pubnub/dart/blob/master/pubnub/README.md#_snippet_17

LANGUAGE: bash
CODE:
```
cd dart
dart pub get
```

----------------------------------------

TITLE: Cloning PubNub Dart Repository
DESCRIPTION: This Bash command clones the official PubNub Dart SDK repository from GitHub. This is the first step for anyone looking to contribute to the project or work with a local copy of the source code.
SOURCE: https://github.com/pubnub/dart/blob/master/pubnub/README.md#_snippet_16

LANGUAGE: bash
CODE:
```
git clone https://github.com/pubnub/dart.git
```

----------------------------------------

TITLE: Generating Source Files for PubNub Dart
DESCRIPTION: This Bash command executes the `build_runner` tool for the PubNub Dart project. It generates necessary source files, which are often required for code generation, serialization, or other build-time processes in Dart projects.
SOURCE: https://github.com/pubnub/dart/blob/master/pubnub/README.md#_snippet_18

LANGUAGE: bash
CODE:
```
dart pub run build_runner build
```