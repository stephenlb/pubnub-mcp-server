# How to Secure Your PubNub Application Keys

Protecting your PubNub Publish and Subscribe keys is essential for securing your application. While it's impossible to completely hide keys from a determined user inspecting client-side code, PubNub Access Manager (PAM) is the recommended solution for robust security.

## The Challenge with Client-Side Keys

Simply embedding publish and subscribe keys directly in client-side applications makes them discoverable. Even if passed after an initial authentication with your server, they can be snooped.

## PubNub Access Manager (PAM) - The Solution

PubNub Access Manager (PAM) allows you to control client access to channels and channel groups dynamically and securely. It works by granting permissions to authorization tokens (auth-keys) rather than exposing powerful publish/subscribe keys directly to all clients.

**Recommended Workflow:**

1.  **Enable Access Manager:**
    *   Log in to your PubNub Admin Portal.
    *   Select your keyset.
    *   Enable the Access Manager add-on. This action requires your Secret Key for signing administrative PAM requests.

2.  **Server-Side Authentication & Authorization:**
    *   Your users authenticate with your backend server using your existing login process (ideally over a TLS/HTTPS connection).
    *   Upon successful authentication, your server generates a unique, short-lived authorization token (auth-key) for that user or session.
    *   Your server then uses the PubNub Admin API (or a server-side SDK function) to grant specific permissions (read, write, manage, etc.) to this auth-key for particular channels, channel groups, or UUIDs (user IDs).
    *   Permissions should follow the principle of least privilege – only grant what is necessary for the user's role.
    *   Set a Time-To-Live (TTL) for these grants (minimum 1 minute, maximum 43,200 minutes / 30 days). Short TTLs enhance security by requiring periodic re-authorization.

3.  **Client-Side Initialization:**
    *   Your server securely passes the generated auth-key (and your Subscribe Key, and optionally your Publish Key if the client needs to publish directly and has been granted such permission via its auth-key) to the authenticated client.
    *   When initializing the PubNub client SDK:
        *   Use the Subscribe Key.
        *   Set the `authKey` parameter with the token received from your server.
        *   Ensure TLS (SSL) is enabled (usually default in SDKs).
        *   Optionally, provide a `cipherKey` if you are using end-to-end AES encryption for message payloads.

**How PAM Secures Keys:**
*   Clients operate with temporary auth-keys that have limited, specific permissions.
*   Your main Publish and Subscribe keys are not directly exposed or used for all operations on the client.
*   The Secret Key, which is required to grant permissions, *never* leaves your server.
*   Even if a user discovers their auth-key, they can only perform actions for which that auth-key has been explicitly authorized by your server, and only for the duration of the TTL.

**Signing Requests:**
*   When Access Manager is enabled, all requests to PubNub (publish, subscribe, history, etc.) must be signed.
*   PubNub SDKs automatically handle the signing of requests when an `authKey` is provided during initialization.
*   If you are using the PubNub REST API directly (not recommended for client-side), you would need to generate the signature manually using your Secret Key on your server and add it as a query parameter. Client-side REST API usage with PAM enabled is generally insecure as it would require exposing the secret key or a pre-signed URL with broad permissions.

With Access Manager properly implemented, a malicious user cannot gain access to channels or perform actions that they were not explicitly authorized for by your server, significantly enhancing the security of your application keys and data streams.

