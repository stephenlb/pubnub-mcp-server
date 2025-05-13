# Understanding PubNub Demo Keys

PubNub provides a set of "demo" publish and subscribe keys that are often seen in documentation, blog posts, and sample applications on the PubNub website. It's important to understand their purpose and limitations.

## Purpose of Demo Keys

*   **Sample Applications:** Demo keys are primarily intended for use in sample apps and code examples found on PubNub's official website (documentation, tutorials, blog posts).
*   **Interactive Demos:** They facilitate interactive online demonstrations where users can quickly try out PubNub features without needing to sign up for an account first.
*   **PubNub Debug Console:** Useful for quick tests and experiments within the PubNub Debug Console available on the PubNub website.

## Key Characteristics and Limitations

1.  **Publicly Known:** Demo keys are public. Anyone can use them.
2.  **Shared Channels:** If you publish a message using demo keys on a specific channel, anyone else subscribing to that same channel using the same demo keys will receive those messages. There is no isolation.
3.  **Throttling and Rate Limits:** Demo keys are subject to throttling and stricter rate limits to prevent abuse and ensure they remain available for their intended demonstration purposes. This means:
    *   Applications using demo keys may not perform as expected under load.
    *   You might encounter unexpected disconnections or message delivery issues if usage exceeds these unpublished limits.
4.  **No Feature Guarantees:** Advanced features or add-ons available on paid PubNub plans might not be fully enabled or configurable for the demo keyset.
5.  **No Security/Privacy:** Due to their public nature, demo keys should **never** be used for any application that handles sensitive, private, or production data. There is no expectation of privacy or security when using demo keys.
6.  **No SLA or Support:** Applications using demo keys are not covered by PubNub's Service Level Agreements (SLAs), and support for issues encountered while using demo keys might be limited.

## When NOT to Use Demo Keys

*   **Development and Testing of Your Application:** Do not use demo keys for building, developing, or testing your own applications.
*   **Staging or Pre-production Environments:** Do not use demo keys.
*   **Production Applications:** Absolutely **never** use demo keys in a live, production environment.

## What to Use Instead

For all your development, testing, staging, and production needs:

1.  **Register for a Free PubNub Account:** Sign up at [PubNub's website](https://www.pubnub.com/).
2.  **Use Your Own Keys:** Once registered, you will get your own unique set of Publish and Subscribe keys from the PubNub Admin Portal.
    *   These keys are specific to your account.
    *   You can enable and configure add-on features (like Access Manager, Message Persistence, Functions, etc.) on your own keysets.
    *   Using your own keys ensures proper resource allocation, expected performance (within your plan limits), and security for your application.

Using your dedicated keys is crucial for building robust, secure, and scalable real-time applications with PubNub.

