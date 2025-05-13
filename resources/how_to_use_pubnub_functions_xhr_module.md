# How to Use the XHR Module in PubNub Functions

The `xhr` (XMLHttpRequest) module in PubNub Functions allows your serverless code to make outbound HTTP/S requests to external APIs, webhooks, or your own backend services.

## Requiring the XHR Module

To use the `xhr` module, you first need to require it in your Function:

```javascript
const xhr = require("xhr");
```

## Core Method: `xhr.fetch()`

The primary method provided by the `xhr` module is `fetch()`. It behaves similarly to the standard Fetch API in browsers and Node.js.

*   **Signature:** `xhr.fetch(url, http_options?)`
    *   `url` (String): The URL of the external resource to request.
    *   `http_options` (Object, optional): An object to configure the request, including method, headers, body, etc.
*   **Returns:** A Promise that resolves to a response object from the external server.

The response object typically contains:
*   `status` (Number): The HTTP status code (e.g., 200, 404, 500).
*   `body` (String): The response body as a string. You may need to parse it (e.g., `JSON.parse(response.body)`) if you expect JSON.
*   `headers` (Object): An object containing the response headers.

## Using `async/await`

All `xhr.fetch()` calls return a Promise, so you should always use `async/await` with `try/catch` for error handling.

## Examples

### 1. 

This example makes a GET request to an API endpoint and logs the response.

```javascript
export default async (request) => { // Or 'event' depending on trigger
  const xhr = require('xhr');
  const KVSTORE = require('kvstore');

  try {
    const apiUrl = 'https://api.quotable.io/random'; // Example public API
    console.log(`Fetching data from: ${apiUrl}`);

    const serverResponse = await xhr.fetch(apiUrl);

    console.log('Status:', serverResponse.status);
    // console.log('Headers:', serverResponse.headers);
    // console.log('Raw Body:', serverResponse.body);

    if (serverResponse.status === 200) {
      const quoteData = JSON.parse(serverResponse.body);
      console.log('Quote:', quoteData.content);

      // Optionally, do something with the data, like storing it or publishing it
      // request.message.quote = quoteData.content; // If modifying a message
      await KVSTORE.setItem('last_quote', quoteData.content);
    } else {
      console.error('API request failed with status:', serverResponse.status);
    }

    return request.ok(); // Or event.ok()
  } catch (error) {
    console.error('XHR request failed:', error);
    // Consider logging error.message or the full error object
    return request.abort(); // Or event.abort()
  }
};
```

### 2. 

This example sends a POST request with a JSON payload and custom headers.

```javascript
export default async (request) => { // Or 'event'
  const xhr = require('xhr');
  const pubnub = require('pubnub');

  const dataToPost = {
    body: 'Posting JSON from PubNub Function!',
    to: 'Webhook Listener',
    timestamp: new Date().toISOString()
  };

  const http_options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Custom-Header': 'PubNubFunctionCall'
    },
    body: JSON.stringify(dataToPost) // Important: Stringify your JSON body
  };

  try {
    const webhookUrl = 'https://httpbin.org/post'; // A common echo service for testing
    console.log(`Posting data to: ${webhookUrl}`);

    const resp = await xhr.fetch(webhookUrl, http_options);
    console.log('Webhook Response Status:', resp.status);

    const responseBody = JSON.parse(resp.body);
    console.log('Webhook Response Body:', responseBody.json); // httpbin echoes back the JSON sent

    // Optionally, publish the result or take other actions
    await pubnub.publish({
        channel: 'webhook_responses',
        message: { success: true, response: responseBody.json }
    });

    return request.ok(); // Or event.ok("Request succeeded")
  } catch (error) {
    console.error('POST request failed:', error);
    await pubnub.publish({
        channel: 'webhook_errors',
        message: { success: false, error: error.message }
    });
    return request.abort(); // Or event.abort(`Request Failed: ${error.message}`)
  }
};
```

### 3. 

It's common to need API keys for external services. Store these securely in the Vault module.

```javascript
export default async (request, response) => { // Example for an 'On Request' Function
  const xhr = require('xhr');
  const vault = require('vault');

  try {
    // Retrieve the API key securely from the Vault
    const apiKey = await vault.get("myExternalApiKey"); // "myExternalApiKey" is the secret name in Vault

    if (!apiKey) {
        console.error("API Key not found in Vault.");
        return response.send({ error: "Configuration error: API Key missing." }, 500);
    }

    const http_options = {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}` // Or "API_KEY": apiKey, etc., depending on the API
      }
    };

    const externalApiUrl = "https://api.example.com/protected/resource";
    console.log(`Fetching protected resource from: ${externalApiUrl}`);

    const resp = await xhr.fetch(externalApiUrl, http_options);
    console.log('Protected Resource Status:', resp.status);

    if (resp.status === 200) {
        const data = JSON.parse(resp.body);
        // Process data
        return response.send({ data: data }, 200);
    } else {
        console.error('Failed to fetch protected resource, status:', resp.status, 'Body:', resp.body);
        return response.send({ error: 'Failed to fetch external data', details: resp.body }, resp.status);
    }

  } catch (error) {
    console.error('Error using Vault or making XHR request:', error);
    return response.send({ error: 'An unexpected error occurred.' }, 500);
  }
};
```

## Important Considerations

*   **Timeout:** XHR requests have a timeout (typically around 5-10 seconds). 

