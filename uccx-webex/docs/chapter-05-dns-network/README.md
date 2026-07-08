# Chapter 5: DNS & Network Architecture

## 5.1 DNS Architecture Overview

### 5.1.1 Regional DNS Requirements

```
+-----------------------------------------------------------------------------+
|              WEBEX CALLING DNS ARCHITECTURE                                  |
+-----------------------------------------------------------------------------+
|                                                                             |
|  DNS REQUIREMENTS BY REGION:                                               |
|  ===========================                                               |
|                                                                             |
|  REGION        | SIGNALING DOMAINS              | MEDIA DOMAINS            |
|  --------------+--------------------------------+--------------------------|
|  APAC (India)  | *.apj.webex.com               | *.wbx2.com               |
|                | *.wxc.edge.bcld.webex.com     | *.ciscospark.com         |
|  --------------+--------------------------------+--------------------------|
|  UK            | *.uk.webex.com                | *.wbx2.com               |
|                | *.wxc.edge.bcld.webex.com     | *.ciscospark.com         |
|  --------------+--------------------------------+--------------------------|
|  EU            | *.eu.webex.com                | *.wbx2.com               |
|                | *.wxc.edge.bcld.webex.com     | *.ciscospark.com         |
|  --------------+--------------------------------+--------------------------|
|  US            | *.us.webex.com                | *.wbx2.com               |
|                | *.wxc.edge.bcld.webex.com     | *.ciscospark.com         |
|  --------------+--------------------------------+--------------------------|
|                                                                             |
|  COMMON DOMAINS (All Regions):                                             |
|  ==============================                                            |
|  - *.webex.com                                                             |
|  - *.cisco.com                                                             |
|  - *.ciscospark.com                                                        |
|  - *.wbx2.com                                                              |
|  - *.webexcontent.com                                                      |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 5.1.2 Webex Service Discovery (SRV Records)

Webex Calling clients use DNS SRV records to discover the correct cloud signaling endpoint rather than relying solely on hardcoded FQDNs. The standard service discovery record takes the form `_sips._tcp.<region-domain>` (for example `_sips._tcp.apj.webex.com` for the APAC region) and resolves to the appropriate signaling SBC pool for that region with associated priority and weight values for failover. Endpoints and the Webex App perform this SRV lookup during registration and again on any cloud-side maintenance event, so DNS resolvers used by AbhavTech sites must permit standard SRV queries outbound (UDP/TCP 53, or DoH/DoT where the corporate DNS policy requires encrypted resolution) without filtering or rewriting the response.

### 5.1.3 Local Gateway DNS Configuration

Each Local Gateway must have a publicly resolvable FQDN -- not a bare IP address -- because the Webex Calling cloud SBC performs TLS mutual authentication against the LGW's certificate, and certificate validation requires matching the FQDN used in the SIP trunk configuration to the Common Name or Subject Alternative Name on the LGW's certificate. This means the public DNS A record for each circle's LGW (see the per-LGW DNS table below) must exist and resolve correctly before LGW registration is attempted in Control Hub, and any subsequent change to the LGW's public IP requires the DNS record to be updated first or the TLS handshake will fail even though the underlying network path is otherwise healthy.

---

## 5.2 India DNS Configuration

### 5.2.1 Per-LGW DNS Requirements

```
+-----------------------------------------------------------------------------+
|              INDIA LOCAL GATEWAY DNS CONFIGURATION                           |
+-----------------------------------------------------------------------------+
|                                                                             |
|  LGW FQDN REQUIREMENTS:                                                    |
|  ======================                                                    |
|  - Public DNS A record required for each LGW                               |
|  - FQDN must match certificate CN or SAN                                   |
|  - SRV records optional but recommended for HA                             |
|                                                                             |
|  ABHAVTECH LGW DNS RECORDS:                                                |
|  ==========================                                                |
|                                                                             |
|  A Records:                                                                |
|  ----------                                                                |
|  mumbai-lgw.abhavtech.com      -> 203.45.100.10                            |
|  mumbai-lgw2.abhavtech.com     -> 203.45.100.11  (HA pair)                 |
|  chennai-lgw.abhavtech.com     -> 203.46.75.10                             |
|  chennai-lgw2.abhavtech.com    -> 203.46.75.11   (HA pair)                 |
|  bangalore-lgw.abhavtech.com   -> 203.47.50.10                             |
|  delhi-lgw.abhavtech.com       -> 203.48.10.10                             |
|  noida-lgw.abhavtech.com       -> 203.49.20.10                             |
|  hyderabad-lgw.abhavtech.com   -> 203.50.30.10                             |
|                                                                             |
|  SRV Records (Optional - for HA):                                          |
|  ---------------------------------                                         |
|  _sips._tcp.mumbai-lgw.abhavtech.com  SRV 10 100 5061 mumbai-lgw.abhav... |
|  _sips._tcp.mumbai-lgw.abhavtech.com  SRV 20 100 5061 mumbai-lgw2.abhav...|
|                                                                             |
|  Certificate Requirements:                                                 |
|  =========================                                                 |
|  - Signed by trusted public CA (see Webex trusted CA list)                |
|  - CN or SAN must contain the FQDN                                        |
|  - Example: CN=mumbai-lgw.abhavtech.com                                   |
|  - Wildcard certificates: SAN=*.abhavtech.com also acceptable             |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 5.2.2 Certificate FQDN Matching

LGW certificates must be issued by a Certificate Authority already present in Cisco's trusted root store -- Cisco maintains and periodically updates this list, and AbhavTech's NOC confirms the CA (DigiCert or GlobalSign for the AbhavTech deployment) remains trusted before each renewal cycle rather than assuming prior approval still holds. Renewal is tracked against the same 30-day-before-expiry threshold described in Chapter 4's certificate requirements section, since an expired or CN-mismatched certificate causes the cloud SBC to reject the TLS handshake silently -- the LGW trunk simply shows offline in Control Hub with no more specific error, so AbhavTech's runbook includes checking certificate validity as the first troubleshooting step for any unexplained LGW outage.

### 5.2.3 Internal DNS for Zones

Zone and Trusted Network Edge enforcement (Chapter 4) depends on Webex correctly identifying which physical location a user is connecting from, which in turn depends on the user's device resolving internal AbhavTech resources through the correct circle-local DNS view where split-horizon DNS is in use. AbhavTech's internal DNS infrastructure is configured so that each office's local DNS forwarders resolve internal AbhavTech FQDNs (such as the LGW hostnames) consistently regardless of which circle the query originates from, while public Webex FQDNs resolve identically everywhere -- this avoids a class of subtle Zone-matching failures where a user's network path is correct but an internal DNS misconfiguration causes intermittent call setup issues unrelated to the Zone/Trusted Network Edge logic itself.

---

## 5.3 EMEA DNS Configuration

### 5.3.1 UK Region DNS

UK-provisioned users resolve Webex Calling signaling through `*.uk.webex.com` and media through the shared `*.wbx2.com`/`*.ciscospark.com` domains shown in the regional DNS table above, with the UK region's signaling SBCs resolving to the London primary and Manchester backup data centers described in Chapter 4's UK compliance section. No India-style Zone/Trusted Network Edge DNS considerations apply here since the UK has no toll-bypass routing restriction; standard outbound DNS resolution to the UK-region domains from each UK office is sufficient, with no split-horizon or circle-specific configuration required.

### 5.3.2 EU Region DNS

EU-provisioned users (Germany, per the AbhavTech EMEA footprint) resolve signaling through `*.eu.webex.com`, with the EU region's data centers in Frankfurt (primary) and Amsterdam (backup) as documented in Chapter 4's EMEA compliance section. As with the UK, EU DNS resolution is standard outbound resolution to the regional Webex domains with no Zone-based routing restriction; the only EU-specific consideration is ensuring corporate DNS or proxy filtering does not block the `.eu.webex.com` zone specifically, since some overly broad allowlists configured for `*.webex.com` miss the region-specific subdomain pattern.

---

## 5.4 Americas DNS Configuration

Americas-provisioned users (New Jersey and Dallas) resolve signaling through `*.us.webex.com` following the same standard pattern as UK and EU -- no toll-bypass or Zone-based DNS routing applies, since the Americas region has no equivalent of India's circle-based PSTN restrictions. Standard outbound DNS resolution to the US-region domains is sufficient for both Webex Calling and the WxCC agent desktop traffic originating from these two sites.

---

## 5.5 Firewall Requirements by Region

### 5.5.1 Common Webex Calling Ports

```
+-----------------------------------------------------------------------------+
|              WEBEX CALLING FIREWALL REQUIREMENTS                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  SIGNALING (OUTBOUND):                                                     |
|  =====================                                                     |
|  Protocol | Port  | Destination                | Purpose                  |
|  ---------+-------+----------------------------+--------------------------|
|  TCP/TLS  | 443   | *.webex.com, *.wbx2.com   | HTTPS signaling          |
|  TCP/TLS  | 5061  | *.webex.com               | SIP TLS signaling        |
|  TCP/TLS  | 8443  | *.webex.com               | Device activation        |
|  ---------+-------+----------------------------+--------------------------|
|                                                                             |
|  MEDIA (OUTBOUND):                                                         |
|  =================                                                         |
|  Protocol | Port        | Destination            | Purpose                |
|  ---------+-------------+------------------------+------------------------|
|  UDP      | 5004        | Webex media subnets    | SRTP media (preferred) |
|  UDP      | 9000        | Webex media subnets    | SRTP media             |
|  UDP      | 19560-65535 | Webex media subnets    | Additional media       |
|  TCP/TLS  | 443         | Webex media subnets    | Media fallback         |
|  ---------+-------------+------------------------+------------------------|
|                                                                             |
|  [!]️ NOTE: Do NOT filter by IP address - Webex IP pools are dynamic        |
|     Use domain-based filtering via proxy if required                       |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 5.5.2 India LGW-Specific Ports

```
+-----------------------------------------------------------------------------+
|              INDIA LOCAL GATEWAY FIREWALL REQUIREMENTS                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  LGW TO WEBEX (OUTBOUND):                                                  |
|  ========================                                                  |
|  Protocol | Port  | Source         | Destination                          |
|  ---------+-------+----------------+--------------------------------------|
|  TCP/TLS  | 5061  | LGW Public IP  | *.wxc.edge.bcld.webex.com           |
|  UDP      | 5004  | LGW Public IP  | Webex media subnets                  |
|  ---------+-------+----------------+--------------------------------------|
|                                                                             |
|  LGW TO PSTN (INTERNAL):                                                   |
|  ========================                                                  |
|  Protocol | Port       | Source        | Destination                      |
|  ---------+------------+---------------+----------------------------------|
|  UDP/TCP  | 5060/5061  | LGW Internal  | PSTN Provider SBC                |
|  UDP      | 16384-32767| LGW Internal  | PSTN Provider SBC (RTP)          |
|  ---------+------------+---------------+----------------------------------|
|                                                                             |
|  WEBEX TO LGW (INBOUND - for registration-based trunk):                   |
|  ======================================================                   |
|  Protocol | Port  | Source                    | Destination               |
|  ---------+-------+---------------------------+---------------------------|
|  TCP/TLS  | 5061  | *.wxc.edge.bcld.webex.com| LGW Public IP             |
|  ---------+-------+---------------------------+---------------------------|
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 5.5.3 CCPP Ports (EMEA/Americas)

Because CCPP is a fully cloud-managed PSTN connection with no on-premises Local Gateway hardware, the firewall requirements for CCPP-routed sites (UK, EU, and Americas, per AbhavTech's PSTN option decisions in Chapters 2 and 4) are limited to the standard Webex Calling signaling and media ports already covered in the common port table above -- there is no separate LGW-to-PSTN internal port range to open, no SIP trunk to a local carrier SBC, and no certificate-bearing on-premises device to maintain. This is one of the operational advantages of CCPP over Local Gateway for non-India sites: firewall and certificate lifecycle management is entirely Cisco/CCPP-partner-managed rather than an AbhavTech NOC responsibility.

---

## 5.6 QoS Configuration

### 5.6.1 DSCP Markings

```
+-----------------------------------------------------------------------------+
|              WEBEX CALLING QoS - DSCP CONFIGURATION                          |
+-----------------------------------------------------------------------------+
|                                                                             |
|  TRAFFIC TYPE          | DSCP VALUE | PHB CLASS | QUEUE PRIORITY           |
|  ----------------------+------------+-----------+--------------------------|
|  Voice Media (RTP)     | 46 (EF)    | EF        | Highest (Strict Priority)|
|  Video Media (RTP)     | 34 (AF41)  | AF41      | High                     |
|  Voice Signaling (SIP) | 24 (CS3)   | CS3       | Medium-High              |
|  Screen Share          | 18 (AF21)  | AF21      | Medium                   |
|  Default/Other         | 0 (BE)     | BE        | Best Effort              |
|  ----------------------+------------+-----------+--------------------------|
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 5.6.2 Bandwidth Requirements

Webex Calling primarily uses the Opus codec for Webex-to-Webex calls (consuming roughly 30-80 Kbps per direction depending on the negotiated bitrate) and G.711 (approximately 80-100 Kbps per direction including RTP/IP overhead) or G.722 for PSTN-bound calls through a Local Gateway. For capacity planning, AbhavTech budgets approximately 100 Kbps per concurrent voice call as a conservative per-call bandwidth allowance covering codec payload plus packet overhead, and sizes each site's WAN/internet circuit against its peak concurrent call count (derived from the agent headcount and expected concurrency ratio at that site) plus the existing data traffic baseline, rather than assuming codec-minimum bandwidth will hold under real-world network conditions.

### 5.6.3 QoS Policy Templates

On Cisco IOS-XE WAN edges (consistent with the SD-WAN documentation), DSCP marking and queuing is configured via MQC class-maps matching the DSCP values in the table above, with a priority-queue class for EF-marked voice media and a separate bandwidth-guaranteed class for CS3 signaling. On Meraki MX/MS platforms, the equivalent configuration is applied through Meraki Dashboard's Traffic Shaping rules, matching traffic by the same DSCP markings (Webex Calling and WxCC client traffic is pre-marked by the endpoint/softphone, so the network's role is to honor and propagate the marking end-to-end rather than re-classify by port/IP). For other platforms, the general principle AbhavTech applies is the same regardless of vendor: trust DSCP markings from Webex-aware endpoints, queue EF voice media with strict priority, and avoid re-marking or stripping DSCP values at any hop between the endpoint and the WAN edge.

---

## 5.7 Network Connectivity Options

### 5.7.1 Internet (Standard)

Standard internet-based connectivity to Webex Calling and WxCC requires a stable outbound internet path with sufficient bandwidth per the calculations above, and AbhavTech requires dual ISP circuits with automatic failover at every site with more than 10 concurrent agents, consistent with the resilience standard applied to the SD-WAN deployment. Internet-based connectivity is the default and sufficient option for the large majority of AbhavTech sites; dedicated connectivity (below) is reserved for the specific India regulatory case and is not required elsewhere.

### 5.7.2 MPLS/Dedicated (India Regulated)

For India sites where regulatory or reliability requirements call for it, AbhavTech can provision MPLS or dedicated internet access through approved India carriers (Tata Communications, Airtel, or Reliance Jio for enterprise circuits) rather than relying solely on standard broadband internet. This is a business resilience choice rather than a DoT/TRAI compliance requirement -- unlike the Zone/Trusted Network Edge toll-bypass rules in Chapter 4, dedicated connectivity does not change India's regulatory posture, it simply provides a more predictable, lower-jitter path for voice media at sites where standard internet quality has proven insufficient for consistent call quality.

### 5.7.3 Webex Edge Connect

Webex Edge Connect provides a private, dedicated network path from an AbhavTech site directly into the Webex cloud, bypassing the public internet for Webex Calling and Meetings media and signaling traffic. The benefit is more predictable latency and jitter and a contractual SLA on the connection itself, which AbhavTech would consider for its highest-concurrency sites (Mumbai HQ and Chennai DR) if standard dual-ISP internet connectivity proves insufficient during peak contact center load; for the current deployment scale, standard internet connectivity with QoS as described above is sufficient and Edge Connect is not provisioned, but the option remains available without requiring a redesign of the DNS or firewall architecture in this chapter.

---

