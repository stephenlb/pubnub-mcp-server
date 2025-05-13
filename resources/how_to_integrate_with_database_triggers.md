# How to Integrate PubNub with Database Triggers (e.g., MySQL)

You can integrate PubNub with database systems like MySQL by using database triggers to publish messages to PubNub channels when data changes (e.g., on `INSERT`, `UPDATE`, or `DELETE` operations). This allows you to broadcast database modifications in real-time to connected clients.

## Concept

The general idea is:
1.  A change occurs in a database table (e.g., a new row is inserted).
2.  A database trigger, defined on that table for that specific operation, is activated.
3.  The trigger executes a stored procedure or calls an external script/program.
4.  This procedure/script makes an HTTP request to the PubNub Publish API endpoint, sending the relevant data as a message.

## Example: MySQL Trigger Publishing via `curl` (Simplified)

This example demonstrates a conceptual approach using a MySQL trigger that calls a stored procedure, which in turn uses `sys_eval` (a user-defined function or an equivalent that can execute shell commands) to publish via `curl`.

**Prerequisites for this specific MySQL example:**
*   The MySQL server must have a way to execute shell commands from within a stored procedure. This is often achieved through:
    *   User-Defined Functions (UDFs) like `sys_eval` or `sys_exec` (which need to be compiled and installed into MySQL). This is not a standard MySQL feature and can have security implications.
    *   Writing the data to a specific location that an external script monitors.
*   `curl` command-line tool must be installed and accessible on the database server.
*   The database server must have network access to PubNub's publish endpoints.

**1. Create a Stored Procedure to Publish:**
This procedure constructs a `curl` command to call the PubNub publish API.

