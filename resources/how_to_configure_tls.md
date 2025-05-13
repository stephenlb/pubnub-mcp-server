# How to Configure TLS (HTTPS) with PubNub

Transport Layer Security (TLS), formerly known as Secure Sockets Layer (SSL), is crucial for securing data in transit between PubNub clients and the PubNub network. It encrypts the communication channel, preventing eavesdropping and tampering.

## TLS is Enabled by Default

For almost all PubNub SDKs and client interactions, **TLS communication is enabled by default.** You do not need to take special action to turn it on. When your PubNub client initializes and communicates with PubNub servers, it will automatically attempt to use a secure HTTPS connection.

## Disabling TLS (Not Recommended)

While possible, disabling TLS is **strongly discouraged** as it exposes your data to risks during transit. However, if absolutely necessary for a specific legacy environment or troubleshooting (and you understand the security implications), some SDKs provide an option to disable it during PubNub object initialization.

*   **Example (JavaScript SDK):**
    ```javascript
    var pubnub = new PubNub({
      subscribeKey: "mySubscribeKey",
      publishKey: "myPublishKey",
      userId: "ClientUserID",
      ssl: false // Setting this to false disables TLS. Default is true.
    });
    ```
*   **Consult SDK Documentation:** The specific parameter name and method for disabling TLS can vary between SDKs (e.g., `ssl`, `secure`, etc.). Always refer to the documentation for the particular SDK you are using.

## PubNub Connection Security Protocol Support

**Important Notice: TLS 1.2 Support Requirement**

*   **Effective Date:** Starting **February 1st, 2025**, PubNub will **only support the TLS 1.2 protocol** (or higher) for all communications.
*   **Deprecation of TLS 1.1:** TLS 1.1 will be deprecated on January 31st, 2025.
*   **Action Required:** You must ensure that your systems, clients, and server environments connecting to PubNub support TLS 1.2 or higher before this date to prevent service interruptions. This is critical for maintaining security, reliability, and performance.
*   **Verification:**
    *   Regularly monitor your systems.
    *   PubNub provides a test endpoint to check your system's compatibility with TLS 1.2: `pubsub-tls12-test.pubnub.com`
*   **Client Responsibility:** PubNub cannot control which TLS version your systems use; it is your responsibility to ensure they are updated appropriately.
*   **Assistance:** If you have questions or need help, contact PubNub Support at [support@pubnub.com](mailto:support@pubnub.com).

## Cipher Key vs. 

It's important to understand the difference:

*   **TLS:** Encrypts the *transport channel* between the client and PubNub. Protects data in transit over the network. PubNub servers can see the unencrypted message content once it arrives (unless AES encryption is also used).
*   **Cipher Key (for AES Encryption):** Encrypts the *message payload* itself from end-to-end. The message content remains encrypted even within the PubNub network and in storage.

Using both TLS (default) and a client-side cipher key (optional, for payload encryption) offers layered security.

## Custom Origin and TLS Certificates

If you use a custom origin (e.g., `yoursubdomain.pubnubapi.com`), PubNub can also provide TLS certificate hosting for that custom domain. This service typically comes with an additional monthly fee, and you would need to supply PubNub with your own TLS certificate for your custom domain. This ensures that the secure connection is established with a certificate that matches your custom origin.

