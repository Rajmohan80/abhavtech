# 4.1 HashiCorp Vault Deployment

HashiCorp Vault is deployed on-premises at the New Jersey Data Center as a dedicated VM, providing centralized secrets management for all automation credentials.

!!! note "Manual Deployment Context"
    In the manual deployment, credentials were stored in password-protected spreadsheets or the heads of individual engineers — a practice that creates single points of failure and fails compliance audits.

## Vault Architecture

```
+------------------------------------------------------------------+
|                    VAULT DEPLOYMENT                               |
|  Location: New Jersey DC (10.252.200.10)                          |
|  Mode: Single server with Raft storage                            |
|  TLS: Enabled (signed by Abhavtech internal CA)                   |
+------------------------------------------------------------------+
|                                                                    |
|  KV Secrets Engine v2 (Versioned):                                |
|  secret/abhavtech/                                                 |
|    +-- dnac/                                                       |
|    |   +-- admin         (DNAC GUI/API admin credentials)          |
|    |   +-- pxgrid        (pxGrid integration creds)                |
|    +-- ise/                                                        |
|    |   +-- admin         (ISE admin credentials)                   |
|    |   +-- ers           (ERS API credentials)                     |
|    |   +-- radius-secret (Shared secret for NADs)                  |
|    +-- sdwan/                                                      |
|    |   +-- vmanage       (vManage API credentials)                 |
|    |   +-- vbond         (vBond registration)                      |
|    +-- webex/                                                      |
|    |   +-- api-token     (Webex API bearer token)                  |
|    +-- fmc/                                                        |
|    |   +-- admin         (FMC API credentials)                     |
|    +-- ssh/                                                        |
|    |   +-- network-key   (SSH private key for device access)       |
|    +-- azure-ad/                                                   |
|    |   +-- app-creds     (Azure AD app ID + secret)                |
|    +-- vertex-ai/                                                  |
|        +-- service-key   (Vertex AI service account JSON)          |
+------------------------------------------------------------------+
```

## Installation and Configuration

### Step 1: Install Vault

```bash
# Install Vault on dedicated Ubuntu 22.04 VM at 10.252.200.10
wget -O- https://apt.releases.hashicorp.com/gpg | \
  sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg

sudo apt update && sudo apt install vault
```

### Step 2: Configure Vault Server

Create `/etc/vault.d/vault.hcl`:

```hcl
storage "raft" {
  path    = "/opt/vault/data"
  node_id = "vault-nj-01"
}

listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_cert_file = "/opt/vault/tls/vault-cert.pem"
  tls_key_file  = "/opt/vault/tls/vault-key.pem"
}

api_addr     = "https://10.252.200.10:8200"
cluster_addr = "https://10.252.200.10:8201"
```

### Step 3: Initialize and Unseal

```bash
# Initialize Vault
vault operator init -key-shares=5 -key-threshold=3

# Save unseal keys and root token securely!
# Unseal Vault (repeat 3 times with different keys)
vault operator unseal <key1>
vault operator unseal <key2>
vault operator unseal <key3>

# Login with root token
vault login <root-token>
```

### Step 4: Enable KV v2 Secrets Engine

```bash
vault secrets enable -path=secret kv-v2
```

## Storing Abhavtech Credentials

```bash
# Store DNAC credentials
vault kv put secret/abhavtech/dnac/admin \
  username="admin" \
  password="<DNAC_ADMIN_PASSWORD>" \
  url="https://10.252.10.11"

# Store ISE ERS credentials
vault kv put secret/abhavtech/ise/ers \
  username="ers-admin" \
  password="<ISE_ERS_PASSWORD>" \
  url="https://10.252.30.10:9060"

# Store ISE RADIUS shared secret
vault kv put secret/abhavtech/ise/radius-secret \
  secret="<RADIUS_SHARED_SECRET>"

# Store vManage API credentials
vault kv put secret/abhavtech/sdwan/vmanage \
  username="admin" \
  password="<VMANAGE_PASSWORD>" \
  url="https://vmanage.abhavtech.local"

# Store SSH private key for network devices
vault kv put secret/abhavtech/ssh/network-key \
  private_key=@/root/.ssh/abhavtech_automation_ed25519

# Store Webex API token
vault kv put secret/abhavtech/webex/api-token \
  bearer_token="<WEBEX_BEARER_TOKEN>"

# Store FMC API credentials
vault kv put secret/abhavtech/fmc/admin \
  username="api-admin" \
  password="<FMC_API_PASSWORD>" \
  url="https://fmc-nj.abhavtech.local"
```

---

**Related Sections**:
- [4.2 Retrieving Credentials at Runtime](runtime-credentials.md)
- [4.4 RBAC for Automation Accounts](rbac.md)
