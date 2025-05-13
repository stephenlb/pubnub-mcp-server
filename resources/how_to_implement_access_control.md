# How to Implement Access Control with PubNub Access Manager (PAM)

PubNub Access Manager (PAM) provides fine-grained control over who can access your PubNub resources (channels, channel groups, user IDs) and what actions they can perform (read, write, manage).

## Core Concepts of PAM

*   **Permissions:** Define what actions a client can take (e.g., `read` for subscribing, `write` for publishing, `manage` for channel group operations).
*   **Auth-Keys (Authorization Tokens):** Clients are given temporary auth-keys. Permissions are granted to these auth-keys, not directly to users or devices.
*   **Levels of Access:** Permissions can be granted at different levels:
    *   Global (to all channels/users on a keyset - very broad, use with caution)
    *   Channel / Channel Group
    *   User (UUID)
    *   User-Channel (specific user on a specific channel)
*   **Secret Key:** A unique key associated with your PubNub keyset, used by your server to sign requests that grant or revoke permissions. **The Secret Key must never be exposed to clients.**
*   **Time-To-Live (TTL):** Permissions granted to an auth-key are valid for a specified duration (TTL), from 1 minute to 43,200 minutes (30 days). After the TTL expires, the client loses access unless permissions are re-granted. Default TTL is 1440 minutes (24 hours).

## Steps to Implement PAM

1.  **Enable Access Manager:**
    *   In your PubNub Admin Portal, select your keyset.
    *   Enable the "Access Manager" add-on. You will need your Secret Key for this.

2.  **Server-Side Logic for Granting Permissions:**
    *   **User Authentication:** Authenticate users through your own backend system.
    *   **Generate Auth-Key:** Upon successful user authentication, your server should generate or assign an auth-key for that user's session.
    *   **Grant Permissions:** Your server uses a PubNub SDK (server-side version) or the PubNub REST API, along with your Publish Key, Subscribe Key, and **Secret Key**, to make a `grant` request. 

3.  **Client-Side Initialization:**
    *   Your server provides the authenticated client with its assigned `authKey` and your PubNub Subscribe Key (and Publish Key if needed).
    *   The client initializes the PubNub SDK, providing the `subscribeKey` and the `authKey`.
        ```javascript
        // On the client
        // var pubnub = new PubNub({
        //   subscribeKey: "YOUR_SUB_KEY",
        //   publishKey: "YOUR_PUB_KEY", // Only if client publishes directly
        //   userId: "ClientUserID",
        //   authKey: "the_auth_key_from_server"
        //   // ssl: true // usually default
        // });
        ```
    *   The SDK will automatically use the `authKey` to sign requests.

4.  **Revoking Permissions:**
    *   Permissions can be revoked by your server using a `revoke` request, similar to granting. This invalidates the specified permissions for an auth-key on the given resources.
    *   **Revoke Latency:** PubNub authentication servers cache valid tokens for up to 60 seconds. After a revoke request, it might take up to a minute for an actively used token's cache to expire and for a client to receive a `403: Forbidden` error.

## Restricting Subscribers by IP or URL (Limited Availability)

*   The primary method for restricting subscriber access is PubNub Access Manager.
*   Restricting by IP address or referrer URL might be possible using PubNub Functions, specifically with "On Before Publish" or "On After Publish" event handlers that inspect the request and potentially block it or deny permissions. However, directly restricting *subscribers* (not publishers) this way via Functions may have limitations as Functions historically had more robust support for publish events. Check the latest PubNub Functions documentation for current capabilities regarding subscriber-side event handling or request interception.

## Best Practices for PAM

*   **Principle of Least Privilege:** Only grant the minimum necessary permissions.
*   **Short TTLs:** Use shorter TTLs for sensitive operations and require clients to re-authenticate with your server to get new grants.
*   **Secure Your Server:** The security of PAM relies heavily on the security of your server where the Secret Key is stored and grant operations are performed.
*   **Use TLS/HTTPS:** All communication between clients and your server, and between your server and PubNub, should be over TLS.
*   **Regularly Audit Permissions:** Periodically review the permissions granted.

PAM is a powerful tool for creating secure and granular access control for your real-time application.

