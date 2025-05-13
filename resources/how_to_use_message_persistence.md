# How to Use Message Persistence (Storage & History) with PubNub

PubNub's Message Persistence feature allows you to store messages published to channels and retrieve them later using the History API. This is crucial for scenarios where clients need to catch up on messages missed while offline, display chat history, or audit past communications.

## Overview

*   **Default Behavior:** By default, PubNub does **not** permanently store messages. It only holds a small number of recent messages (e.g., last 100, up to ~20 minutes) in a short-term in-memory cache for quick catch-up after brief disconnects.
*   **Message Persistence Add-on:** To store messages for longer periods, you must enable the "Message Persistence" (sometimes referred to as Storage & Playback) add-on for your PubNub keyset in the PubNub Admin Portal.

## Enabling Message Persistence

1.  Log in to your PubNub Admin Portal.
2.  Select your Application and then the Keyset you want to configure.
3.  Find the "Message Persistence" add-on (it might be under "Key Add-ons" or a similar section).
4.  Enable the add-on.
5.  **Configure Retention Time:** You will need to set how long messages should be stored. Common options include:
    *   1, 7, 30, 90, 180, or 365 days.
    *   Unlimited (may require a specific plan).
    *   The available retention periods can depend on your PubNub plan (Free tier users might have up to 7 days, Starter plans up to 180 days, Pro plans for longer/unlimited).
    *   **Note:** Changing retention settings can affect existing stored data. Contact PubNub support if you have concerns about data loss during a retention change.

## How Messages Are Stored

*   Once enabled, **all messages** published to **all channels** under that keyset are automatically stored for the configured retention period.
*   **Selective Storage (via SDK publish option):** Some PubNub SDKs allow you to specify a `storeInHistory: false` (or similar) parameter in the `publish()` call. If set to `false`, that specific message will *not* be stored, even if Message Persistence is enabled for the keyset. Consult your SDK's documentation for this option.
    *   Example (JavaScript SDK): `pubnub.publish({ channel: 'my_channel', message: 'hello', storeInHistory: false });`
*   **Encryption:** If you are using client-side AES encryption (by providing a `cipherKey` during SDK initialization), messages will be stored in their encrypted form. They can only be decrypted by clients that also have the same `cipherKey` when fetching history. PubNub cannot decrypt these messages.

## Retrieving Stored Messages (History API)

Stored messages are retrieved using the History API, typically via an SDK method like `fetchMessages()` (JavaScript), `history()` (older SDKs/other languages), or similar.

**Common History API Parameters:**

*   `channel` (String) or `channels` (Array of Strings): The channel(s) to retrieve history from. Some SDKs allow fetching history for multiple channels in a single call if using Multiplexing.
*   `count` (Number, optional): The maximum number of messages to return in a single request (usually defaults to 100, and has a max of 100 per call).
*   `start` (String Timetoken, optional): Retrieve messages published *before* this timetoken (exclusive). Used for pagination backwards in time.
*   `end` (String Timetoken, optional): Retrieve messages published *up to and including* this timetoken (inclusive). Used for pagination forwards in time or fetching a specific time slice.
*   `reverse` (Boolean, optional):
    *   `false` (default): Messages are returned in oldest-to-newest chronological order.
    *   `true`: Messages are returned in newest-to-oldest chronological order.
    *   **Note:** Even if `reverse: true` is used to fetch the *set* of messages in reverse, the messages *within that set* are still generally ordered oldest to newest in the API response structure. Client-side logic may be needed to display them in reverse. If both `start` and `end` are provided, `reverse` is often ignored, and messages are returned from `start` towards `end`.
*   `includeTimetoken` (Boolean, optional) or `includeMeta` (Boolean, optional): Whether to include the publish timetoken (and sometimes other metadata) with each message in the history response. This is highly recommended.

**Pagination:**
*   To retrieve more than `count` messages, you must make multiple history calls (paginate).
*   Use the timetoken of the first/last message from the previous response as the `start` or `end` timetoken for the next request.
*   Stop paginating when a history call returns fewer messages than the `count` you requested (or zero messages).

**Example (Conceptual JavaScript `fetchMessages`):**

