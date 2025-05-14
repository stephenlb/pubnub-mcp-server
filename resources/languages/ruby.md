TITLE: Compile PubNub Rust `no_std` Examples (Default)
DESCRIPTION: Compiles all PubNub Rust `no_std` examples using the default `Cargo.toml` in the current directory for the `thumbv7m-none-eabi` target.
SOURCE: https://github.com/pubnub/rust/blob/master/examples/no_std/README.md#_snippet_0

LANGUAGE: sh
CODE:
```
cargo build --target thumbv7m-none-eabi
```

----------------------------------------

TITLE: Running a basic PubNub Rust example
DESCRIPTION: Execute a simple PubNub Rust example using the `cargo run --example` command, replacing `<name>` with the example file name.
SOURCE: https://github.com/pubnub/rust/blob/master/examples/README.md#_snippet_0

LANGUAGE: sh
CODE:
```
cargo run --example <name>
```

----------------------------------------

TITLE: Basic PubNub Subscribe and Publish Example - Rust
DESCRIPTION: This comprehensive example demonstrates initializing the PubNub client, subscribing to channels, listening for various real-time updates (messages, presence, etc.) via streams, and publishing messages to channels. It uses Tokio for asynchronous operations and requires PubNub publish and subscribe keys.
SOURCE: https://github.com/pubnub/rust/blob/master/README.md#_snippet_2

LANGUAGE: Rust
CODE:
```
use pubnub::subscribe::Subscriber;
use futures::StreamExt;
use tokio::time::sleep;
use std::time::Duration;
use serde_json;
use pubnub::{
    dx::subscribe::Update,
    subscribe::EventSubscriber,
    Keyset, PubNubClientBuilder,
};
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    use pubnub::subscribe::{EventEmitter, SubscriptionParams};
    let publish_key = "my_publish_key";
    let subscribe_key = "my_subscribe_key";
    let client = PubNubClientBuilder::with_reqwest_transport()
        .with_keyset(Keyset {
            subscribe_key,
            publish_key: Some(publish_key),
            secret_key: None,
        })
        .with_user_id("user_id")
        .build()?;

    println!("PubNub instance created");

    let subscription = client.subscription(SubscriptionParams {
        channels: Some(&["my_channel"]),
        channel_groups: None,
        options: None
    });

    let channel_entity = client.channel("my_channel_2");
    let channel_entity_subscription = channel_entity.subscription(None);

    subscription.subscribe();
    channel_entity_subscription.subscribe();

    println!("Subscribed to channels");

    // Launch a new task to print out each received message
    tokio::spawn(client.status_stream().for_each(|status| async move {
        println!("\nStatus: {:?}", status)
    }));
    tokio::spawn(subscription.stream().for_each(|event| async move {
        match event {
            Update::Message(message) | Update::Signal(message) => {
                // Silently log if UTF-8 conversion fails
                if let Ok(utf8_message) = String::from_utf8(message.data.clone()) {
                    if let Ok(cleaned) = serde_json::from_str::<String>(&utf8_message) {
                        println!("message: {}", cleaned);
                    }
                }
            }
            Update::Presence(presence) => {
                println!("presence: {:?}", presence)
            }
            Update::AppContext(object) => {
                println!("object: {:?}", object)
            }
            Update::MessageAction(action) => {
                println!("message action: {:?}", action)
            }
            Update::File(file) => {
                println!("file: {:?}", file)
            }
        }
    }));

    // Explicitly listen only for real-time `message` updates.
    tokio::spawn(
        channel_entity_subscription
            .messages_stream()
            .for_each(|message| async move {
                if let Ok(utf8_message) = String::from_utf8(message.data.clone()) {
                    if let Ok(cleaned) = serde_json::from_str::<String>(&utf8_message) {
                        println!("message: {}", cleaned);
                    }
                }
            }),
    );

   sleep(Duration::from_secs(2)).await;

    // Send a message to the channel
    client
        .publish_message("hello world!")
        .channel("my_channel")
        .r#type("text-message")
        .execute()
        .await?;

   // Send a message to another channel
    client
        .publish_message("hello world on the other channel!")
        .channel("my_channel_2")
        .r#type("text-message")
        .execute()
        .await?;

    sleep(Duration::from_secs(15)).await;

    Ok(())
}
```

----------------------------------------

TITLE: Adding PubNub Dependency (All Features) - Cargo.toml
DESCRIPTION: This snippet demonstrates how to add the PubNub dependency to your Rust project's Cargo.toml file, enabling all available features. Use this if you need access to functionality not included in the default set.
SOURCE: https://github.com/pubnub/rust/blob/master/README.md#_snippet_1

LANGUAGE: TOML
CODE:
```
[dependencies]
pubnub = { version = "0.6.0", features = ["full"] }
```

----------------------------------------

TITLE: Running Contract Tests (Shell)
DESCRIPTION: Command to execute all contract tests for the PubNub Rust SDK using the cargo test runner, enabling the `contract_test` feature.
SOURCE: https://github.com/pubnub/rust/blob/master/tests/README.md#_snippet_0

LANGUAGE: shell
CODE:
```
cargo test --features contract_test --test contract_test
```

----------------------------------------

TITLE: Configure PubNub Rust Dependency with Blocking and Access Features (TOML)
DESCRIPTION: Adds the PubNub crate as a dependency in Cargo.toml, explicitly enabling the 'blocking' and 'access' features. This configuration includes the default features as well, suitable for applications requiring synchronous operations and Access Manager functionality.
SOURCE: https://github.com/pubnub/rust/blob/master/README.md#_snippet_3

LANGUAGE: TOML
CODE:
```
[dependencies]
pubnub = { version = "0.6.0", features = ["blocking", "access"] }
```

----------------------------------------

TITLE: Configure PubNub Rust Dependency with No Default Features and Specific Features (TOML)
DESCRIPTION: Demonstrates how to add the PubNub crate dependency while disabling default features ('default-features = false') and explicitly enabling 'serde', 'publish', and 'blocking'. This is common for no_std environments or when fine-grained feature control is required.
SOURCE: https://github.com/pubnub/rust/blob/master/README.md#_snippet_4

LANGUAGE: TOML
CODE:
```
[dependencies]
pubnub = { version = "0.6.0", default-features = false, features = ["serde", "publish",
"blocking"] }
```

----------------------------------------

TITLE: Running a PubNub Rust example with features
DESCRIPTION: Execute a PubNub Rust example that requires specific crate features by adding the `--features` flag to the `cargo run --example` command. Replace `<name>` with the example name and `<feature1> <feature2> ...` with the required features.
SOURCE: https://github.com/pubnub/rust/blob/master/examples/README.md#_snippet_1

LANGUAGE: sh
CODE:
```
cargo run --example <name> --features="<feature1> <feature2> ..."
```

----------------------------------------

TITLE: Adding PubNub Dependency (Default Features) - Cargo.toml
DESCRIPTION: This snippet shows how to add the PubNub dependency to your Rust project's Cargo.toml file, including only the default features. This is the standard way to include the library.
SOURCE: https://github.com/pubnub/rust/blob/master/README.md#_snippet_0

LANGUAGE: TOML
CODE:
```
[dependencies]
pubnub = "0.6.0"
```

----------------------------------------

TITLE: Compile PubNub Rust `no_std` Examples (Specify Manifest)
DESCRIPTION: Compiles all PubNub Rust `no_std` examples by explicitly specifying the `Cargo.toml` path relative to the project root for the `thumbv7m-none-eabi` target.
SOURCE: https://github.com/pubnub/rust/blob/master/examples/no_std/README.md#_snippet_1

LANGUAGE: sh
CODE:
```
cargo build --manifest-path examples/no_std/Cargo.toml --target thumbv7m-none-eabi
```