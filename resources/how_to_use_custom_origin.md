# Custom Origin with PubNub: What It Is and How to Use It

A custom origin, also known as a custom CNAME or vanity domain, allows you to interact with the PubNub network using a subdomain that is branded to your own domain, rather than PubNub's default domains.

## What is a Custom Origin?

Instead of your application's traffic going to `ps.pndsn.com` (a typical PubNub endpoint), it can be configured to go to a subdomain like `pubnub.yourcompany.com` or `abc.pubnubapi.com` (if PubNub provisions it under their domain).

**Key Benefits and Use Cases:**

1.  **Branding:** Presents a more seamless and branded experience to your users or for your network traffic. Your application's network requests will appear to be directed to your own domain.
2.  **Traffic Routing and Resilience:** Allows PubNub to route your specific traffic more effectively, especially if a particular standard Point of Presence (PoP) is underperforming or becomes unavailable for your users. It can provide an additional layer of routing control.
3.  **Custom Configurations:** May be required for specific use cases or regional needs where custom network configurations are beneficial.
4.  **Simplified Whitelisting (Potentially):** In some corporate environments, it might be easier to get a subdomain of your own company whitelisted than PubNub's generic domains, though whitelisting `*.pubnub.com`, `*.pndsn.com`, etc., is generally recommended.
5.  **TLS Certificate Hosting:** If required, PubNub can provide TLS certificate hosting for your custom origin. If TLS is used with your custom origin, you would typically need to supply PubNub with your own SSL/TLS certificate for that specific subdomain. This service usually incurs an additional monthly fee.

## Requesting a Custom Origin

Setting up a custom origin requires coordination with PubNub Support.

1.  **Eligibility:** Custom origins are typically available for customers on paid PubNub plans.
2.  **Create a Support Ticket:** Contact PubNub Support by emailing [support@pubnub.com](mailto:support@pubnub.com) or through the support portal.
    *   Use a clear subject line like "Request Custom Origin."
3.  **Provide Required Details:**
    *   Your PubNub account email address (the one associated with the paid production keyset(s) that will use the custom origin).
    *   Three choices for your desired subdomain, in order of preference (e.g., `realtime.yourcompany.com`, `updates.yourapp.com`). If using a `pubnubapi.com` subdomain, it should be 12 characters or less (e.g., `xyzcorp.pubnubapi.com`).
    *   The PubNub SDKs you are currently using in your applications (include SDK language/name and version, e.g., JavaScript v7.x.x, Java v5.x.x). This helps PubNub provide correct initialization code.
    *   Specify if you have customers or devices located in China, as this might influence routing or configuration.
4.  **Confirmation and Setup:**
    *   PubNub Support will work with you to confirm the availability of your chosen subdomain and guide you through any DNS changes required on your end (if you are using a subdomain of *your* company's domain, you'll need to create a CNAME record pointing to a PubNub-provided endpoint).
    *   They will provide you with the specific custom origin name and the updated SDK initialization code for your SDK/version.

## Using Your Custom Origin in SDKs

Once PubNub confirms your custom origin is active, you will need to modify your PubNub SDK initialization code to use it. Instead of relying on the default PubNub domains, you'll specify your custom origin.

*   **Example (Conceptual - JavaScript SDK):**
    ```javascript
    // Default initialization:
    // var pubnub = new PubNub({
    //   subscribeKey: "YOUR_SUBSCRIBE_KEY",
    //   publishKey: "YOUR_PUBLISH_KEY",
    //   userId: "someUserId"
    // });

    // Initialization with custom origin:
    var pubnub = new PubNub({
      subscribeKey: "YOUR_SUBSCRIBE_KEY",
      publishKey: "YOUR_PUBLISH_KEY",
      userId: "someUserId",
      origin: "yourcustom.origin.com" // Your assigned custom origin
      // ssl: true // Ensure TLS is enabled
    });
    ```
    The exact parameter name (`origin`, `customOrigin`, etc.) varies by SDK. Refer to your specific SDK's documentation or the instructions provided by PubNub Support.

## Browser Connection Limits Note

While custom origins offer benefits, they don't directly bypass browser limitations on the number of concurrent connections per hostname. Browsers (like Chrome, Firefox, Safari) typically limit a single tab to around 6-8 persistent connections to any single hostname to prevent resource exhaustion. If your application makes many simultaneous, long-lived connections, this limit is a factor regardless of whether a custom origin is used. A custom origin primarily affects how traffic is routed to PubNub and how it appears externally.

