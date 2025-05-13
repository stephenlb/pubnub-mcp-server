# How PubNub Helps Mitigate Denial-of-Service (DoS) Attacks

Denial-of-Service (DoS) and Distributed Denial-of-Service (DDoS) attacks are a persistent threat for any internet-facing service. PubNub employs a multi-layered strategy, both technically and operationally, to protect its infrastructure and, by extension, the applications built upon it.

## PubNub's Infrastructure-Level Protections

PubNub's global network is designed with resilience and attack mitigation in mind:

1.  **Global Anycast Network & Points of Presence (PoPs):**
    *   With 15+ PoPs worldwide, traffic is routed to the nearest available data center. This distributes load and can absorb localized attacks, often mitigating their impact on the global service.
    *   Geo DNS provides automatic failover across multiple data centers if one PoP becomes unresponsive.

2.  **Scalable Architecture:**
    *   PubNub's infrastructure is built to handle massive traffic volumes and can scale dynamically to absorb sudden surges, which can be characteristic of DoS attacks.

3.  **IP Address Management:**
    *   Mechanisms for changing IP addresses of servers provisioned in data centers allow for quick response if specific IPs are targeted.
    *   Ability to restrict or ban abusive IP ranges from accessing the infrastructure.

4.  **Cloud Provider Security:**
    *   Leverages firewall mitigation techniques and infrastructure security features provided by underlying cloud Infrastructure-as-a-Service (IaaS) providers (e.g., Amazon Web Services).

5.  **Network Protocol Defenses:**
    *   Comprehensive TCP SYN flooding attack mitigation techniques are employed to prevent exhaustion of server resources by incomplete connection requests.

6.  **Load Balancing:**
    *   Global load-balancing dynamic DNS providers often use techniques like 4-IP auto-failover to maintain service availability.

7.  **Operational Monitoring & Response:**
    *   Continuous operator monitoring of site function with detailed multi-level reporting helps in early detection of anomalies.
    *   Continuous deployment practices allow for interruption-free updates and server additions, enhancing resilience.

## Customer-Implemented Security Measures (Using PubNub Features)

While PubNub protects its core network, you should also implement security measures within your application:

1.  **PubNub Access Manager (PAM):**
    *   **Highly Recommended.** PAM is a critical tool for mitigating DoS risks at the application level.
    *   By authenticating users and granting specific, limited permissions (read/write) to auth-tokens for particular channels or users, you prevent unauthorized clients from consuming resources or flooding your channels.
    *   Even if an attacker tries to use your application's API endpoints, without a valid, server-granted auth-token with appropriate permissions, their attempts to publish or subscribe will be denied.

2.  **Secure Client Authentication:**
    *   Implement a strong authentication process on your backend server before granting any PubNub auth-tokens to clients.

3.  **Rate Limiting (Application Level):**
    *   Consider implementing rate limiting in your own application logic or backend. For example, limit how frequently a single user can send messages or perform certain actions.
    *   PubNub Functions can potentially be used to implement custom rate-limiting logic on publish events at the edge.

4.  **Message Validation and Sanitization:**
    *   Validate and sanitize all incoming messages and user inputs to prevent injection attacks or other abuse that could be part of a more complex attack. PubNub Functions can assist with this.

## PubNub's Outbound Connection Model

PubNub clients initiate outbound connections to the PubNub network. This means:
*   No inbound ports need to be opened on your firewall for PubNub to function, reducing the attack surface on your own network.

By combining PubNub's robust infrastructure defenses with diligent application-level security practices like implementing PubNub Access Manager, you can significantly reduce the risk and impact of DoS/DDoS attacks on your real-time application.

