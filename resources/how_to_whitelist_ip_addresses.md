# How to Whitelist IP Addresses for PubNub Traffic

If your network environment has a strict firewall that blocks all outbound traffic to non-whitelisted IP addresses or domains, you will need to configure rules to allow communication with the PubNub network.

## General Domain Whitelisting (Preferred)

The most flexible and recommended approach is to whitelist PubNub's primary domains. This is less prone to issues caused by IP address changes in PubNub's dynamic infrastructure. 

*   `*.pubnub.com`
*   `*.pndsn.com` (PubNub Data Stream Network)
*   `*.pubnub.net`
*   `*.pubnubapi.com`

Using wildcards (`*`) is important because PubNub uses various subdomains for its services and global Points of Presence (PoPs).

## Specific IP Address Whitelisting (Paid Plans Only)

If your firewall policies strictly require whitelisting specific IP addresses rather than domains:

*   **Paid Plan Required:** This option is typically available only for customers on a **paid PubNub plan**.
*   **Contact PubNub Support:** You must contact PubNub Support ([support@pubnub.com](mailto:support@pubnub.com)) to obtain the full list of publicly accessible inbound and outbound PubNub Network IP addresses.
*   **Dynamic IPs:** Be aware that PubNub's IP addresses can change as part of routine network maintenance, scaling operations, or incident response. If you whitelist specific IPs, you will need a process to keep this list updated by coordinating with PubNub Support. Domain-based whitelisting avoids this maintenance overhead.

## PubNub Connections are Outbound

It's important to remember that PubNub client SDKs initiate **outbound connections** from your devices/servers to the PubNub network.

*   **No Inbound Ports Needed:** You generally do not need to open any inbound ports on your firewall for PubNub clients to function. They establish connections to PubNub servers on standard ports (80 for HTTP, 443 for HTTPS/TLS).
*   This outbound-only model enhances security as it doesn't create listening ports on your network that could be targeted from the internet.

## Testing Connectivity

After configuring your firewall rules, thoroughly test your application's connectivity to PubNub to ensure messages can be published and subscribed successfully. Use tools like `telnet` or `openssl s_client` (for TLS connections) from within your network to verify connectivity to PubNub domains/IPs on the required ports if you encounter issues.

*   Example test for TLS 1.2 compatibility (relevant for future requirements): `openssl s_client -connect pubsub-tls12-test.pubnub.com:443 -tls1_2`

Always consult with your network security team when making firewall changes.

