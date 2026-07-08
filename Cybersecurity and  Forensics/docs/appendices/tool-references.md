# Tool References

**Cybersecurity & Forensics Tools Guide**

---

## Forensics Tools

### Packet Analysis

**Wireshark**
- **Purpose:** Network protocol analyzer and packet capture
- **Use Case:** Deep packet inspection, protocol analysis, traffic troubleshooting
- **Platform:** Windows, macOS, Linux
- **Website:** [wireshark.org](https://www.wireshark.org)

**tcpdump**
- **Purpose:** Command-line packet analyzer
- **Use Case:** Live packet capture, filtering, basic analysis
- **Platform:** Unix/Linux (included by default)
- **Common Commands:**
  ```bash
  tcpdump -i eth0 -w capture.pcap
  tcpdump -r capture.pcap 'port 443'
  ```

### Network Forensics

**NetworkMiner**
- **Purpose:** Network forensic analysis tool for PCAP files
- **Use Case:** Extract artifacts (files, credentials, hostnames) from network traffic
- **Platform:** Windows, Linux (Mono)
- **Website:** [netresec.com](https://www.netresec.com)

**Zeek (formerly Bro)**
- **Purpose:** Network analysis framework and IDS
- **Use Case:** Protocol logging, file extraction, traffic analysis
- **Platform:** Unix/Linux
- **Website:** [zeek.org](https://www.zeek.org)

### Endpoint Forensics

**Volatility**
- **Purpose:** Memory forensics framework
- **Use Case:** Analyze RAM dumps for malware, rootkits, process artifacts
- **Platform:** Windows, macOS, Linux
- **Website:** [volatilityfoundation.org](https://www.volatilityfoundation.org)

**The Sleuth Kit + Autopsy**
- **Purpose:** Disk forensics and file recovery
- **Use Case:** File system analysis, deleted file recovery, timeline creation
- **Platform:** Windows, macOS, Linux
- **Website:** [sleuthkit.org](https://www.sleuthkit.org)

---

## Penetration Testing Tools

### Reconnaissance

**Nmap**
- **Purpose:** Network scanner and host discovery
- **Use Case:** Port scanning, service enumeration, OS detection
- **Common Commands:**
  ```bash
  nmap -sV -sC -p- 192.168.1.0/24
  nmap --script vuln target.com
  ```

**Shodan**
- **Purpose:** Internet-connected device search engine
- **Use Case:** OSINT, exposed services, vulnerability research
- **Website:** [shodan.io](https://www.shodan.io)

### Vulnerability Assessment

**Nessus**
- **Purpose:** Vulnerability scanner
- **Use Case:** Automated vulnerability discovery and assessment
- **Platform:** Windows, Linux, macOS
- **Vendor:** Tenable

**OpenVAS**
- **Purpose:** Open-source vulnerability scanner
- **Use Case:** Comprehensive vulnerability testing
- **Platform:** Linux
- **Website:** [openvas.org](https://www.openvas.org)

### Exploitation Frameworks

**Metasploit**
- **Purpose:** Penetration testing framework
- **Use Case:** Exploit development, validation, post-exploitation
- **Platform:** Windows, Linux, macOS
- **Website:** [metasploit.com](https://www.metasploit.com)

**Burp Suite**
- **Purpose:** Web application security testing platform
- **Use Case:** Web app pen testing, proxy, scanner, intruder
- **Platform:** Windows, macOS, Linux
- **Website:** [portswigger.net](https://portswigger.net)

### Wireless Testing

**Aircrack-ng**
- **Purpose:** Wireless network security testing suite
- **Use Case:** Wi-Fi password cracking, packet injection, monitoring
- **Platform:** Linux, Windows, macOS
- **Website:** [aircrack-ng.org](https://www.aircrack-ng.org)

**Kismet**
- **Purpose:** Wireless network detector and IDS
- **Use Case:** Wireless network discovery, monitoring, packet capture
- **Platform:** Linux, macOS
- **Website:** [kismetwireless.net](https://www.kismetwireless.net)

---

## SIEM & Log Analysis

**Splunk**
- **Purpose:** Security Information and Event Management platform
- **Use Case:** Log aggregation, correlation, alerting, dashboards
- **Platform:** Windows, Linux
- **Website:** [splunk.com](https://www.splunk.com)

**ELK Stack (Elasticsearch, Logstash, Kibana)**
- **Purpose:** Open-source log management and analysis
- **Use Case:** Centralized logging, search, visualization
- **Platform:** Linux, Docker
- **Website:** [elastic.co](https://www.elastic.co)

---

## Cisco-Specific Tools

### Network Management

**DNA Center (DNAC)**
- **Purpose:** Network automation and assurance platform
- **Use Case:** SD-Access management, network health, AI insights
- **Platform:** Appliance / VM
- **Vendor:** Cisco Systems

**vManage**
- **Purpose:** SD-WAN management and orchestration
- **Use Case:** SD-WAN policy, monitoring, analytics
- **Platform:** Appliance / Cloud
- **Vendor:** Cisco Systems

### Security Platforms

**ISE (Identity Services Engine)**
- **Purpose:** Network access control and policy enforcement
- **Use Case:** 802.1X, TrustSec, device profiling, pxGrid
- **Platform:** Appliance / VM
- **Vendor:** Cisco Systems

**FMC (Firepower Management Center)**
- **Purpose:** Firewall and IPS management
- **Use Case:** FTD policy management, threat intelligence, events
- **Platform:** Appliance / VM
- **Vendor:** Cisco Systems

**SecureX (XDR)**
- **Purpose:** Extended Detection and Response platform
- **Use Case:** Cross-platform correlation, threat hunting, automation
- **Platform:** Cloud-based
- **Vendor:** Cisco Systems

---

## Threat Intelligence

**Talos Intelligence**
- **Purpose:** Cisco threat research and intelligence
- **Use Case:** IOCs, vulnerability research, threat trends
- **Website:** [talosintelligence.com](https://talosintelligence.com)

**MISP (Malware Information Sharing Platform)**
- **Purpose:** Threat intelligence sharing platform
- **Use Case:** IOC sharing, correlation, collaborative analysis
- **Platform:** Linux
- **Website:** [misp-project.org](https://www.misp-project.org)

**VirusTotal**
- **Purpose:** File and URL malware analysis
- **Use Case:** Hash/file reputation, malware detection
- **Website:** [virustotal.com](https://www.virustotal.com)

---

## Scripting & Automation

**Python**
- **Libraries for Security:**
  - `scapy` — Packet manipulation
  - `requests` — HTTP/API interactions
  - `beautifulsoup4` — Web scraping
  - `pycryptodome` — Cryptography
  - `paramiko` — SSH automation

**PowerShell**
- **Use Case:** Windows automation, Active Directory queries, event log analysis
- **Security Modules:** PowerSploit, Empire, Nishang

**Bash**
- **Use Case:** Unix/Linux automation, log parsing, system administration
- **Common Tools:** awk, sed, grep, jq

---

## Malware Analysis

**Cuckoo Sandbox**
- **Purpose:** Automated malware analysis system
- **Use Case:** Behavioral analysis, network traffic capture
- **Platform:** Linux
- **Website:** [cuckoosandbox.org](https://cuckoosandbox.org)

**IDA Pro / Ghidra**
- **Purpose:** Reverse engineering and disassembly
- **Use Case:** Binary analysis, malware reverse engineering
- **Platform:** Windows, macOS, Linux
- **Ghidra:** [ghidra-sre.org](https://ghidra-sre.org) (free, NSA)

---

## Reporting & Documentation

**Dradis**
- **Purpose:** Collaboration and reporting for security teams
- **Use Case:** Penetration test report generation
- **Platform:** Linux, Docker
- **Website:** [dradisframework.com](https://dradisframework.com)

**Obsidian / Notion**
- **Purpose:** Note-taking and knowledge management
- **Use Case:** Research notes, investigation timelines, collaboration

---

## Kali Linux Toolkit

**Kali Linux** includes 600+ pre-installed security tools including:
- Reconnaissance: nmap, masscan, dnsenum, sublist3r
- Vulnerability Analysis: OpenVAS, nikto, sqlmap
- Wireless Attacks: aircrack-ng, reaver, wifite
- Web Applications: burp suite, zaproxy, wpscan
- Exploitation: metasploit, searchsploit, armitage
- Password Attacks: john, hashcat, hydra, medusa
- Forensics: autopsy, binwalk, bulk-extractor
- Social Engineering: SET (Social-Engineer Toolkit)

**Website:** [kali.org](https://www.kali.org)

---

## Best Practices

### Tool Selection
- Use official repositories and verified sources
- Keep tools updated to latest versions
- Verify file hashes before installation
- Review tool documentation and capabilities

### Legal Compliance
- Only use tools on authorized systems
- Obtain written permission before testing
- Follow organizational security policies
- Document all tool usage for audit trails

### Operational Security
- Use isolated testing environments
- Sanitize sensitive data from reports
- Secure tool configurations and credentials
- Practice proper evidence handling

---

<small>**Last Updated:** March 2026 | **Tool Count:** 40+ platforms and utilities</small>
