# How to Add Notifications to a Chat Room App Using PubNub

Adding notifications to a chat room application enhances user engagement by informing them of new messages or important events, even when they are not actively viewing a specific chat room or the app itself. 

## 1. 

This informs users within the app that there are new messages in rooms they are not currently focused on.

*   **Concept:**
    *   When a message is published to a chat room channel (e.g., `chatroom_A`), if the recipient user is not currently "in" that room (i.e., the room's UI is not active), increment an unread counter for that room for that user.
*   **Implementation Ideas:**
    *   **Client-Side Logic:**
        *   Each client maintains a list of its chat rooms and their unread counts locally.
        *   When a message arrives on `chatroom_A`:
            *   If `chatroom_A` is the currently active view, do nothing to the counter (or mark as read).
            *   If `chatroom_A` is *not* active, increment its unread counter and update the UI (e.g., a badge on the room name in a list).
        *   When a user enters `chatroom_A`, reset its unread counter to zero.
    *   **PubNub App Context (Objects):**
        *   Store unread counts per user per channel in App Context.
        *   When a message is sent to `chatroom_A`, a PubNub Function (triggered by "After Publish" or "Before Publish") could iterate through members of `chatroom_A` (fetched from App Context) and update their individual unread counts for `chatroom_A` in their user metadata.
        *   Clients would subscribe to their own user metadata changes or fetch it to display unread counts. This is more complex but centralizes the logic.
    *   **Special Notification Channel:**
        *   When a message is sent to `chatroom_A`, also publish a small notification message to a user-specific channel (e.g., `user_notifications:<userID>`) or a global notification channel that all clients listen to. This notification would contain `{ "roomId": "chatroom_A", "newMessage": true }`.
        *   Clients listen to this channel and update their local unread counts based on these notifications if the specified `roomId` is not their active room.

## 2. 

This informs users of new messages anywhere in the app, perhaps prompting them to check a list of rooms with unread messages.

*   **Concept:** Use a dedicated global notification channel that all users subscribe to.
*   **Implementation:**
    *   When a message is published to any chat room (e.g., `chatroom_A`, `chatroom_B`), a PubNub Function (After Publish) also publishes a generic notification to a global channel like `global_app_notifications`.
    *   The payload might be minimal, just indicating activity, or could include the specific `roomId` so clients can be smarter about it.
    *   Clients listen to `global_app_notifications` and can display a general indicator (e.g., a dot on a "Chats" tab).

## 3. 

This is for notifying users when they are outside the app or the app is in the background.

*   **Concept:** When a message is published to a chat room, trigger a mobile push notification to the relevant participants of that room who are not currently active in the app.
*   **Implementation:**
    *   **Register for Push:** Devices register with APNS (Apple) or FCM (Google) and then register their device token with PubNub on specific channels (e.g., the chat room channels or user-specific notification channels).
    *   **PubNub Function Integration:**
        1.  A message is published to `chatroom_A`.
        2.  An "After Publish" PubNub Function is triggered.
        3.  The Function determines the participants of `chatroom_A`.
        4.  For each participant who should receive a push notification (e.g., they are offline or backgrounded – this state might need to be tracked using Presence or App Context), the Function constructs a specialized push payload (APNS/FCM format).
        5.  The Function then publishes this push payload to PubNub, targeting the device tokens associated with the recipient users/channels. PubNub bridges this to APNS/FCM.
    *   **Payload:** The push notification payload should be concise and include enough information for the user (e.g., "New message in [Chat Room Name]" or "UserX: Hello!"). It can also include a `data` payload to help the app navigate to the correct chat room when the user taps the notification.

## Key PubNub Features to Use

*   **Publish/Subscribe:** For core message delivery and for notification channels.
*   **PubNub Functions:** Essential for serverless logic like:
    *   Transforming messages for notifications.
    *   Determining recipients for push notifications.
    *   Updating unread counts in App Context.
    *   Publishing to multiple channels (e.g., original channel + notification channel).
*   **Mobile Push Notifications Gateway:** To send APNS/FCM messages.
*   **App Context (Objects):** To store user preferences (e.g., notification settings per room), room membership, and potentially unread counts.
*   **Presence:** Can help determine if a user is currently online and subscribed to a channel, which can inform whether to send a push notification or just an in-app unread marker.

When designing your notification system, consider the user experience: avoid over-notifying, provide clear settings for users to manage their notifications, and make notifications actionable. For questions or more specific guidance, contact PubNub Support at [support@pubnub.com](mailto:support@pubnub.com).

