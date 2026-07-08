# Chain of Custody

## 2.1 Blockchain Ledger Architecture

Abhavtech implements a **private blockchain ledger** specifically designed for digital evidence chain of custody. This blockchain provides tamper-proof, auditable records of all evidence handling from collection through legal proceedings.

### 2.1.1 Why Blockchain for Digital Evidence?

**Traditional Chain of Custody Challenges:**

| Challenge | Traditional Method | Blockchain Solution |
|-----------|-------------------|---------------------|
| **Evidence Tampering** | Paper logs, spreadsheets (easily modified) | Immutable ledger with cryptographic verification |
| **Timestamp Verification** | System clocks (can be manipulated) | Distributed consensus with NTP validation |
| **Custodian Tracking** | Manual signatures, access logs | Automated digital signatures with public key infrastructure |
| **Access Auditing** | Limited logging, often incomplete | Complete audit trail with every read/write operation logged |
| **Long-Term Integrity** | Re-hashing periodically, manual verification | Continuous verification via blockchain consensus |
| **Court Admissibility** | Dependent on witness testimony | Self-validating cryptographic proof |

**Blockchain Benefits for Legal Proceedings:**

1. **Immutability:** Once evidence is recorded on the blockchain, it cannot be altered without detection
2. **Transparency:** Complete audit trail visible to authorized parties (legal, auditors, court)
3. **Timestamp Proof:** Distributed nodes provide consensus on exact time of evidence collection
4. **Non-Repudiation:** Digital signatures prevent custodians from denying actions
5. **Automation:** Reduces human error in chain of custody documentation

### 2.1.2 Blockchain Platform Selection

**Technology Stack:**

| Component | Technology | Justification |
|-----------|-----------|---------------|
| **Blockchain Framework** | Hyperledger Fabric 2.5 | Enterprise-grade, permissioned blockchain; proven in legal/compliance use cases |
| **Consensus Algorithm** | RAFT | Crash fault tolerant; suitable for private networks; faster than Byzantine algorithms |
| **Smart Contracts** | Chaincode (Go language) | Define evidence lifecycle rules, automated custody transfers |
| **Hash Algorithm** | SHA-256 | NIST-approved, court-accepted standard for digital evidence |
| **Timestamp Authority** | RFC 3161-compliant TSA | Legally recognized timestamp service |
| **Node Deployment** | 5 nodes (3 DCs + 2 cloud) | Distributed consensus, DR capability |

**Blockchain Network Architecture:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│          ABHAVTECH BLOCKCHAIN EVIDENCE NETWORK TOPOLOGY                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PEER NODES (Endorsing + Committing)                                   │
│  ────────────────────────────────────                                   │
│                                                                         │
│  ┌───────────────────┐     ┌───────────────────┐     ┌──────────────┐ │
│  │   NJ-DC-PEER01    │     │   LON-DC-PEER01   │     │ MUM-DC-PEER01│ │
│  │ ───────────────── │     │ ───────────────── │     │ ────────────│  │
│  │ • Primary orderer │     │ • Secondary node  │     │ • Tertiary   │  │
│  │ • Ledger storage  │     │ • Ledger replica  │     │ • Ledger     │  │
│  │ • Chaincode exec  │     │ • DR capability   │     │ • APAC node  │  │
│  │ • Certificate CA  │     │ • Certificate CA  │     │ • Cert CA    │  │
│  └─────────┬─────────┘     └─────────┬─────────┘     └──────┬───────┘ │
│            │                         │                      │         │
│            └─────────────┬───────────┴──────────────────────┘         │
│                          │ Gossip Protocol (State Sync)               │
│                          │                                            │
│  CLOUD WITNESS NODES (Validation Only)                                │
│  ──────────────────────────────────────                                │
│                          │                                            │
│            ┌─────────────┴───────────┐                                │
│            │                         │                                │
│  ┌─────────▼─────────┐     ┌─────────▼─────────┐                     │
│  │   AWS-WITNESS01   │     │   AZURE-WITNESS01 │                     │
│  │ ───────────────── │     │ ───────────────── │                     │
│  │ • Read-only       │     │ • Read-only       │                     │
│  │ • No chaincode    │     │ • No chaincode    │                     │
│  │ • Ledger copy     │     │ • Ledger copy     │                     │
│  │ • External audit  │     │ • External audit  │                     │
│  └───────────────────┘     └───────────────────┘                     │
│                                                                         │
│  CLIENT APPLICATIONS                                                   │
│  ────────────────────                                                   │
│                                                                         │
│  ┌──────────────────┐     ┌──────────────────┐     ┌────────────────┐│
│  │ Forensics        │     │ Legal Portal     │     │ Audit Console  ││
│  │ Workstation      │────▶│ (Read-Only)      │────▶│ (Read-Only)    ││
│  │ (Write Access)   │     │ (Hash Verify)    │     │ (Chain Verify) ││
│  └──────────────────┘     └──────────────────┘     └────────────────┘│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Node Specifications:**

| Node | Location | Role | CPU | RAM | Storage | OS |
|------|----------|------|-----|-----|---------|-----|
| NJ-DC-PEER01 | New Jersey DC | Primary Peer + Orderer | 8 vCPU | 32 GB | 2 TB SSD | Ubuntu 22.04 LTS |
| LON-DC-PEER01 | London DC | Secondary Peer | 8 vCPU | 32 GB | 2 TB SSD | Ubuntu 22.04 LTS |
| MUM-DC-PEER01 | Mumbai DC | Tertiary Peer | 8 vCPU | 32 GB | 2 TB SSD | Ubuntu 22.04 LTS |
| AWS-WITNESS01 | AWS us-east-1 | Witness Node (Cloud) | 4 vCPU | 16 GB | 1 TB SSD | Ubuntu 22.04 LTS |
| AZURE-WITNESS01 | Azure East US | Witness Node (Cloud) | 4 vCPU | 16 GB | 1 TB SSD | Ubuntu 22.04 LTS |

### 2.1.3 Evidence Blockchain Schema

**Block Structure:**

```json
{
  "block_number": 12345,
  "timestamp": "2026-01-18T14:45:22.123Z",
  "previous_block_hash": "a1b2c3d4e5f6...",
  "merkle_root": "f6e5d4c3b2a1...",
  "transactions": [
    {
      "tx_id": "EVIDENCE-2026-001-00012",
      "tx_type": "evidence_collection",
      "timestamp": "2026-01-18T14:45:22.000Z",
      "payload": {
        "evidence_id": "EVD-20260118-001",
        "case_id": "CASE-2026-001",
        "investigation_type": "malware_c2",
        "evidence_type": "pcap",
        "file_name": "mumbai-border-span-20260118-1445.pcap",
        "file_size_bytes": 2847392847,
        "sha256_hash": "8f7e6d5c4b3a2918f7e6d5c4b3a2918f7e6d5c4b3a2918f7e6d5c4b3a2918f7e",
        "collector": "forensics-ws01.abhavtech.com",
        "custodian": "SOC-Analyst-Rajesh-Kumar",
        "custodian_pubkey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...",
        "collection_location": "Mumbai-DC-Forensics-Lab",
        "source_platform": "Catalyst-C9500-Border-01",
        "source_ip": "10.252.1.1",
        "legal_hold": false,
        "retention_days": 365,
        "access_list": ["SOC-Team", "Legal-Team", "Audit-Team"]
      },
      "digital_signature": "MEUCIQDx1...",
      "signature_algorithm": "ECDSA-SHA256"
    }
  ],
  "block_hash": "9a8b7c6d5e4f...",
  "validator_signatures": [
    {"node": "NJ-DC-PEER01", "signature": "MEYCIQCx..."},
    {"node": "LON-DC-PEER01", "signature": "MEUCIQD1..."},
    {"node": "MUM-DC-PEER01", "signature": "MEQCIBx..."}
  ]
}
```

**Transaction Types:**

| Transaction Type | Description | Trigger | Required Fields |
|-----------------|-------------|---------|-----------------|
| `evidence_collection` | Initial evidence capture | Evidence collected from network/platform | evidence_id, file_name, sha256_hash, custodian |
| `evidence_transfer` | Custody change | Evidence transferred between custodians | evidence_id, from_custodian, to_custodian, transfer_reason |
| `evidence_access` | Read access logged | User views/downloads evidence | evidence_id, accessor, access_type (view/download) |
| `evidence_analysis` | Analysis performed | Forensics tool processes evidence | evidence_id, tool_name, analysis_type, findings_hash |
| `evidence_modification` | Evidence altered (with justification) | Rare - requires approval | evidence_id, modification_type, justification, approver |
| `legal_hold_enable` | Legal hold activated | Court order, subpoena, litigation | evidence_id, hold_reason, court_case_number, expiration_date |
| `legal_hold_release` | Legal hold removed | Case closed, settlement | evidence_id, release_reason, approver |
| `evidence_destruction` | Evidence deleted (post-retention) | Retention period expired | evidence_id, destruction_method, approver |

### 2.1.4 Chaincode (Smart Contract) Logic

**Evidence Lifecycle Chaincode:**

```go
package main

import (
    "crypto/sha256"
    "encoding/json"
    "fmt"
    "time"
    
    "github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// EvidenceContract defines smart contract for evidence lifecycle
type EvidenceContract struct {
    contractapi.Contract
}

// Evidence represents digital evidence structure
type Evidence struct {
    EvidenceID       string    `json:"evidence_id"`
    CaseID           string    `json:"case_id"`
    EvidenceType     string    `json:"evidence_type"`
    FileName         string    `json:"file_name"`
    FileSizeBytes    int64     `json:"file_size_bytes"`
    SHA256Hash       string    `json:"sha256_hash"`
    Collector        string    `json:"collector"`
    Custodian        string    `json:"custodian"`
    CollectionTime   time.Time `json:"collection_time"`
    SourcePlatform   string    `json:"source_platform"`
    LegalHold        bool      `json:"legal_hold"`
    RetentionDays    int       `json:"retention_days"`
    AccessList       []string  `json:"access_list"`
    TransferHistory  []Transfer `json:"transfer_history"`
    AccessLog        []Access  `json:"access_log"`
}

// Transfer represents custody transfer
type Transfer struct {
    Timestamp     time.Time `json:"timestamp"`
    FromCustodian string    `json:"from_custodian"`
    ToCustodian   string    `json:"to_custodian"`
    Reason        string    `json:"reason"`
    Approver      string    `json:"approver"`
}

// Access represents evidence access event
type Access struct {
    Timestamp   time.Time `json:"timestamp"`
    Accessor    string    `json:"accessor"`
    AccessType  string    `json:"access_type"` // view, download, analyze
    Purpose     string    `json:"purpose"`
}

// CollectEvidence - Initial evidence collection transaction
func (ec *EvidenceContract) CollectEvidence(ctx contractapi.TransactionContextInterface,
    evidenceID string, caseID string, evidenceType string, fileName string,
    fileSizeBytes int64, sha256Hash string, collector string, custodian string,
    sourcePlatform string, retentionDays int, accessListJSON string) error {
    
    // Verify evidence doesn't already exist
    existing, err := ctx.GetStub().GetState(evidenceID)
    if err != nil {
        return fmt.Errorf("failed to read from world state: %v", err)
    }
    if existing != nil {
        return fmt.Errorf("evidence %s already exists", evidenceID)
    }
    
    // Verify SHA-256 hash format (64 hex characters)
    if len(sha256Hash) != 64 {
        return fmt.Errorf("invalid SHA-256 hash length")
    }
    
    // Parse access list
    var accessList []string
    err = json.Unmarshal([]byte(accessListJSON), &accessList)
    if err != nil {
        return fmt.Errorf("invalid access list JSON: %v", err)
    }
    
    // Create evidence record
    evidence := Evidence{
        EvidenceID:      evidenceID,
        CaseID:          caseID,
        EvidenceType:    evidenceType,
        FileName:        fileName,
        FileSizeBytes:   fileSizeBytes,
        SHA256Hash:      sha256Hash,
        Collector:       collector,
        Custodian:       custodian,
        CollectionTime:  time.Now(),
        SourcePlatform:  sourcePlatform,
        LegalHold:       false,
        RetentionDays:   retentionDays,
        AccessList:      accessList,
        TransferHistory: []Transfer{},
        AccessLog:       []Access{},
    }
    
    // Write to ledger
    evidenceJSON, err := json.Marshal(evidence)
    if err != nil {
        return err
    }
    
    return ctx.GetStub().PutState(evidenceID, evidenceJSON)
}

// TransferCustody - Transfer evidence to new custodian
func (ec *EvidenceContract) TransferCustody(ctx contractapi.TransactionContextInterface,
    evidenceID string, newCustodian string, reason string, approver string) error {
    
    // Retrieve evidence
    evidenceJSON, err := ctx.GetStub().GetState(evidenceID)
    if err != nil {
        return fmt.Errorf("failed to read evidence: %v", err)
    }
    if evidenceJSON == nil {
        return fmt.Errorf("evidence %s does not exist", evidenceID)
    }
    
    var evidence Evidence
    err = json.Unmarshal(evidenceJSON, &evidence)
    if err != nil {
        return err
    }
    
    // Create transfer record
    transfer := Transfer{
        Timestamp:     time.Now(),
        FromCustodian: evidence.Custodian,
        ToCustodian:   newCustodian,
        Reason:        reason,
        Approver:      approver,
    }
    
    // Update evidence
    evidence.TransferHistory = append(evidence.TransferHistory, transfer)
    evidence.Custodian = newCustodian
    
    // Write back to ledger
    updatedJSON, err := json.Marshal(evidence)
    if err != nil {
        return err
    }
    
    return ctx.GetStub().PutState(evidenceID, updatedJSON)
}

// LogAccess - Log evidence access (read, download, analyze)
func (ec *EvidenceContract) LogAccess(ctx contractapi.TransactionContextInterface,
    evidenceID string, accessor string, accessType string, purpose string) error {
    
    // Retrieve evidence
    evidenceJSON, err := ctx.GetStub().GetState(evidenceID)
    if err != nil {
        return fmt.Errorf("failed to read evidence: %v", err)
    }
    if evidenceJSON == nil {
        return fmt.Errorf("evidence %s does not exist", evidenceID)
    }
    
    var evidence Evidence
    err = json.Unmarshal(evidenceJSON, &evidence)
    if err != nil {
        return err
    }
    
    // Verify accessor is in access list
    authorized := false
    for _, allowedUser := range evidence.AccessList {
        if accessor == allowedUser {
            authorized = true
            break
        }
    }
    if !authorized {
        return fmt.Errorf("accessor %s not authorized for evidence %s", accessor, evidenceID)
    }
    
    // Create access record
    access := Access{
        Timestamp:  time.Now(),
        Accessor:   accessor,
        AccessType: accessType,
        Purpose:    purpose,
    }
    
    // Update evidence
    evidence.AccessLog = append(evidence.AccessLog, access)
    
    // Write back to ledger
    updatedJSON, err := json.Marshal(evidence)
    if err != nil {
        return err
    }
    
    return ctx.GetStub().PutState(evidenceID, updatedJSON)
}

// EnableLegalHold - Activate legal hold on evidence
func (ec *EvidenceContract) EnableLegalHold(ctx contractapi.TransactionContextInterface,
    evidenceID string, courtCaseNumber string, approver string) error {
    
    // Retrieve evidence
    evidenceJSON, err := ctx.GetStub().GetState(evidenceID)
    if err != nil {
        return fmt.Errorf("failed to read evidence: %v", err)
    }
    if evidenceJSON == nil {
        return fmt.Errorf("evidence %s does not exist", evidenceID)
    }
    
    var evidence Evidence
    err = json.Unmarshal(evidenceJSON, &evidence)
    if err != nil {
        return err
    }
    
    // Enable legal hold
    evidence.LegalHold = true
    evidence.RetentionDays = -1 // Indefinite retention
    
    // Log action
    access := Access{
        Timestamp:  time.Now(),
        Accessor:   approver,
        AccessType: "legal_hold_enable",
        Purpose:    fmt.Sprintf("Court Case: %s", courtCaseNumber),
    }
    evidence.AccessLog = append(evidence.AccessLog, access)
    
    // Write back to ledger
    updatedJSON, err := json.Marshal(evidence)
    if err != nil {
        return err
    }
    
    return ctx.GetStub().PutState(evidenceID, updatedJSON)
}

// VerifyIntegrity - Verify evidence hash matches blockchain record
func (ec *EvidenceContract) VerifyIntegrity(ctx contractapi.TransactionContextInterface,
    evidenceID string, providedHash string) (bool, error) {
    
    // Retrieve evidence
    evidenceJSON, err := ctx.GetStub().GetState(evidenceID)
    if err != nil {
        return false, fmt.Errorf("failed to read evidence: %v", err)
    }
    if evidenceJSON == nil {
        return false, fmt.Errorf("evidence %s does not exist", evidenceID)
    }
    
    var evidence Evidence
    err = json.Unmarshal(evidenceJSON, &evidence)
    if err != nil {
        return false, err
    }
    
    // Compare hashes
    return evidence.SHA256Hash == providedHash, nil
}

// QueryEvidence - Retrieve complete evidence record
func (ec *EvidenceContract) QueryEvidence(ctx contractapi.TransactionContextInterface,
    evidenceID string) (*Evidence, error) {
    
    evidenceJSON, err := ctx.GetStub().GetState(evidenceID)
    if err != nil {
        return nil, fmt.Errorf("failed to read evidence: %v", err)
    }
    if evidenceJSON == nil {
        return nil, fmt.Errorf("evidence %s does not exist", evidenceID)
    }
    
    var evidence Evidence
    err = json.Unmarshal(evidenceJSON, &evidence)
    if err != nil {
        return nil, err
    }
    
    return &evidence, nil
}

func main() {
    chaincode, err := contractapi.NewChaincode(new(EvidenceContract))
    if err != nil {
        fmt.Printf("Error creating evidence chaincode: %s", err.Error())
        return
    }
    
    if err := chaincode.Start(); err != nil {
        fmt.Printf("Error starting evidence chaincode: %s", err.Error())
    }
}
```

### 2.1.5 Evidence Collection with Blockchain Integration

**Automated Evidence Collection Script:**

```python
#!/usr/bin/env python3
"""
Forensics Evidence Collection with Blockchain Integration
Abhavtech Security Operations
"""

import hashlib
import json
import subprocess
import requests
from datetime import datetime
import os

# Blockchain Fabric SDK connection
from hfc.fabric import Client

class BlockchainEvidenceCollector:
    def __init__(self, case_id, investigation_type):
        self.case_id = case_id
        self.investigation_type = investigation_type
        self.evidence_vault = "/mnt/evidence_vault"
        self.blockchain_client = Client(net_profile="network-profile.json")
        
    def collect_pcap(self, interface, duration_seconds, description):
        """
        Collect packet capture and register on blockchain
        """
        timestamp = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
        evidence_id = f"EVD-{timestamp}-PCAP"
        filename = f"{self.evidence_vault}/{evidence_id}.pcap"
        
        print(f"[+] Collecting PCAP from {interface} for {duration_seconds} seconds...")
        
        # Capture packets using tcpdump
        cmd = [
            "tcpdump",
            "-i", interface,
            "-w", filename,
            "-G", str(duration_seconds),
            "-W", "1"
        ]
        
        subprocess.run(cmd, check=True)
        
        # Calculate SHA-256 hash
        sha256_hash = self.calculate_hash(filename)
        file_size = os.path.getsize(filename)
        
        print(f"[+] PCAP captured: {filename}")
        print(f"[+] File size: {file_size} bytes")
        print(f"[+] SHA-256: {sha256_hash}")
        
        # Register on blockchain
        self.register_evidence_blockchain(
            evidence_id=evidence_id,
            evidence_type="pcap",
            filename=os.path.basename(filename),
            file_size=file_size,
            sha256_hash=sha256_hash,
            source_platform=description
        )
        
        return evidence_id, filename, sha256_hash
        
    def collect_logs_from_splunk(self, search_query, earliest, latest, description):
        """
        Export logs from Splunk and register on blockchain
        """
        timestamp = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
        evidence_id = f"EVD-{timestamp}-SPLUNK"
        filename = f"{self.evidence_vault}/{evidence_id}.json"
        
        print(f"[+] Exporting logs from Splunk...")
        print(f"    Query: {search_query}")
        print(f"    Time range: {earliest} to {latest}")
        
        # Splunk REST API call
        splunk_url = "https://splunk.abhavtech.com:8089"
        splunk_user = "forensics-api"
        splunk_password = os.environ.get("SPLUNK_API_KEY")
        
        search_job = requests.post(
            f"{splunk_url}/services/search/jobs",
            auth=(splunk_user, splunk_password),
            verify=False,
            data={
                "search": f"search {search_query}",
                "earliest_time": earliest,
                "latest_time": latest,
                "output_mode": "json"
            }
        )
        
        job_sid = search_job.json()["sid"]
        
        # Poll for job completion
        while True:
            status = requests.get(
                f"{splunk_url}/services/search/jobs/{job_sid}",
                auth=(splunk_user, splunk_password),
                verify=False
            ).json()
            
            if status["entry"][0]["content"]["dispatchState"] == "DONE":
                break
        
        # Download results
        results = requests.get(
            f"{splunk_url}/services/search/jobs/{job_sid}/results",
            auth=(splunk_user, splunk_password),
            verify=False,
            params={"output_mode": "json"}
        )
        
        # Save to file
        with open(filename, 'w') as f:
            json.dump(results.json(), f, indent=2)
        
        # Calculate hash
        sha256_hash = self.calculate_hash(filename)
        file_size = os.path.getsize(filename)
        
        print(f"[+] Logs exported: {filename}")
        print(f"[+] Event count: {len(results.json()['results'])}")
        print(f"[+] SHA-256: {sha256_hash}")
        
        # Register on blockchain
        self.register_evidence_blockchain(
            evidence_id=evidence_id,
            evidence_type="splunk_export",
            filename=os.path.basename(filename),
            file_size=file_size,
            sha256_hash=sha256_hash,
            source_platform=description
        )
        
        return evidence_id, filename, sha256_hash
        
    def collect_dnac_timeline(self, issue_id, description):
        """
        Export DNAC Assurance timeline and register on blockchain
        """
        timestamp = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
        evidence_id = f"EVD-{timestamp}-DNAC"
        filename = f"{self.evidence_vault}/{evidence_id}.json"
        
        print(f"[+] Exporting DNAC timeline for issue {issue_id}...")
        
        # DNAC REST API call
        dnac_url = "https://dnac.abhavtech.com"
        dnac_token = self.get_dnac_token()
        
        response = requests.get(
            f"{dnac_url}/dna/intent/api/v1/issues/{issue_id}",
            headers={"X-Auth-Token": dnac_token},
            verify=False
        )
        
        # Save to file
        with open(filename, 'w') as f:
            json.dump(response.json(), f, indent=2)
        
        # Calculate hash
        sha256_hash = self.calculate_hash(filename)
        file_size = os.path.getsize(filename)
        
        print(f"[+] DNAC timeline exported: {filename}")
        print(f"[+] SHA-256: {sha256_hash}")
        
        # Register on blockchain
        self.register_evidence_blockchain(
            evidence_id=evidence_id,
            evidence_type="dnac_timeline",
            filename=os.path.basename(filename),
            file_size=file_size,
            sha256_hash=sha256_hash,
            source_platform=description
        )
        
        return evidence_id, filename, sha256_hash
        
    def calculate_hash(self, filename):
        """
        Calculate SHA-256 hash of file
        """
        sha256 = hashlib.sha256()
        with open(filename, 'rb') as f:
            while True:
                data = f.read(65536)  # 64KB chunks
                if not data:
                    break
                sha256.update(data)
        return sha256.hexdigest()
        
    def register_evidence_blockchain(self, evidence_id, evidence_type, filename,
                                    file_size, sha256_hash, source_platform):
        """
        Register evidence on Hyperledger Fabric blockchain
        """
        print(f"[+] Registering evidence on blockchain...")
        
        # Prepare transaction
        access_list = ["SOC-Team", "Legal-Team", "Audit-Team"]
        
        # Invoke chaincode
        response = self.blockchain_client.chaincode_invoke(
            requestor='forensics-user',
            channel_name='evidence-channel',
            peer_names=['NJ-DC-PEER01'],
            args=[
                evidence_id,
                self.case_id,
                evidence_type,
                filename,
                str(file_size),
                sha256_hash,
                "forensics-ws01.abhavtech.com",
                "SOC-Analyst-" + os.environ.get("USER"),
                source_platform,
                "365",  # retention days
                json.dumps(access_list)
            ],
            cc_name='evidence-contract',
            fcn='CollectEvidence',
        )
        
        print(f"[+] Blockchain transaction ID: {response}")
        print(f"[+] Evidence {evidence_id} registered successfully")
        
    def get_dnac_token(self):
        """
        Authenticate to DNAC and get token
        """
        dnac_url = "https://dnac.abhavtech.com"
        dnac_user = os.environ.get("DNAC_USER")
        dnac_pass = os.environ.get("DNAC_PASS")
        
        response = requests.post(
            f"{dnac_url}/dna/system/api/v1/auth/token",
            auth=(dnac_user, dnac_pass),
            verify=False
        )
        
        return response.json()["Token"]

# Usage example
if __name__ == "__main__":
    collector = BlockchainEvidenceCollector(
        case_id="CASE-2026-001",
        investigation_type="malware_c2"
    )
    
    # Collect PCAP from border node
    collector.collect_pcap(
        interface="eth0",
        duration_seconds=300,
        description="Mumbai-Border-C9500-01"
    )
    
    # Export Splunk logs
    collector.collect_logs_from_splunk(
        search_query='index=firewall src_ip="10.252.80.45" earliest=-1h',
        earliest="-1h",
        latest="now",
        description="FTD-Mumbai-Firewall-Logs"
    )
    
    # Export DNAC timeline
    collector.collect_dnac_timeline(
        issue_id="AWcR...",
        description="DNAC-Client-Health-Issue"
    )
```

---

## 2.2 Blockchain Operations Procedures

### 2.2.1 Evidence Registration (Step-by-Step)

**When to Register Evidence:**
- Immediately upon collection from any network platform
- Before any analysis or manipulation
- As part of automated collection scripts
- Manual collection requires manual registration within 15 minutes

**Registration Procedure:**

```bash
# Step 1: Collect evidence (example: PCAP file)
sudo tcpdump -i eth0 -w /tmp/evidence.pcap -G 300 -W 1

# Step 2: Calculate SHA-256 hash
sha256sum /tmp/evidence.pcap > /tmp/evidence.pcap.sha256
# Output: 8f7e6d5c4b3a2918... evidence.pcap

# Step 3: Move to evidence vault
sudo mv /tmp/evidence.pcap /mnt/evidence_vault/EVD-20260118-001.pcap
sudo mv /tmp/evidence.pcap.sha256 /mnt/evidence_vault/EVD-20260118-001.pcap.sha256

# Step 4: Set immutable flag (ext4 filesystem)
sudo chattr +i /mnt/evidence_vault/EVD-20260118-001.pcap

# Step 5: Register on blockchain using Fabric CLI
peer chaincode invoke \
  -n evidence-contract \
  -C evidence-channel \
  -c '{"Args":["CollectEvidence",
      "EVD-20260118-001",
      "CASE-2026-001",
      "pcap",
      "EVD-20260118-001.pcap",
      "2847392847",
      "8f7e6d5c4b3a2918f7e6d5c4b3a2918f7e6d5c4b3a2918f7e6d5c4b3a2918f7e",
      "forensics-ws01.abhavtech.com",
      "SOC-Analyst-Rajesh-Kumar",
      "Mumbai-Border-C9500-01",
      "365",
      "[\"SOC-Team\",\"Legal-Team\",\"Audit-Team\"]"
    ]}'

# Step 6: Verify registration
peer chaincode query \
  -n evidence-contract \
  -C evidence-channel \
  -c '{"Args":["QueryEvidence","EVD-20260118-001"]}'

# Expected output: Full evidence record with blockchain timestamp
```

### 2.2.2 Evidence Integrity Verification

**Verification Scenarios:**
- Before presenting evidence in court
- Quarterly integrity audits
- When evidence is transferred between custodians
- Upon request from legal department

**Verification Procedure:**

```bash
# Step 1: Calculate current file hash
sha256sum /mnt/evidence_vault/EVD-20260118-001.pcap
# Output: 8f7e6d5c4b3a2918...

# Step 2: Query blockchain for original hash
peer chaincode query \
  -n evidence-contract \
  -C evidence-channel \
  -c '{"Args":["QueryEvidence","EVD-20260118-001"]}' \
  | jq '.sha256_hash'

# Step 3: Compare hashes (automated)
CURRENT_HASH=$(sha256sum /mnt/evidence_vault/EVD-20260118-001.pcap | awk '{print $1}')
BLOCKCHAIN_HASH=$(peer chaincode query -n evidence-contract -C evidence-channel \
  -c '{"Args":["QueryEvidence","EVD-20260118-001"]}' | jq -r '.sha256_hash')

if [ "$CURRENT_HASH" == "$BLOCKCHAIN_HASH" ]; then
  echo "✅ Evidence integrity VERIFIED"
  echo "   File has not been tampered since collection"
else
  echo "❌ Evidence integrity FAILED"
  echo "   File has been modified or corrupted"
  echo "   Current:    $CURRENT_HASH"
  echo "   Blockchain: $BLOCKCHAIN_HASH"
  # Alert security team
  /usr/local/bin/send-alert-to-secops.sh "Evidence tampering detected: EVD-20260118-001"
fi

# Step 4: Verify blockchain ledger consistency across nodes
for NODE in NJ-DC-PEER01 LON-DC-PEER01 MUM-DC-PEER01; do
  echo "Checking $NODE..."
  HASH=$(ssh $NODE "peer chaincode query -n evidence-contract -C evidence-channel \
    -c '{\"Args\":[\"QueryEvidence\",\"EVD-20260118-001\"]}' | jq -r '.sha256_hash'")
  echo "  Hash: $HASH"
done

# All nodes should return identical hashes
```

### 2.2.3 Chain of Custody Transfer

**Transfer Scenarios:**
- SOC analyst transfers to senior investigator
- Forensics team transfers to legal department
- Legal department transfers to external auditor
- Evidence returned from court

**Transfer Procedure:**

```bash
# Step 1: Verify current custodian (must match blockchain record)
CURRENT_CUSTODIAN=$(whoami)
echo "Current user: $CURRENT_CUSTODIAN"

# Step 2: Verify authorization to transfer
peer chaincode query \
  -n evidence-contract \
  -C evidence-channel \
  -c '{"Args":["QueryEvidence","EVD-20260118-001"]}' \
  | jq '.custodian'

# Expected: Should match $CURRENT_CUSTODIAN

# Step 3: Execute transfer on blockchain
peer chaincode invoke \
  -n evidence-contract \
  -C evidence-channel \
  -c '{"Args":["TransferCustody",
      "EVD-20260118-001",
      "Legal-Team-Sarah-Johnson",
      "Transfer to legal for case CASE-2026-001 court preparation",
      "SOC-Manager-Amit-Patel"
    ]}'

# Step 4: Physical/digital handoff
# - If physical media: Obtain signature on transfer form
# - If digital: Send encrypted link with transfer notification

# Step 5: New custodian verifies receipt
# (New custodian runs verification procedure from Section 2.2.2)

# Step 6: Log access by new custodian
peer chaincode invoke \
  -n evidence-contract \
  -C evidence-channel \
  -c '{"Args":["LogAccess",
      "EVD-20260118-001",
      "Legal-Team-Sarah-Johnson",
      "download",
      "Downloaded for case preparation"
    ]}'
```

### 2.2.4 Legal Hold Activation

**Legal Hold Triggers:**
- Litigation initiated
- Subpoena received
- Regulatory investigation
- Internal investigation escalation

**Legal Hold Procedure:**

```bash
# Step 1: Receive legal hold request (from Legal Department)
# Document court case number, matter name, scope

# Step 2: Activate legal hold on blockchain
peer chaincode invoke \
  -n evidence-contract \
  -C evidence-channel \
  -c '{"Args":["EnableLegalHold",
      "EVD-20260118-001",
      "CASE-2026-CA-12345",
      "Legal-Counsel-David-Lee"
    ]}'

# Step 3: Enable SnapLock Compliance on Evidence Vault
ssh storage-admin@netapp-nj-dc01 \
  "snaplock compliance-clock set EVD-20260118-001.pcap retention=indefinite"

# Step 4: Notify all relevant parties
cat << EOF | mail -s "Legal Hold Activated - EVD-20260118-001" \
  soc-team@abhavtech.com,legal-team@abhavtech.com
LEGAL HOLD NOTICE

Evidence ID: EVD-20260118-001
Court Case: CASE-2026-CA-12345
Activated by: Legal-Counsel-David-Lee
Date: $(date)

This evidence is now under legal hold. Do not delete, modify, or
destroy. Retention period: INDEFINITE until court case conclusion.

Blockchain transaction: $(peer chaincode query -n evidence-contract \
  -C evidence-channel -c '{"Args":["QueryEvidence","EVD-20260118-001"]}' \
  | jq -r '.access_log[-1].timestamp')

Contact legal@abhavtech.com for questions.
EOF

# Step 5: Quarterly verification while under legal hold
# (Automated cron job runs integrity checks monthly)
```

---

This completes Part 1. Shall I proceed with **Part 2A: SD-WAN Forensics Scenarios** next?
