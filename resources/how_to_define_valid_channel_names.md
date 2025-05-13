# How to Define Valid Channel Names in PubNub

Channel names are fundamental to PubNub's publish/subscribe messaging. Adhering to naming conventions ensures compatibility and proper functioning of features.

## Channel Name Specifications

*   **Character Set:** Channel names must be UTF-8 compatible.
*   **Length Limit:** A channel name can be up to 92 characters long.
*   **Case Sensitivity:** Channel names are case-sensitive. For example, `MyChannel` and `mychannel` are two distinct channels.

## Invalid Characters

The following characters are **not allowed** in PubNub channel names and should be avoided to prevent unexpected behavior or errors:

*   Comma (`,`)
*   Colon (`:`)
*   Asterisk (`*`) - Reserved for Presence and Wildcard Subscribe features.
*   Forward Slash (`/`)
*   Backslash (`\`)
*   Space ( )
*   Unicode zero (`\u0000`)
*   Non-printable ASCII control characters (e.g., null, bell, backspace).

While some SDKs or specific API interactions might appear to tolerate some of these characters, using them is not recommended as compatibility across all PubNub features and future updates is not guaranteed.

## Special Consideration: The Period Character (`.`)

*   The period (`.`) is **not an invalid character** in itself.
*   However, it is **reserved for special PubNub features**:
    *   **Wildcard Subscribe:** Used to define hierarchical channel patterns (e.g., `news.sports.*`).
    *   **PubNub Functions Event Bindings:** Can be used in channel patterns when binding Functions to specific channel events.
*   **Recommendation:** Avoid using the period character (`.`) in your general channel names unless you are intentionally using Wildcard Subscribe or Function event bindings. Using it casually might lead to unintended subscriptions or behavior if those features are enabled or used later.

## Best Practices for Channel Naming

1.  **Clarity and Convention:** Choose channel names that are descriptive and follow a consistent naming convention within your application. This makes debugging and management easier.
    *   Example: `user_updates:<userID>`, `chat_room:<roomID>`, `device_telemetry:<deviceID>`.
2.  **Avoid Invalid Characters:** Strictly avoid the listed invalid characters.
3.  **Use Periods Purposefully:** Only use periods when leveraging Wildcard Subscribe or specific Function binding patterns.
4.  **URL Encoding (If Necessary):** If you are constructing PubNub REST API calls manually (not through an SDK), ensure your channel names are properly URL-encoded if they contain characters that have special meaning in URLs (though it's best to avoid such characters in channel names altogether). SDKs handle this automatically.
5.  **Dynamic Generation:** When generating channel names dynamically (e.g., based on user IDs or session IDs), ensure your generation logic sanitizes the inputs to prevent the inclusion of invalid characters.

By following these guidelines, you can create valid and robust channel names that work seamlessly with all PubNub features. PubNub provides an online tool to validate channel names; search for "PubNub channel name validator" on their website or developer portal.

