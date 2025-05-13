# How to Use the PubNub Module in PubNub Functions

The `pubnub` module within PubNub Functions allows your serverless code to interact with the PubNub Realtime Network directly. This means you can publish messages, fire signals, retrieve history, manage presence, interact with App Context (Objects), and more, all from within your Function code.

## Requiring the PubNub Module

To use the `pubnub` module, you first need to require it in your Function:

```javascript
const pubnub = require('pubnub');
```
The instance of the `pubnub` module provided within Functions is pre-configured with the publish and subscribe keys of the keyset the Function belongs to. You do not need to initialize it manually with keys.

## Core Methods (Common Use Cases)

All methods of the `pubnub` module that perform network operations return Promises. Therefore, you should always use `async/await` with `try/catch` for error handling.

### 1. `pubnub.publish(params)`
   Sends a message to a specified channel.
   *   `params` (Object):
        *   `channel` (String): The channel to publish the message to.
        *   `message` (Any): The payload to publish. Can be any JSON-serializable data.
        *   `storeInHistory` (Boolean, optional): Whether to store the message in history (if Message Persistence is enabled). Defaults to `true`. Set to `false` to prevent storage.
        *   `meta` (Object, optional): Arbitrary metadata to send with the message (not end-to-end encrypted).
        *   Other options like `ttl` for APNS/FCM passthrough.

```javascript
// Example: Publishing a message
try {
  const result = await pubnub.publish({
    channel: "alerts_channel",
    message: { alert: "System critical", details: "Sensor offline", severity: "high" }
  });
  console.log('Publish successful, timetoken:', result.timetoken);
} catch (error) {
  console.error('Publish failed:', error);
}
```

### 2. `pubnub.fire(params)`
   Sends a message to a channel without storing it in history, regardless of Message Persistence settings. Useful for ephemeral messages.
   *   `params` (Object):
        *   `channel` (String): The channel to fire the message to.
        *   `message` (Any): The payload.
        *   `meta` (Object, optional): Metadata.

```javascript
// Example: Firing an ephemeral message
try {
  const result = await pubnub.fire({
    channel: "typing_indicators",
    message: { user: "Alice", isTyping: true }
  });
  console.log('Fire successful, timetoken:', result.timetoken);
} catch (error) {
  console.error('Fire failed:', error);
}
```

### 3. `pubnub.signal(params)`
   Sends a small, real-time signal to a channel. Signals are not stored, have a smaller payload limit (typically < 64 bytes after encoding), and are optimized for very low latency.
   *   `params` (Object):
        *   `channel` (String): The channel to send the signal to.
        *   `message` (Any): The signal payload (must be small).

```javascript
// Example: Sending a signal
try {
  const result = await pubnub.signal({
    channel: "user_123_joystick_control",
    message: { x: 10, y: -5 } // Small payload
  });
  console.log('Signal successful, timetoken:', result.timetoken);
} catch (error) {
  console.error('Signal failed:', error);
}
```

### 4. Access Manager (`grant`, `revoke`)
   If your Function needs to manage permissions (e.g., grant access to a user after some server-side validation), it can use PAM methods.
   *   **Important:** For grant operations from within a Function, the Function itself needs to have the necessary administrative permissions, or you'd typically use the `secretKey` directly (which is available to Functions, but handle with extreme care).
   *   Using PAM from Functions is an advanced use case. Usually, grants are made from a trusted backend server.

```javascript
// Example: Granting permissions (Conceptual - handle secretKey securely)
// This assumes the Function is trusted and potentially uses a secret from Vault
// const vault = require('vault');
// const secretKeyFromVault = await vault.get('myPubNubSecretKey');
//
// if (secretKeyFromVault) {
//   // Re-initialize pubnub instance if you need to force a specific secret key for admin operations
//   // This is generally NOT how you'd use the built-in 'pubnub' object for grants.
//   // The built-in 'pubnub' object might not be configured with secretKey by default for grants.
//   // Check official PubNub docs for best practices on PAM grants from Functions.
//   try {
//      const pamResult = await pubnub.grant({ // Or a new PubNub instance configured with the secretKey
//        channels: ['user_specific_channel'],
//        authKeys: ['user_auth_token_123'],
//        read: true,
//        write: true,
//        ttl: 60, // Grant for 60 minutes
//        // secretKey: secretKeyFromVault // if using a new instance.
//      });
//      console.log('Grant successful:', pamResult);
//   } catch (error) {
//      console.error('Grant failed:', error);
//   }
// }
```
   **Note:** Granting permissions from Functions requires careful consideration of security. Often, the Function might call out to your own secure backend (via `xhr`) which then performs the grant, rather than the Function doing it directly with a hardcoded or Vault-retrieved Secret Key. The `pubnub` object within a function does *not* automatically have the `secretKey` configured for all operations.

### 5. File Sharing (`sendFileUrl`, `getFileUrl`, `listFiles`, `deleteFile`)
   Interact with PubNub's File Sharing API.
   *   `pubnub.listFiles(params)`: Lists files in a channel.
        *   `channel` (String): Channel to list files from.
        *   `limit` (Number, optional): Max number of files to return.
        *   `next` (String, optional): Pagination token.
   *   You can construct URLs for download or get file metadata.

```javascript
// Example: Listing files in a channel
try {
  const fileListResponse = await pubnub.listFiles({
    channel: 'shared_documents_channel',
    limit: 10
  });
  console.log('Files found:', fileListResponse.data.length);
  fileListResponse.data.forEach(file => {
    console.log(`- ${file.name} (ID: ${file.id})`);
  });
} catch (error) {
  console.error('Failed to list files:', error);
}
```

### 6. App Context / Objects (`objects.setUUIDMetadata`, `objects.getChannelMetadata`, etc.)
   Manage metadata for users (UUIDs), channels, and memberships.

```javascript
// Example: Setting User Metadata
try {
  const userId = 'user_function_tester';
  await pubnub.objects.setUUIDMetadata({
    uuid: userId,
    data: {
      name: 'Function Tester',
      email: 'tester@example.com', // Ensure PII handling compliance
      custom: { lastFunctionRun: new Date().toISOString() }
    }
  });
  console.log(`Metadata set for UUID: ${userId}`);

  const userMeta = await pubnub.objects.getUUIDMetadata({ uuid: userId });
  console.log('Retrieved user metadata:', userMeta.data);

} catch (error) {
  console.error('App Context (Objects) operation failed:', error);
}
```

## Common Scenarios

*   **Message Augmentation:** Modify a message `onBeforePublish`, add data from KV Store or an external API, then let it proceed.
*   **Data Validation/Sanitization:** Check message content and `abort()` if it doesn't meet criteria.
*   **Push Notification Transformation:** Modify APNS/FCM payloads before they are sent.
*   **Custom Webhooks:** Trigger external services via `xhr` when messages arrive.
*   **Real-time Aggregation:** Use KV Store counters to aggregate data from many messages.
*   **Scheduled Tasks:** Publish data fetched from an API on an interval.

## Security and Best Practices

*   The `pubnub` module within a Function operates with the permissions implicitly granted by the keyset it belongs to.
*   If a Function needs to perform PAM grant operations, it's critical to manage the Secret Key securely (e.g., via Vault and with extreme caution, or preferably by proxying to a trusted backend).
*   Be mindful of the execution limits and timeouts for Functions. 

