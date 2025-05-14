TITLE: Publish and Subscribe to a Channel - Swift
DESCRIPTION: Demonstrates publishing a message to a specified channel using the publish method with a completion handler to check the result, and subscribing to a list of channels using the subscribe method. Requires an initialized PubNub instance and potentially event listeners configured to receive the published message.
SOURCE: https://github.com/pubnub/swift/blob/master/README.md#_snippet_7

LANGUAGE: Swift
CODE:
```
pubnub.publish(channel: "my_channel", message: "Test Message!") { result in
  switch result {
  case let .success(timetoken):
    print("The message was successfully published at: \(timetoken)")
  case let .failure(error):
    print("Handle response error: \(error.localizedDescription)")
  }
}

pubnub.subscribe(to: ["my_channel"])
```

----------------------------------------

TITLE: Import PubNub SDK Module - Swift
DESCRIPTION: Imports the PubNubSDK module into a Swift source file (e.g., AppDelegate.swift) to access the SDK's classes and functions. Must be placed at the top of the Swift file.
SOURCE: https://github.com/pubnub/swift/blob/master/README.md#_snippet_4

LANGUAGE: Swift
CODE:
```
import UIKit
import PubNubSDK // <- Here is our PubNub module import.
```

----------------------------------------

TITLE: Configure and Initialize PubNub SDK - Swift
DESCRIPTION: Creates a PubNubConfiguration object using publish and subscribe keys along with a user ID, and then initializes a PubNub client instance with this configuration. Requires valid keys obtained from the PubNub Admin Portal.
SOURCE: https://github.com/pubnub/swift/blob/master/README.md#_snippet_5

LANGUAGE: Swift
CODE:
```
let config = PubNubConfiguration(
  publishKey: "myPublishKey",
  subscribeKey: "mySubscribeKey",
  userId: "myUniqueUserId"
)
let pubnub = PubNub(configuration: config)
```

----------------------------------------

TITLE: Add Subscription Event Listeners - Swift
DESCRIPTION: Creates a subscription listener instance for a channel, assigns a closure to the onEvent property to handle various incoming events like messages, presence changes, and file events, and then calls subscribe() to start receiving events. Requires an initialized PubNub instance.
SOURCE: https://github.com/pubnub/swift/blob/master/README.md#_snippet_6

LANGUAGE: Swift
CODE:
```
// Create a new listener instance
let subscription = pubnub.channel("channelName").subscription()

// Add listener event callbacks
subscription.onEvent = { event in
  switch event {
  case .messageReceived(let message):
    print("Message Received: \(message) Publisher: \(message.publisher ?? "defaultUserID")")
  case .presenceChanged(let presenceChange):
    print("Presence Received: \(presenceChange)")
  case .appContextChanged(let appContextEvent):
    print("App Context Event: \(appContextEvent)")
  case .messageActionChanged(let messageActionEvent):
    print("Message Action Event: \(messageActionEvent)")
  case .fileChanged(let fileEvent):
    print("File Event: \(fileEvent)")
  case .signalReceived(let message):
    print("Signal Received: \(message) Publisher: \(message.publisher ?? "defaultUserID")")
  }
}

// Start receiving subscription events
subscription.subscribe()
```

----------------------------------------

TITLE: Install PubNub Swift SDK via CocoaPods - Bash
DESCRIPTION: Executes the 'pod install' command in the terminal within the directory containing the Podfile to download and integrate the specified PubNub SDK dependency.
SOURCE: https://github.com/pubnub/swift/blob/master/README.md#_snippet_1

LANGUAGE: Bash
CODE:
```
pod install
```

----------------------------------------

TITLE: Update PubNub Swift SDK via Carthage - Bash
DESCRIPTION: Executes the 'carthage update' command with the '--use-xcframeworks' flag to build and update the PubNub SDK dependency specified in the Cartfile.
SOURCE: https://github.com/pubnub/swift/blob/master/README.md#_snippet_3

LANGUAGE: Bash
CODE:
```
carthage update --use-xcframeworks
```

----------------------------------------

TITLE: Add PubNub Swift SDK via CocoaPods - Ruby
DESCRIPTION: Adds the PubNubSwift pod as a dependency in a CocoaPods Podfile, specifying a version constraint. Requires CocoaPods to be installed and the project to be set up with a Podfile.
SOURCE: https://github.com/pubnub/swift/blob/master/README.md#_snippet_0

LANGUAGE: Ruby
CODE:
```
# Podfile
use_frameworks!

target 'YOUR_TARGET_NAME' do
  pod 'PubNubSwift', '~> 8.0'
end
```

----------------------------------------

TITLE: Add PubNub Swift SDK via Carthage - Ruby
DESCRIPTION: Adds the PubNub Swift SDK repository to a Carthage Cartfile, specifying a version constraint. Requires Carthage to be installed.
SOURCE: https://github.com/pubnub/swift/blob/master/README.md#_snippet_2

LANGUAGE: Ruby
CODE:
```
github "pubnub/swift" ~> 8.0
```

----------------------------------------

TITLE: Building SDK Example App (Fastlane, Shell)
DESCRIPTION: Builds the example application provided with the SDK using fastlane to ensure it compiles correctly and can be run.
SOURCE: https://github.com/pubnub/swift/blob/master/fastlane/README.md#_snippet_7

LANGUAGE: Shell
CODE:
```
[bundle exec] fastlane build_example
```

----------------------------------------

TITLE: Generating SDK Documentation (Fastlane, Shell)
DESCRIPTION: Generates API documentation or other project-related documentation for the SDK using fastlane.
SOURCE: https://github.com/pubnub/swift/blob/master/fastlane/README.md#_snippet_8

LANGUAGE: Shell
CODE:
```
[bundle exec] fastlane generate_docs
```

----------------------------------------

TITLE: Executing SDK Acceptance Tests (Fastlane, Shell)
DESCRIPTION: Runs the acceptance or contract tests for the SDK using fastlane. These tests typically verify integration points and expected behavior.
SOURCE: https://github.com/pubnub/swift/blob/master/fastlane/README.md#_snippet_2

LANGUAGE: Shell
CODE:
```
[bundle exec] fastlane contract_test
```

----------------------------------------

TITLE: Executing SDK Unit Tests (Fastlane, Shell)
DESCRIPTION: Runs the unit tests defined for the SDK using fastlane. The optional '[bundle exec]' prefix is used if fastlane is managed via Bundler.
SOURCE: https://github.com/pubnub/swift/blob/master/fastlane/README.md#_snippet_1

LANGUAGE: Shell
CODE:
```
[bundle exec] fastlane test
```

----------------------------------------

TITLE: Generating SDK Code Coverage (Fastlane, Shell)
DESCRIPTION: Generates code coverage reports for the SDK to measure which parts of the codebase are executed by tests.
SOURCE: https://github.com/pubnub/swift/blob/master/fastlane/README.md#_snippet_3

LANGUAGE: Shell
CODE:
```
[bundle exec] fastlane code_coverage
```

----------------------------------------

TITLE: Generating Local Code Coverage (Fastlane, Shell)
DESCRIPTION: Generates code coverage reports locally for the SDK. This action might be optimized for local development workflows compared to a CI/CD coverage generation.
SOURCE: https://github.com/pubnub/swift/blob/master/fastlane/README.md#_snippet_6

LANGUAGE: Shell
CODE:
```
[bundle exec] fastlane code_coverage_local
```

----------------------------------------

TITLE: Linting Release with Swift Package Manager (Fastlane, Shell)
DESCRIPTION: Lints the SDK release version using the Swift Package Manager configuration via fastlane to check for package validity and structure.
SOURCE: https://github.com/pubnub/swift/blob/master/fastlane/README.md#_snippet_5

LANGUAGE: Shell
CODE:
```
[bundle exec] fastlane lint_swift_package_manager
```

----------------------------------------

TITLE: Linting Release with Cocoapods (Fastlane, Shell)
DESCRIPTION: Lints the SDK release version using the Cocoapods dependency manager configuration via fastlane to check for packaging and spec validity.
SOURCE: https://github.com/pubnub/swift/blob/master/fastlane/README.md#_snippet_4

LANGUAGE: Shell
CODE:
```
[bundle exec] fastlane lint_cocoapods
```

----------------------------------------

TITLE: Installing Xcode Command Line Tools (Shell)
DESCRIPTION: Installs the Xcode command line developer tools, which are a necessary prerequisite for building and running projects, especially when using tools like fastlane.
SOURCE: https://github.com/pubnub/swift/blob/master/fastlane/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
xcode-select --install
```