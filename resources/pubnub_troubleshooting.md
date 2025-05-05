## PubNub Support Portal

### Accessing PubNub Support Portal

The first time you access the portal, you will need to create a login account.

1. Browse to https://support.pubnub.com/
2. Click 'Sign in' link at top right of the page
3. Sign in box appears
4. Click the 'Sign up' link to create a new account
5. Sign up box appears
6. Enter your full name and email address, and confirm you're not a robot
7. Sign-up complete message appears and a verification email is sent to the address provided
8. Click the verification link you receive by email to activate your account

You can now login to the PubNub Support Portal at https://support.pubnub.com/

*(example of Sign up screen)*

### Using PubNub Support Portal

Once you're logged in, you can use the PubNub Support Portal to view support tickets you have previously submitted, submit new tickets, and access our Knowledge Base.

**Note:** To raise a new support ticket, you can always email support@pubnub.com. Use of the Support Portal is not required.

*(example of Support Portal after login)*

#### Submitting a New Support Ticket

1. Click the 'Submit a request' button at top right of the page
2. Request form opens
3. Fill in the form with the requested details
4. Attach any files relevant to the request (logs, screenshots, etc.)
5. Click the 'SUBMIT' button

#### Viewing Previously Submitted Support Tickets

1. Click the 'My Tickets' link at top of the page or
2. Choose 'My activities' from the dropdown menu at top of the page
3. The 'My requests' page opens
4. Any support ticket you have previously submitted will appear in the list
5. Click a ticket subject line to open and view it

#### Editing Your Support Profile

1. Click 'My profile' from the dropdown menu at top of the page
2. Profile page opens
3. Click the 'Edit profile' button and update as needed
4. Be sure to save changes by clicking the 'OK' button

#### Changing Your Support Portal Password

1. Click 'Change password' from the dropdown menu at top of the page
2. Password page opens
3. Enter current and new passwords
4. Click the 'Save' button

#### Accessing the Support Knowledge Base

- You can access the knowledge base whether or not you're logged in to the Support Portal
    - Type a search term into the 'Search' field and return/enter or
    - Scroll down to view all Knowledge Base sections and browse the articles

*(example of Support Portal Knowledge Base search)*

### Additional Features

When viewing the PubNub Support Portal, you'll notice two boxes in the middle of the page.

- View PubNub network status by clicking the 'Check the system status' link
- View our latest feature releases by clicking the 'Check all feature releases' link

### Getting Help with PubNub Support Portal

If you need help using the Support Portal, you can email us at support@pubnub.com, or click the '(?) Support' button at bottom right of the page to contact us. We're happy to help!

---

## What are the demo keys for?

The demo key set is only meant for sample apps on our website (docs, blogs), useful for interactive online demos only and for trying out PubNub with the PubNub Debug Console.

Using the demo key set means that anyone subscribing to the same channel you are publishing to will receive those messages. The demo key set is throttled to prevent abuse, so any app using the demo keys may not behave as you would desire.

For development and testing of your apps, please register for a free account and use those keys.

---

## What if I need live support during my virtual event?

We offer two options to be able to receive live support during a virtual event:

1. **Our Platinum Support Plan** includes 5 hours per month, no rollover options. All you have to do is opt-in to using those hours when you fill in the Virtual Events form. Look for the opt-in box.
2. **You can purchase a Virtual Events Package** separately, without a Support Plan.

Please, also visit our article *What to do if I'm hosting a virtual event?*

If you have any questions, contact support@pubnub.com

---

## What to do if I am hosting a virtual event?

It's simple- just let us know. If your event gathers more than 10,000 concurrent users, fill in the Virtual Event form. This will generate a support ticket with us that we will use to communicate with you prior to the event(s).

**IMPORTANT:** We need to be informed about it 10 days before the event takes place.

If you have any questions, contact support@pubnub.com

---

## Custom origin - what is it and how to use it

A custom origin is a subdomain configured for a specific customer and looks like `abc.pubnubapi.com`. Using a custom origin allows PubNub to route traffic per customer when a point of presence (PoP) is not performing well or becomes unavailable. It also allows for custom configurations that may be required for a specific use case or region.

Having a custom origin makes it possible for your application's traffic to appear like it's coming from your own domain, rather than multiple domains. If required, PubNub also provides TLS certificate hosting. When TLS is used, we would need you to supply us with your own certificate. This service comes with an additional monthly fee.

### Requesting a Custom Origin

You can request a custom origin by creating a support ticket with PubNub Support, using the subject "Request Custom Origin." Be sure to provide the following details in the request:

- The PubNub account email that has or will have the paid production key set(s)
- Three choices for your subdomain in order of preference (12 characters or less, like abc.pubnubapi.com)
- The PubNub SDKs you currently use in your applications: SDK language/name and version
- Do you have customers or devices in China?

PubNub Support will provide you with a confirmation on your custom origin name and SDK initialization code for the SDK/version that you use. Once you have it, you can start using it by changing the way you initialize PubNub instance in your SDK.

**NOTE:** Keep in mind that to improve response times and avoid congestion, browsers have their own limitations to concurrent connections:

| Browser                 | Connections per host name | Max connections |
|-------------------------|--------------------------|----------------|
| Chrome                  | 6                        | 10             |
| Chrome mobile           | 6                        | 16             |
| Internet Explorer 9     | 6                        | 35             |
| Internet Explorer Mobile9 | 6                      | 60             |
| Internet Explorer 10    | 8                        | 17             |
| Internet Explorer 11    | 13                       | 17             |
| Firefox                 | 6                        | 17             |
| Safari                  | 6                        | 17             |
| Android                 | 6                        | 17             |

In case of any questions, contact us at support@pubnub.com.

---

## How do I detect dropped connections?

For connection management please refer to our official documentation: [Connection Management](https://www.pubnub.com/docs/sdks/)

In case of any questions, contact us at support@pubnub.com

---

## What is an Early Closed Connection (NGINX HTTP 499 status code)?

The Early Closed Connection (HTTP status code 499 in NGINX) occurs when a client terminates the connection before the server has had the chance to send a response. This is a client-side initiated action and falls under the 4xx class of status codes, which typically represent client errors. However, it is a normal part of web activity and doesn't necessarily indicate a problem.

499s are generally not problematic and should be treated as business as usual unless there's a sharp increase, which would warrant an investigation into possible client network connection reliability.

In an ideal scenario, a client sends a request and the server processes it, returning a response - usually with a status code 200 (OK) for successful requests. However, if the client cancels the request before the server has finished processing it, it is logged as 499 (NGINX custom code).

This cancellation can occur for several reasons:

- **Client Timeout:** The client has a set timeout for how long it is willing to wait for a response. If the server takes longer, the client aborts the request.
- **User Cancels a Request:** If the user manually cancels the request - such as by closing the browser tab/window, clicking the Refresh, Back, or Cancel button - the connection is terminated, leading to a 499.

### Why is a 499 not an error?

Though the 499 status code falls within the 4xx range (client errors), it is not necessarily an issue. It’s simply a normal part of web traffic. Aborted requests happen for various reasons, and many of them are part of routine operations, especially in environments where users frequently change actions or drop connectivity.

### Early Closed Connection in PubNub

In PubNub, modifying the list of subscribed channels - by adding or removing them - cancels the existing HTTP subscribe request and initiates a new one with the updated list. This behaviour is expected and is the primary reason for 499 status codes, as the client closes the original request to establish a new one.

Nevertheless, a sudden increase in 499 codes can signal a potential problem when it comes to requests made to PubNub network:

- **Too short client timeout settings** may cause requests to be aborted before the server can respond. If you explicitly set any PubNub timeouts lower than the defaults, consider increasing