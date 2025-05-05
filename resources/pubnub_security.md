## Can I hide my application keys?

To keep your keys secure, the recommendation is to pass the keys back after the user has been authenticated by your login process. No, this still does not prevent someone from snooping the live values, but there is a solution that PubNub provides: Access Manager. 

Enable Access Manager on your PubNub key set. Connect to your server for login with TLS (formerly SSL). During your login process, upon successful authentication, grant read and/or write access to an auth token (that you generate) to channels for this authenticated user. You can set a TTL (time to live) for the grants to whatever you want (minimum 1 minute; maximum 43200 minutes). Pass the pub, sub, and set auth token to the authenticated user. When you initialize PubNub in your client code, use the pub, sub, set the auth token, and set the TLS parameter to true (3x SDKs param is named SSL). Optionally, you can provide a cipher key to enable AES256 encryption.

With Access Manager, even a malicious user cannot gain access to channels that they were not authorized to access by your server.

See also: [Access Manager Guide](#) | [Data Security](#)

---

## Can I restrict subscribers by IP or URL?

With PubNub Functions, it will be possible to restrict subscriber access by IP address or referrer URL. But currently, Functions only supports publish event handlers (subscribe event handlers will be available as a future feature). Today, restricting access to subscribers by IP or URL is not strictly necessary to provide full security. The primary technique for restricting access to subscribers is accomplished using PubNub Access Manager.

See also: [Access Control Guide](#)

---

## Can I use PubNub with AES?

You can encrypt messages published via PubNub using AES-256. Applying AES-256 encryption to the contents of all published messages only requires supplying a value to the cipher key parameter.

For more information, check [Connection & Message encryption](#)

---

## Can I Use PubNub with TLS (HTTPS)?

TLS communication for PubNub clients is enabled by default. If you need to disable it for any reason, it can be done during the PubNub object initialization. Each SDK has its own API, so refer to our SDK docs for the one that you are using.

A sample code:
```js
var pubnub = new PubNub({
  subscribeKey: "mySubscribeKey",
  publishKey: "myPublishKey",
  userID: "ClientUserID",
  ssl: false // default true
})
```
For more information please check: [PubNub Connection Security Protocol Support](#)

---

## Can I whitelist IPs for PubNub traffic?

If your firewall blocks all traffic to all non-whitelisted IPs, then you can start by allowing:

- *.pubnub.com
- *.pndsn.com
- *.pubnub.net
- *.pubnubapi.com

If your firewall requires specific IP whitelisting then you must be on a paid plan. Please, contact PubNub Support for the full list of publicly accessible inbound and outbound PubNub Network IP addresses.

---

## Can PubNub avoid Denial-of-Service (DoS) attacks?

DoS and DDoS attacks are an inevitable reality to be dealt with today on most major websites. PubNub has taken measures to deal with these types of attacks and minimize their impact on apps deployed on our infrastructure at multiple levels, both technically and operationally. These measures include:

- Restricting/banning IP ranges for client access to our infrastructure
- Mechanisms for changing IPs of servers we provision in data centers
- Firewall mitigation techniques available through Amazon IaaS setup
- Global load-balancing dynamic DNS provider uses 4-IP auto-failover
- Use comprehensive TCP SYN flooding attack mitigation techniques
- Geo DNS provides automatic failover across multiple data centers
- Operator monitoring of site function with detailed multi-level reporting
- Continuous-deployment (interruption free) with server additions

We highly recommend using the PubNub Access Control as a mechanism to further restrict access to your account by authenticating users and granting read and/or write access at a channel and/or user/channel level.

See more details about how to use [PubNub Access Control](#).

---

## PubNub Connection Security Protocol Support

**What are the connection security protocols supported by PubNub?**

**Important Notice: TLS 1.2 Support Requirement Starting February 1st, 2025**

Effective February 1st, 2025, PubNub will only support the TLS 1.2 protocol for all communications. The deprecation date for TLS 1.1 is January 31st, 2025, giving you time to update your systems and ensure continuous service.

To prevent any service interruptions, we strongly recommend that you verify and upgrade your systems to support TLS 1.2 or higher as soon as possible, if you haven’t done so already. Regularly monitoring your systems before the deprecation date will help ensure a smooth transition. This upgrade is essential to maintaining the security, reliability, and performance of your PubNub integration.

To assist you, we have provided a test endpoint where you can check your system's compatibility with TLS 1.2:  
`pubsub-tls12-test.pubnub.com`

Please note that PubNub cannot control which TLS version your systems use, so it's critical that you ensure they are updated appropriately.

If you have any questions or need further assistance, feel free to reach out to us at support@pubnub.com

---

## How to sign requests with the secret key using the PubNub REST API?

When Access Manager is enabled, requests must be signed using a secret key. PubNub SDKs handle signing of the requests for you, automatically. If you choose to use PubNub REST APIs instead of an SDK, you must generate the signature and add it as a query param on your own.

To do this, please follow [Signature Generation in Access Manager](#). Additionally, you can reference the source code of a PubNub SDK and leverage it in your application. For reference, see our [Python SDK signing method](#).

---

## How to use cipher key and secret key?

Please refer to our official documentation to learn how cipher and secret keys are used:

- [Message Encryption](#)
- [File Encryption](#)
- [Access Control - Server-side operations](#)
- [JavaScript SDK Encrypt API](#)

In case of any questions, contact us at support@pubnub.com

---

## Is PubNub's persistent connection safe from attacks?

Yes, PubNub clients' socket connections through port 80 or port 443 of a customer's firewall are safe. PubNub provides attack mitigation solutions starting with opening only outbound connections which means no ports need to be opened.

Security vulnerability using the below configuration is prevented as follows:

- **Internet Communication over Port 80 and 443**
    - PubNub-enabled device must be able to transmit outward to the Internet on port 80 or 443
    - PubNub clients do not open inbound ports
    - There is NO need to open the firewall to receive on port 80 or 443
    - There is NO way for outside users to get into the user's network
    - PubNub does not listen to any ports
    - That is the case even if the user opened ports 80/443 for receipt

In case of any questions, please contact support@pubnub.com

---

## Is the cipher key used for TLS?

**What is the difference between using the cipher key and using TLS (formerly SSL)?**

TLS and a cipher key are independent mechanisms - they can be used either separately or together.

- TLS encrypts traffic between an end-point (browser, mobile device, etc) and PubNub's Network.
- Using a cipher key (AES), data is encrypted between two end-points. In other words, the data is encrypted from one device, through PubNub's Network (into Storage), and onto the receiving device(s).

**Note:** PubNub does not have access to your cipher key, therefore, no third party could ever ask PubNub to provide those keys for any reason. They would have to come to you to ask for the cipher key.

---

## Where can I find compliance reports?

In your admin portal account go to the "My Account" drop-down menu and select **Compliance**. Users with Free and Starter accounts can obtain the latest security reports upon request. Pro accounts have all the reports available for download in the Compliance section.

---

## Why does revoking access not work immediately?

PubNub authentication servers cache valid and non-revoked tokens in memory for 60 seconds. After a revoke request is made, it might take up to a minute for an actively used token's cache to expire and a client to receive the expected `403: Forbidden` error.

---

## Can I enable encryption for stored messages?

Yes, but encryption is up to the client. Messages encrypted when published will be encrypted when stored and must be decrypted when retrieved.

---
