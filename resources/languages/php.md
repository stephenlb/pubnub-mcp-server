TITLE: Publishing and Subscribing to a Channel - PHP
DESCRIPTION: Demonstrates how to subscribe to a channel to receive messages and how to publish a message to that same channel using the PubNub client.
SOURCE: https://github.com/pubnub/php/blob/master/README.md#_snippet_5

LANGUAGE: php
CODE:
```
$pubnub->subscribe()
    ->channels("hello_world")
    ->execute();

$pubnub->publish()
    ->channel("hello_world")
    ->message("Hello PubNub!")
    ->sync();
```

----------------------------------------

TITLE: Adding Custom Event Listener - PHP
DESCRIPTION: Defines a custom class extending SubscribeCallback to handle various PubNub events like status changes, incoming messages, and presence updates. Adds an instance of this listener to the PubNub client.
SOURCE: https://github.com/pubnub/php/blob/master/README.md#_snippet_4

LANGUAGE: php
CODE:
```
class MySubscribeCallback extends SubscribeCallback {
    function status($pubnub, $status) {
        if ($status->getCategory() === PNStatusCategory::PNUnexpectedDisconnectCategory) {
        // This event happens when radio / connectivity is lost
        } else if ($status->getCategory() === PNStatusCategory::PNConnectedCategory){
        // Connect event. You can do stuff like publish, and know you'll get it // Or just use the connected event to confirm you are subscribed for // UI / internal notifications, etc
        } else if ($status->getCategory() === PNStatusCategory::PNDecryptionErrorCategory){
        // Handle message decryption error. Probably client configured to // encrypt messages and on live data feed it received plain text.
        }
    }
    function message($pubnub, $message){
    // Handle new message stored in message.message
    }
    function presence($pubnub, $presence){
    // handle incoming presence data
    }
}

$subscribeCallback = new MySubscribeCallback();
$pubnub->addListener($subscribeCallback);
```

----------------------------------------

TITLE: Adding PubNub Dependency - composer.json
DESCRIPTION: Adds the PubNub PHP SDK as a required dependency in your project's composer.json file. Specifies the package name and version constraint.
SOURCE: https://github.com/pubnub/php/blob/master/README.md#_snippet_1

LANGUAGE: json
CODE:
```
{
    "require": {
        <!-- include the latest version from the badge at the top -->
        "pubnub/pubnub": "8.0.1"
    }
}
```

----------------------------------------

TITLE: Including Autoloader With Composer - PHP
DESCRIPTION: Includes the Composer autoloader file, which loads the PubNub SDK and its dependencies installed via Composer.
SOURCE: https://github.com/pubnub/php/blob/master/README.md#_snippet_2

LANGUAGE: php
CODE:
```
require_once('vendor/autoload.php');‌
```

----------------------------------------

TITLE: Configuring PubNub Keys and User ID - PHP
DESCRIPTION: Initializes the PubNub configuration and client objects. Sets the required subscribe key, publish key, and a unique user identifier for the client.
SOURCE: https://github.com/pubnub/php/blob/master/README.md#_snippet_3

LANGUAGE: php
CODE:
```
$pnconf = new PNConfiguration();
$pubnub = new PubNub($pnconf);

$pnconf->setSubscribeKey("mySubscribeKey");
$pnconf->setPublishKey("myPublishKey");
$pnconf->setUserId("ReplaceWithYourClientIdentifier");
```

----------------------------------------

TITLE: Including Autoloader Without Composer - PHP
DESCRIPTION: Includes the PubNub SDK autoloader file when installing manually without Composer. This makes the SDK classes available in your project.
SOURCE: https://github.com/pubnub/php/blob/master/README.md#_snippet_0

LANGUAGE: php
CODE:
```
require_once('src/autoloader.php');
```