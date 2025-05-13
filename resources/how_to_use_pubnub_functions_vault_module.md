# How to Use the Vault Module in PubNub Functions

The `vault` module in PubNub Functions provides a secure way to store and access sensitive information such as API keys, database credentials, or other secrets that your Functions need to operate. Storing secrets in the Vault is much more secure than hardcoding them directly into your Function's source code.

## Requiring the Vault Module

To use the `vault` module, you first need to require it in your Function:

```javascript
const vault = require('vault');
```

## Core Method: `vault.get()`

The primary method for retrieving a secret from the Vault is `get()`.

*   **Signature:** `vault.get(secretName)`
    *   `secretName` (String): The name of the secret you want to retrieve, as configured in the PubNub Admin Portal for your Function.
*   **Returns:** A Promise that resolves to the value of the secret. If the secret is not found, it may resolve to `null` or `undefined`, or the Promise might reject depending on the specific behavior (always good to check for existence).

## Using `async/await`

All `vault.get()` calls return a Promise, so you should always use `async/await` with `try/catch` for error handling.

## Storing Secrets in the Vault

Before you can retrieve a secret in your Function, you must first store it in the Vault:

1.  Go to the PubNub Admin Portal.
2.  Navigate to your Application and then to your Keyset.
3.  Select "Functions" and then choose the Event Handler (Function) you are working with.
4.  In the Function editor/configuration section, there will be an area labeled "My Secrets" or "Vault."
5.  Click "Create Secret" (or similar) and provide:
    *   **Secret Name:** The name you will use in `vault.get("secretName")`.
    *   **Secret Value:** The actual sensitive data.
6.  Save the secret.

## Examples

### 1. 

This is a very common use case: fetching an API key from the Vault to authenticate an external HTTP request.

```javascript
export default async (request) => { // Or 'event', 'response' depending on trigger
  const xhr = require('xhr');
  const vault = require('vault');
  const pubnub = require('pubnub'); // For publishing results/errors

  try {
    const apiKey = await vault.get("myWeatherApiKey"); // Secret named "myWeatherApiKey" in Vault

    if (!apiKey) {
      console.error("API Key 'myWeatherApiKey' not found in Vault.");
      await pubnub.publish({ channel: 'function_errors', message: { error: "Missing API Key in Vault" }});
      return request.abort ? request.abort() : (request.ok ? 

    const city = request.message && request.message.city ? 

    console.log(`Fetching weather data for ${city}`);
    const http_options = {
      method: "GET"
    };

    const weatherResponse = await xhr.fetch(weatherApiUrl, http_options);
    console.log('Weather API Status:', weatherResponse.status);

    if (weatherResponse.status === 200) {
      const weatherData = JSON.parse(weatherResponse.body);
      console.log(`Weather in ${city}: ${weatherData.weather.description}, Temp: ${weatherData.main.temp}°C`);

      // Modify original message or publish a new one
      if (request.message) {
        request.message.weather = weatherData;
      } else {
        await pubnub.publish({ channel: 'weather_updates', message: { city: city, weather: weatherData } });
      }
      return request.ok ? request.ok() : undefined;
    } else {
      console.error('Weather API request failed:', weatherResponse.status, weatherResponse.body);
      await pubnub.publish({ channel: 'function_errors', message: { error: "Weather API request failed", status: weatherResponse.status }});
      return request.abort ? request.abort() : (request.ok ? 

  } catch (error) {
    console.error('Error in Vault/XHR Function:', error);
    await pubnub.publish({ channel: 'function_errors', message: { error: "General Function error", details: error.message }});
    return request.abort ? request.abort() : (request.ok ? 

### 2. 

You might need multiple secrets for different services.

```javascript
export default async (event) => {
  const vault = require('vault');
  const xhr = require('xhr');

  try {
    const [serviceA_ApiKey, serviceB_Token] = await Promise.all([
      vault.get("serviceA_Key"),
      vault.get("serviceB_SecretToken")
    ]);

    if (!serviceA_ApiKey || !serviceB_Token) {
        console.error("One or more secrets are missing from the Vault.");
        return event.abort("Missing secrets configuration.");
    }

    // Use serviceA_ApiKey for a request
    // const responseA = await xhr.fetch('https://api.serviceA.com/data', { headers: {'X-API-KEY': serviceA_ApiKey }});
    // console.log('Service A responded with status:', responseA.status);

    // Use serviceB_Token for another request
    // const responseB = await xhr.fetch('https://api.serviceB.com/action', { method: 'POST', headers: {'Authorization': `Bearer ${serviceB_Token}`}, body: '{}' });
    // console.log('Service B responded with status:', responseB.status);

    console.log("Successfully retrieved and (conceptually) used multiple secrets.");
    return event.ok();

  } catch (error) {
    console.error('Failed to retrieve or use secrets:', error);
    return event.abort(error.message);
  }
};
```

## Security Benefits of Using Vault

*   **No Hardcoded Secrets:** Sensitive data is not exposed in your Function's source code, which might be version controlled or viewed by multiple developers.
*   **Centralized Management:** Secrets are managed through the PubNub Admin Portal, making it easier to update or rotate them without changing Function code.
*   **Reduced Risk:** If your Function code itself is somehow exposed, the secrets remain protected within the Vault.

Always use the Vault module for any sensitive data your PubNub Functions require.
```

