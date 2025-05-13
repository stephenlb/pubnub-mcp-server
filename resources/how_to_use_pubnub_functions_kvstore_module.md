# How to Use the KV Store Module in PubNub Functions

The `kvstore` (Key-Value Store) module in PubNub Functions provides a simple way to persist and retrieve data across different executions of your Functions or even between different Functions within the same keyset. It's useful for storing state, counters, configuration, cached data, and more.

## Requiring the KV Store Module

To use the `kvstore` module, you first need to require it in your Function:

```javascript
const db = require("kvstore"); // Or 'kvstore', 'store', etc. 'db' is a common alias.
```

## Core Methods

All methods of the `kvstore` module return Promises, so you should always use `async/await` with `try/catch` for error handling.

### 1. `db.setItem(key, value, ttlInMinutes?)` / `db.set(key, value, ttlInMinutes?)`
   Stores a value associated with a key.
   *   `key` (String): The unique key for the data.
   *   `value` (Any): The data to store. It can be a string, number, boolean, object, or array. It will be JSON-stringified.
   *   `ttlInMinutes` (Number, optional): Time-To-Live in minutes. If provided, the item will automatically expire after this duration. Max TTL is 43200 minutes (30 days). If not provided, the item persists indefinitely or until deleted.
   *   `db.set()` is an alias for `db.setItem()`.

```javascript
// Example: Storing data
await db.setItem("user_preferences:123", { theme: "dark", notifications: true });
await db.set("session_count", 0); // Using 'set' alias
await db.setItem("temp_data_abc", { value: "expires soon" }, 60); // Expires in 60 minutes
```

### 2. `db.getItem(key)` / `db.get(key)`
   Retrieves the value associated with a key.
   *   `key` (String): The key of the data to retrieve.
   *   Returns the stored value. If the key doesn't exist or the item has expired, it typically returns `null`.
   *   `db.get()` is an alias for `db.getItem()`.

```javascript
// Example: Retrieving data
const userPrefs = await db.getItem("user_preferences:123");
if (userPrefs) {
  console.log('User Theme:', userPrefs.theme);
} else {
  console.log('No preferences found for user 123.');
}

const sessionCount = await db.get("session_count"); // Using 'get' alias
```

### 3. `db.removeItem(key)`
   Deletes a key and its associated value from the store.
   *   `key` (String): The key of the data to remove.

```javascript
// Example: Removing data
await db.removeItem("temp_data_abc");
```

### 4. `db.increment(key, incrementValue?)` / `db.incr(key, incrementValue?)`
   Atomically increments a numerical value stored at a key. If the key doesn't exist, it's initialized to `0` before incrementing.
   *   `key` (String): The key of the counter.
   *   `incrementValue` (Number, optional): The value to increment by. Defaults to `1`. Can be negative to decrement.
   *   Returns the new value after incrementing.

```javascript
// Example: Incrementing a counter
const newCount = await db.increment("page_views:/home");
console.log('New home page views:', newCount);

await db.incr("active_users", -1); // Decrementing
```

### 5. `db.getCounter(key)`
   Retrieves the current value of a counter key. Similar to `getItem`, but specifically for counters.
   *   `key` (String): The key of the counter.
   *   Returns the numerical value or `null` if not set.

```javascript
// Example: Getting a counter value
const currentViews = await db.getCounter("page_views:/home");
```

### 6. `db.deleteCounter(key)`
   Deletes a counter key.
   *   `key` (String): The key of the counter to delete.

### 7. `db.getAllItems()`
   Retrieves all non-expired key-value pairs from the store for the current keyset.
   *   **Use with caution:** This can be a very expensive operation if you have a large number of items in the KV Store. It's generally not recommended for frequent use in high-throughput Functions.
   *   Returns an object where keys are the item keys and values are the stored items.

### 8. `db.getKeys()`
   Retrieves all non-expired keys from the store for the current keyset.
   *   **Use with caution:** Similar to `getAllItems()`, this can be resource-intensive.
   *   Returns an array of keys.

## Examples

### Example: Counting Message Types (On Before Publish)

```javascript
export default async (request) => {
  const db = require('kvstore');
  const pubnub = require('pubnub'); // For logging errors

  try {
    const messageType = request.message.type || 'unknown';
    const counterKey = `message_type_count:${messageType}`;

    const newTypeCount = await db.increment(counterKey);
    console.log(`Count for message type '${messageType}': ${newTypeCount}`);

    // Add total message count
    const totalMessageCount = await db.increment('total_messages_processed_function');
    request.message.processingCount = totalMessageCount; // Augment message

    return request.ok();
  } catch (error) {
    console.error('KV Store operation failed:', error);
    // Optionally publish error to a debug channel
    await pubnub.publish({
        channel: 'function_kv_errors',
        message: { error: 'KV Store failed', details: error.message, request: request.message }
    });
    return request.abort();
  }
};
```

### Example: Simple Caching with TTL (On Request)

```javascript
export default async (request, response) => {
  const db = require('kvstore');
  const xhr = require('xhr');

  const cacheKey = `external_api_data:${request.params.id}`; // Assuming an ID in request params
  const CACHE_TTL_MINUTES = 10; // Cache for 10 minutes

  try {
    let data = await db.getItem(cacheKey);

    if (data) {
      console.log('Serving from cache:', cacheKey);
      response.headers['X-Cache-Hit'] = 'true';
    } else {
      console.log('Cache miss. 

## Limits and Considerations

*   **Size Limits:**
    *   Key size: Up to 250 characters.
    *   Value size: Up to 30KB (after JSON stringification).
    *   Total KV Store size: Check PubNub documentation for the latest limits per keyset (often around 100MB or more, but subject to change and plan).
*   **Rate Limits:** There are rate limits on how frequently you can access the KV Store. High-frequency reads/writes might get throttled.
*   **Data Types:** Values are stored as JSON. Complex objects are automatically stringified and parsed.
*   **Atomicity:** `increment` is an atomic operation, making it safe for concurrent updates to counters.
*   **Scope:** The KV Store is scoped to your PubNub keyset. 

