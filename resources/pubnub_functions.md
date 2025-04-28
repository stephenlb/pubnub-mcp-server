# PubNub Functions Development Guidelines

## Overview

- **Functions** are JavaScript modules exported with a default export, used for event-based integrations in PubNub.
- **Modules** available: `kvstore` (key-value store), `xhr` (external HTTP requests), `vault` (secret storage), `pubnub` (core client API).
- **Event Types**: On Request, On Interval, and others.
- **Asynchronous operations** use standard JavaScript Promises; use `async/await` instead of `.then()`/`.catch()` chains.
- **Function chaining**: up to 5 functions can be chained consecutively.

---

## Function Structures

### Other Event Types (non-Request)

```js
export default async (event) => {
  // Your business logic here
  return event.ok();
  // Use event.abort() to abort execution on error
};
```

- `event.ok()` & `event.abort()` available, no `response` object.

---

### On Request

```js
export default async (request, response) => {
  // Your code here
  return response.send();
};
```

- `request.json()` is available.
- Use `response.send([body], [statusCode])` on the `response` object to send an HTTP response.

---

### On Interval

```js
export default async (event) => {
  // Your code here
  return event.ok();
};
```
- `event.ok()` & `event.abort()` available.

---

## Promises (`async/await` usage)

**Do not require** `Promise = require('promise')`, it's implicitly available.

### Parallel Execution Example

#### Original (Promise.then)
```js
// Not preferred for LLM context
export default (request) => {
  const store = require('kvstore');
  const xhr = require("xhr");
  const fullName = store.get('fullName');
  const ipAddress = xhr.fetch("https://httpbin.org/ip");
  return Promise.all([fullName, ipAddress])
    .then((values) => {
      request.message.fullNameResult = values[0];
      request.message.ip = JSON.parse(values[1].body).origin;
      return request.ok();
    })
    .catch((err) => {
      console.log(err);
      return request.abort(err);
    });
};
```

#### **Use this instead (async/await recommended):**

```js
export default async (request) => {
  const store = require('kvstore');
  const xhr = require("xhr");
  try {
    const [fullName, ipResponse] = await Promise.all([
      store.get('fullName'),
      xhr.fetch("https://httpbin.org/ip")
    ]);
    request.message.fullNameResult = fullName;
    request.message.ip = JSON.parse(ipResponse.body).origin;
    return request.ok();
  } catch (err) {
    console.log(err);
    return request.abort(err);
  }
};
```

---

## XHR Module

- `const xhr = require("xhr");`
- **Method:** `xhr.fetch(url, http_options?)`

### Examples (All rewritten to `async/await`)

#### Simple GET

```js
export default async (event) => {
  const xhr = require('xhr');
  try {
    const serverResponse = await xhr.fetch('https://neutrinoapi.com/geocode-address');
    // handle serverResponse
    return event.ok();
  } catch (err) {
    // handle request failure
    return event.abort();
  }
};
```

#### POST with JSON Body

```js
export default async (event) => {
  const xhr = require('xhr');
  const http_options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body: 'Posting JSON!', to: 'Someone Special!' })
  };
  try {
    const resp = await xhr.fetch('http://httpbin.org/post', http_options);
    const body = JSON.parse(resp.body);
    console.log(body);
    return event.ok('Request succeeded');
  } catch (err) {
    console.log(err);
    return event.abort(`Request Failed: ${err}`);
  }
};
```

---

## Vault Module

Retrieve secrets from secret store.

```js
export default async (request, response) => {
  const xhr = require('xhr');
  const vault = require('vault');
  try {
    const apiKey = await vault.get("myApiKey");
    const http_options = {
      method: "GET",
      headers: { "API_KEY": apiKey }
    };
    const resp = await xhr.fetch("https://httpbin.org/get", http_options);
    console.log(resp);
    return response.send("OK");
  } catch (err) {
    return response.send("Error");
  }
};
```

---

## KV Store Module

- **Require**: `const db = require("kvstore");`
- All methods return Promise; use `await`.

### Examples

#### Set
```js
await db.set("key", {value: true});
```
#### Set with TTL (in minutes)
```js
await db.set("key", {value: true}, 2880); // 2 days
```
#### Get
```js
const value = await db.get("key");
```
#### SetItem, GetItem, RemoveItem

```js
await db.setItem("key", "value");
const value = await db.getItem("key");
await db.removeItem("key");
```

---

## PubNub Module

- **Require**: `const pubnub = require('pubnub');`
- All methods return Promise; use `await`.

### Examples

#### Publish

```js
await pubnub.publish({
  channel: "hello_universe",
  message: request.message,
});
```

#### Fire

```js
await pubnub.fire({
  channel: "hello_universe",
  message: request.message,
});
```

#### Signal

```js
await pubnub.signal({
  channel: "hello_universe",
  message: request.message // must be <64 bytes
});
```

#### List Files in Channel

```js
const res = await pubnub.listFiles({ channel: 'my_channel', limit: 2 });
console.log(res);
```

---

## Guidance for LLM Prompting

- **Always prefer `async/await` instead of `.then()`/`.catch()`.**
- All PubNub SDK methods and PubNub Functions modules (`kvstore`, `xhr`, `vault`) return Promises.
- Use `try/catch` blocks for error handling, returning `abort()` or similar on error.
- Default export is always an `async` function receiving the event-specific arguments (`request`, `response`, or `event`).
- Use `require('module')` for modules: `kvstore`, `xhr`, `vault`, `pubnub`.

---

## Typical Pattern (Error-handling, Return)

```js
export default async (request) => {
  try {
    // Business logic...
    return request.ok()
  } catch(e) {
    // Logging/handling
    return request.abort();
  }
};
```

---

**When generating or transforming PubNub Functions code, always:**  
- Use the above patterns for structure.  
- Replace `.then()` chains with async/await + try/catch.  
- Use the correct module and method signatures as described.

