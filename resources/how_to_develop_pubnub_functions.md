# How to Develop PubNub Functions

PubNub Functions allow you to execute serverless JavaScript code at the PubNub network edge in response to various events. This enables you to build real-time logic, integrations, and data transformations without managing your own backend infrastructure.

## Overview of PubNub Functions

*   **JavaScript Modules:** Functions are JavaScript modules with a default export.
*   **Event-Driven:** They are triggered by events such as incoming messages, HTTP requests, or scheduled intervals.
*   **Built-in Modules:** PubNub Functions provide access to several powerful modules:
    *   `kvstore`: A key-value store for persisting data across function executions.
    *   `xhr`: For making external HTTP/S requests to third-party APIs or your own servers.
    *   `vault`: A secure store for sensitive information like API keys or tokens.
    *   `pubnub`: The core PubNub client API for publishing messages, managing presence, etc., from within a Function.
*   **Asynchronous Operations:** All asynchronous operations (like using the built-in modules or other Promise-based operations) should use standard JavaScript Promises with `async/await` syntax. Avoid `.then()`/`.catch()` chains for better readability and error handling.
*   **Function Chaining:** You can chain up to 5 Functions consecutively, where the output of one Function can trigger another.
*   **Language:** Functions are written in JavaScript (ES6+ features are generally supported).

## Common Event Types and Function Structures

The structure of your Function depends on the event type it handles.

### 1. On Message (Before Publish or After Publish)
These Functions trigger when a message is published to a specific channel.
*   **`request` object:** Contains details about the incoming message and client.
*   **Methods:**
    *   `request.ok()`: Allows the message to proceed (possibly modified).
    *   `request.abort()`: Stops the message from being published or further processed.
    *   `request.json()`: (If applicable, for On Request) Parses the request body as JSON.

```javascript
// Example: On Before Publish or On After Publish
export default async (request) => {
  console.log('Message received:', request.message);

  // Your business logic here
  // e.g., modify the message
  // request.message.processed = true;

  try {
    // Example: Log to KV Store
    // const db = require('kvstore');
    // await db.setItem('last_message_timestamp', Date.now());

    return request.ok(); // Allow the message to proceed
  } catch (error) {
    console.error('Error processing message:', error);
    return request.abort(); // Stop the message
  }
};
```

### 2. On Request (HTTP Endpoint)
These Functions trigger when an HTTP request is made to a unique URL assigned to the Function.
*   **`request` object:** Contains HTTP request details (method, headers, query params, body).
*   **`response` object:** Used to send an HTTP response back to the caller.
*   **Methods:**
    *   `response.send(body, statusCode)`: Sends the HTTP response.
    *   `request.json()`: Parses the request body as JSON.

```javascript
// Example: On Request
export default async (request, response) => {
  console.log('HTTP Request received:', request.method, request.uri);
  // const body = await request.json(); // if expecting JSON body

  try {
    // Your business logic here
    const responseBody = { message: 'Request processed successfully' };
    response.headers['Content-Type'] = 'application/json'; // Set response header
    return response.send(responseBody, 200);
  } catch (error) {
    console.error('Error processing request:', error);
    return response.send({ error: 'Failed to process request' }, 500);
  }
};
```

### 3. On Interval (Scheduled Execution)
These Functions trigger at a predefined time interval (e.g., every 5 minutes).
*   **`event` object:** Contains information about the scheduled event.
*   **Methods:**
    *   `event.ok()`: Signals successful execution.
    *   `event.abort()`: Signals an error during execution.

```javascript
// Example: On Interval
export default async (event) => {
  console.log('Scheduled interval triggered.');

  try {
    // Your business logic here
    // e.g., fetch data from an external API and publish it
    // const xhr = require('xhr');
    // const pubnub = require('pubnub');
    // const apiResponse = await xhr.fetch('https://api.example.com/data');
    // const data = JSON.parse(apiResponse.body);
    // await pubnub.publish({ channel: 'scheduled_updates', message: data });

    return event.ok();
  } catch (error) {
    console.error('Error during scheduled execution:', error);
    return event.abort();
  }
};
```

## Best Practices for `async/await` and Promises

*   **Always use `async/await`:** This is the preferred way to handle Promises returned by PubNub modules (`kvstore`, `xhr`, `vault`, `pubnub`) and other asynchronous operations.
*   **`try/catch` for Error Handling:** Wrap `await` calls in `try/catch` blocks to handle potential errors gracefully.
*   **`Promise.all()` for Parallel Operations:** If you need to perform multiple asynchronous operations concurrently and wait for all of them to complete, use `Promise.all()`.

```javascript
// Preferred async/await style with try/catch
export default async (request) => {
  const store = require('kvstore');
  const xhr = require('xhr');
  try {
    const [apiDataResponse, storedValue] = await Promise.all([
      xhr.fetch('https://api.example.com/data'),
      store.getItem('some_key')
    ]);

    request.message.apiData = JSON.parse(apiDataResponse.body);
    request.message.storedItem = storedValue;

    return request.ok();
  } catch (error) {
    console.error('Error in parallel execution:', error);
    return request.abort();
  }
};
```

## General Development Guidance

*   **Module Loading:** Use `require('module_name')` to load built-in modules (e.g., `const kvstore = require('kvstore');`).
*   **Default Export:** Your Function must always be an `async` function that is the default export of the module.
*   **Error Handling:** Implement robust error handling using `try/catch` and use `event.abort()` or `request.abort()` or send an appropriate error `response` to indicate failures.
*   **Logging:** Use `console.log()` and `console.error()` for debugging. 

