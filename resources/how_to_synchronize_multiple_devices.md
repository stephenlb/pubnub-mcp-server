# How to Synchronize Multiple Devices Using PubNub

Synchronizing actions or states across multiple devices in real-time is a common requirement for collaborative applications, multi-screen experiences, and distributed systems. PubNub can facilitate this through its messaging and time API.

## Core Principle: Shared State and Coordinated Actions

The goal is to ensure that all participating devices have a consistent view of a shared state or execute actions at the same (or very close to the same) time.

**General Approaches:**

1.  **Broadcasting State Changes:**
    *   When one device changes a part of the shared state, it publishes a message to a PubNub channel that all other interested devices are subscribed to.
    *   The message payload contains information about the change.
    *   Receiving devices update their local representation of the state accordingly.
    *   **Example:** In a collaborative whiteboard, if one user draws a line, their client publishes the line's coordinates. Other clients receive this and draw the same line on their canvas.

2.  **Commanding Actions:**
    *   One device (a controller or a peer) publishes a command message to other devices.
    *   Receiving devices execute the command.
    *   **Example:** A remote control app publishes a "play" command to a media player app.

## Using PubNub's Time API for Precise Timing

For actions that need to happen as simultaneously as possible across devices, relying solely on message receipt time can be problematic due to varying network latencies to each device. PubNub's Time API provides a globally synchronized timetoken that can be used as a common reference.

**Steps for Synchronized Action Execution:**

1.  Request PubNub Server Time:
    *   Use the PubNub Time API to fetch the current `server_timetoken` (e.g., `pubnub.time().then(...)`).
    *   Record the local timestamps before and after the API call to measure round-trip latency.

2.  Estimate Round-Trip Latency:
    *   Calculate round-trip delay: `round_trip_ms = t_response_ms - t_request_ms`.
    *   Estimate one-way latency: `latency_ms = round_trip_ms / 2`.

3.  Compute Local Time Offset:
    *   Convert `server_timetoken` to milliseconds: `server_timetoken_ms = server_timetoken / 10000`.
    *   Determine local-to-PubNub offset: `time_offset_ms = server_timetoken_ms + latency_ms - t_response_ms`.

4.  **Calculate Target Execution Timetoken:**
    *   Convert the PubNub `server_timetoken` to milliseconds if needed (it's in 100-nanosecond units). PubNub timetokens are 17 digits; the first 10 are seconds, the next 7 are 100-nanosecond increments. So, `server_timetoken_ms = server_timetoken / 10000`.
    *   The coordinator decides on a future target execution time. This target time should be slightly in the future to allow the command message to reach all clients and to account for their own local processing.
    *   `target_execution_offset_ms = 500` (e.g., execute 500ms from now, relative to the server's time plus estimated latency).
    *   `target_pubnub_timetoken_ms = server_timetoken_ms + time_offset_ms + target_execution_offset_ms`.
        *   Convert this target timetoken back to the 17-digit PubNub format if necessary for comparison or if PubNub messages themselves carry timetokens for action.

5.  Publish Command with Target Timetoken:
    *   Include the `target_pubnub_timetoken_ms` and any action details in the message payload.
    *   Publish this command to the designated PubNub channel.

6.  **Client Devices Receive and Schedule Action:**
    *   Each subscribed client receives this command message.
    *   Each client also needs to know its own offset from PubNub's time. They can perform a similar time sync (steps 1-3) periodically or at startup to get `current_pubnub_time_ms_on_client = (pubnub_server_timetoken_ms_from_time_api + client_latency_offset)`.
    *   When a client receives the command, it calculates how long it needs to wait: `wait_duration_ms = command.execute_at_timetoken_ms - current_pubnub_time_ms_on_client`.
    *   The client then uses its local `setTimeout()` or equivalent scheduling mechanism to execute the action after `wait_duration_ms`.

**Periodic Re-Synchronization:**
*   Network latency can change. Devices should periodically re-synchronize their local clocks/offsets with the PubNub time API (e.g., on app start, and perhaps every few minutes if high precision is critical).

## Considerations

*   **Clock Drift:** Device local clocks can drift. Relying on a common external time source like PubNub's is more reliable for synchronization.
*   **Complexity:** Implementing highly precise synchronization requires careful management of time calculations and offsets on each client.
*   **User Experience:** For actions triggered by users, some perceived delay for synchronization might be acceptable. If one client is significantly latent, it might appear to act later than others.
*   **State Resolution for Conflicts:** If multiple devices can initiate changes to a shared state simultaneously, you'll need a conflict resolution strategy (e.g., last-write-wins based on PubNub timetoken, or a more complex operational transform approach).

For many collaborative applications, simply ensuring that state change messages are processed in the order they are received (which PubNub facilitates with timetokens) is sufficient. The more precise PubNub Time API synchronization is for scenarios demanding tighter coordination of actions across disparate clients.

