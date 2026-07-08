# Analysis Tools

**Sub-Section:** Foundation Forensics  
**Source:** Network Forensics Foundation Procedures

---

## Forensics Workstation Setup

### Hardware Requirements

**Recommended Specifications:**
- CPU: 8+ cores (Intel i7/i9 or AMD Ryzen)
- RAM: 32GB minimum (64GB recommended)
- Storage: 2TB+ SSD for OS/tools + 4TB+ HDD for evidence
- Network: Dual NICs (management + isolated analysis network)
- GPU: Optional (for password cracking acceleration)

**Write-Blocking:**
- Hardware write-blocker (Tableau, WiebeTech)
- Multiple interface support (SATA, USB, NVMe)

### Software Tools

**Operating System:**
- SIFT Workstation (SANS Investigative Forensics Toolkit)
- Kali Linux (includes forensics tools)
- Forensic-ready Ubuntu/Debian

**Essential Tool Categories:**

## 1. Network Traffic Analysis

**Wireshark**
```bash
# Basic capture
wireshark -i eth0

# Command-line capture with tshark
tshark -i eth0 -w capture.pcap

# Filter and export
tshark -r capture.pcap -Y "http.request" -T fields -e http.host
```

**NetworkMiner**
- Automated artifact extraction (files, credentials, hosts)
- Session reconstruction
- Geolocation mapping

**Zeek (Bro)**
```bash
# Analyze PCAP offline
zeek -r capture.pcap

# Generate connection logs, DNS logs, HTTP logs
ls *.log
```

## 2. Log Analysis

**Splunk**
```spl
# Search specific timeframe
index=firewall earliest=-24h latest=now

# Extract top talkers
index=network | stats count by src_ip | sort -count | head 10

# Correlation search
index=firewall OR index=ids | transaction src_ip maxspan=5m
```

**ELK Stack (Elasticsearch, Logstash, Kibana)**
- Log aggregation and indexing
- Custom dashboards
- Alerting and visualization

**grep/awk/sed**
```bash
# Extract failed login attempts
grep "Failed password" /var/log/auth.log

# Count unique IPs
awk '{print $1}' access.log | sort -u | wc -l

# Parse specific fields
sed -n 's/.*SRC=\([0-9.]*\).*/\1/p' firewall.log
```

## 3. Memory Forensics

**Volatility**
```bash
# Identify memory profile
volatility -f memory.raw imageinfo

# List running processes
volatility -f memory.raw --profile=Win10x64 pslist

# Extract network connections
volatility -f memory.raw --profile=Win10x64 netscan

# Dump process memory
volatility -f memory.raw --profile=Win10x64 procdump -p 1234 -D output/
```

## 4. Disk Forensics

**The Sleuth Kit + Autopsy**
```bash
# File system analysis
fls -r disk_image.dd

# Timeline creation
fls -m C: -r disk_image.dd > timeline.body
mactime -b timeline.body > timeline.csv

# Recover deleted files
tsk_recover disk_image.dd recovered_files/
```

**FTK Imager**
- Forensic imaging
- File system browsing
- Evidence item export

## 5. Malware Analysis

**Sandbox Analysis:**
- Cuckoo Sandbox (automated behavioral analysis)
- Any.run (cloud-based sandbox)
- Joe Sandbox

**Static Analysis:**
```bash
# File hashing
md5sum malware.exe
sha256sum malware.exe

# File type identification
file malware.exe

# Strings extraction
strings malware.exe | grep -i "http"

# PE analysis (Windows executables)
peframe malware.exe
```

**Dynamic Analysis:**
```bash
# Monitor system calls (Linux)
strace -f -o trace.log ./suspicious_binary

# Monitor network activity
sudo tcpdump -i any -w malware_traffic.pcap &
./malware.exe
```

## 6. Password Cracking

**John the Ripper**
```bash
# Crack password hashes
john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt

# Show cracked passwords
john --show hashes.txt
```

**Hashcat**
```bash
# GPU-accelerated cracking
hashcat -m 1000 -a 0 hashes.txt wordlist.txt

# Brute force attack
hashcat -m 1000 -a 3 hashes.txt ?a?a?a?a?a?a
```

## 7. Timeline Analysis

**log2timeline (Plaso)**
```bash
# Create super timeline
log2timeline.py timeline.plaso disk_image.dd

# Export to CSV
psort.py -o l2tcsv -w timeline.csv timeline.plaso
```

## 8. Reporting Tools

**Dradis Framework**
- Collaboration platform
- Evidence management
- Report generation

**OSINT Framework**
- Threat intelligence gathering
- Domain/IP reconnaissance
- Social media analysis

## Platform-Specific Tools

### Cisco Investigation Tools

**DNA Center Assurance API:**
```python
import requests

# Export client health data
response = requests.get(
    f"{dnac}/dna/intent/api/v1/client-health",
    headers={"X-Auth-Token": token}
)
```

**ISE Live Log Export:**
```bash
# Export RADIUS logs via CLI
show logging application ise-psc.log tail
```

**SD-WAN vManage API:**
```python
# Export DPI statistics
response = requests.get(
    f"{vmanage}/dataservice/statistics/dpi/aggregation",
    headers={"Cookie": session_cookie}
)
```

## Automation Scripts

### Batch PCAP Analysis
```python
#!/usr/bin/env python3
import pyshark

# Analyze PCAP for suspicious patterns
cap = pyshark.FileCapture('capture.pcap')

for pkt in cap:
    if hasattr(pkt, 'http'):
        if 'POST' in str(pkt.http.request_method):
            print(f"Suspicious POST: {pkt.ip.src} -> {pkt.ip.dst}")
```

### Log Correlation
```bash
#!/bin/bash
# Correlate firewall and ISE logs

# Extract suspicious IPs from firewall
grep "DENY" firewall.log | awk '{print $5}' > suspicious_ips.txt

# Search ISE logs for same IPs
while read ip; do
    grep "$ip" ise_radius.log
done < suspicious_ips.txt
```

## Tool Validation

**Best Practices:**
- Use court-tested, industry-standard tools
- Verify tool integrity (hash validation)
- Document tool versions used
- Maintain tool licensing and certifications
- Regular updates and patches

**Tool Certification:**
- NIST Computer Forensics Tool Testing (CFTT)
- Court acceptance history
- Peer-reviewed methodologies

---

[← Back to Foundation Overview](README.md){ .md-button }
