# How to Encrypt Messages and Files with PubNub (AES-256)

PubNub provides built-in support for AES-256 end-to-end encryption for message payloads and, by extension, for file metadata if files are shared via messages. This ensures that data is encrypted on the publishing client and decrypted only on the subscribing client, with PubNub servers never having access to the unencrypted content.

## End-to-End Message Encryption (AES-256)

*   **Mechanism:** PubNub SDKs include an AES-256 encryption module. When a `cipherKey` is provided during PubNub client initialization, all message payloads are automatically encrypted before being published and decrypted upon receipt.
*   **Cipher Key:** This is a secret key (a string) that you provide, known only to your publishing and subscribing clients. **PubNub does not store or have access to your cipher key.**
*   **How to Enable:**
    1.  Choose a strong cipher key (e.g., a secure random string).
    2.  When initializing the PubNub object in your client-side code (both publisher and subscriber), provide this `cipherKey` in the configuration.
        ```javascript
        // Example in JavaScript
        // var pubnub = new PubNub({
        //   subscribeKey: "YOUR_SUBSCRIBE_KEY",
        //   publishKey: "YOUR_PUBLISH_KEY",
        //   userId: "ClientUserID",
        //   cipherKey: "my_strong_secret_cipher_key" // AES encryption enabled
        // });
        ```
*   **Scope:** Encryption applies to the message *payload*. Message metadata (like channel name, publisher timetoken) is not encrypted by this mechanism.
*   **Stored Messages (Message Persistence):** If you have Message Persistence enabled, messages encrypted by the client will be stored in their encrypted form. When retrieved via the history API by a client also configured with the same `cipherKey`, they will be automatically decrypted. If retrieved without the correct `cipherKey`, the payload will remain encrypted.

## File Encryption

PubNub's File Sharing feature allows sending and receiving files. While the File API itself manages the upload and download of the file binary, the *message* associated with the file transfer (containing file metadata like name, ID, and any caption) can be encrypted using the same AES-256 mechanism described above.

*   **Process:**
    1.  Initialize the PubNub client with a `cipherKey`.
    2.  When you send a file using `pubnub.sendFile()`, any accompanying message/caption you provide will be encrypted.
    3.  The file itself is uploaded securely (typically over HTTPS) to PubNub's file storage.
    4.  Subscribing clients with the same `cipherKey` will receive the file message and automatically decrypt the metadata/caption.
    5.  They can then use the file ID and name to download the file (again, typically over HTTPS).

*   **What is Encrypted:** The message payload announcing the file (containing its name, ID, and any custom message/caption) is end-to-end encrypted if a `cipherKey` is used.
*   **What is NOT End-to-End Encrypted by Client `cipherKey`:** The file binary itself, while in transit to/from PubNub's storage and while at rest on PubNub's storage, is protected by PubNub's infrastructure security (HTTPS in transit, server-side encryption at rest). It is not directly encrypted by the client's AES `cipherKey` in the same way message payloads are. If you require the file binary to be end-to-end encrypted such that PubNub *never* sees the plaintext file content, you would need to encrypt the file *before* calling `pubnub.sendFile()` and decrypt it *after* downloading, managing those encryption keys separately.

## Cipher Key vs. 

These are distinct keys for different security purposes:

*   **Cipher Key:**
    *   Used for: Encrypting and decrypting message payloads (AES-256).
    *   Scope: Client-side, shared between trusted publishers and subscribers.
    *   Visibility: PubNub never sees it.
*   **Secret Key (Access Manager):**
    *   Used for: Signing administrative requests to grant or revoke permissions with PubNub Access Manager.
    *   Scope: Server-side only. **Must never be exposed to clients.**
    *   Visibility: Known to your PubNub keyset and your secure backend server.

## Cipher Key vs. 

These are also independent mechanisms that can be used together:

*   **TLS (Transport Layer Security, formerly SSL):**
    *   Encrypts the communication channel (the "pipe") between a client (browser, mobile device, server) and the PubNub network.
    *   Protects data in transit from eavesdropping between the client and PubNub.
    *   PubNub network *does* process the data (e.g., for routing) once it's decrypted from the TLS layer at the PubNub edge.
*   **Cipher Key (AES Encryption):**
    *   Encrypts the message *content* itself from end-point to end-point.
    *   The data remains encrypted even as it passes through the PubNub network and if it's stored with Message Persistence.
    *   PubNub cannot read the content of messages encrypted with a client-provided `cipherKey`.

Using both TLS (which is enabled by default) and a `cipherKey` provides defense in depth: TLS secures the transport layer, and AES secures the message content itself.

