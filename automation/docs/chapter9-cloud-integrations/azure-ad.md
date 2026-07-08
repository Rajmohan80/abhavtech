# 9.2 Microsoft Azure AD Integration

Integrate Azure AD for SSO authentication.

## Configuration

```python
from msal import ConfidentialClientApplication
from vault_helper import get_secret

azure_creds = get_secret('secret/abhavtech/azure-ad/app-creds')

app = ConfidentialClientApplication(
    azure_creds['client_id'],
    authority=f"https://login.microsoftonline.com/{azure_creds['tenant_id']}",
    client_credential=azure_creds['client_secret']
)

token = app.acquire_token_for_client(scopes=["https://graph.microsoft.com/.default"])
```

---

**Related Sections**:
- [Chapter 4: Secrets & Security](../chapter4-secrets-security/README.md)
