# How to Use File Sharing with PubNub

PubNub's File Sharing feature allows you to upload, send, and receive files (like images, videos, documents) through the PubNub network. Files are stored by PubNub, and messages are published to channels to notify clients about available files.

**Enabling File Sharing:**
You must enable the "File Sharing" (or "Files") add-on for your keyset in the PubNub Admin Portal before you can use these features.

## Core Concepts

1.  **File Upload:** You upload a file (e.g., from a file input, a Blob, or a path in Node.js) to PubNub's storage. PubNub returns a unique File ID and File Name.
2.  **Publishing File Message:** After a successful upload, you (or the SDK automatically) publish a special "file message" to a PubNub channel. This message contains metadata about the uploaded file, including its ID and name.
3.  **Receiving File Message:** Subscribed clients receive this file message.
4.  **File Download:** Using the File ID and File Name from the message, clients can construct a download URL or use an SDK method to download the file directly from PubNub's storage.

## SDK Operations (Conceptual Examples - JavaScript SDK focus)

PubNub SDKs provide methods to simplify these operations.

**1. Sending/Uploading a File:**
*   **SDK Method:** `pubnub.sendFile(params)` (or similar)
*   **Parameters (`params` object):**
    *   `channel` (String): The channel to publish the file message to.
    *   `file` (Varies by platform):
        *   JavaScript (Browser): File object from `<input type="file">`, Blob, ArrayBuffer, or data URI.
        *   Node.js: Path to the file, Buffer, or Stream.
    *   `message` (Object, optional): An additional custom message payload to send along with the file information (e.g., a caption, sender info). This custom message will be end-to-end encrypted if a `cipherKey` is configured on the PubNub instance.
    *   `storeInHistory` (Boolean, optional): Whether the file message should be stored in channel history (if Message Persistence is enabled).
    *   `ttl` (Number, optional): For APNS/FCM if the file message should also trigger a push notification.
*   **Process:** The SDK handles uploading the file to PubNub storage and then publishing the file message to the specified channel.
*   **Response:** Typically includes the timetoken of the published file message and potentially the file ID and name.

