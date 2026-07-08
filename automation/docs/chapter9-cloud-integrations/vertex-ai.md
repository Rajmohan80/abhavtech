# 9.1 Google Vertex AI Integration

Integrate Vertex AI for network analytics.

## Python Integration

```python
from google.cloud import aiplatform
from google.oauth2 import service_account
from vault_helper import get_secret

# Retrieve the service account JSON from Vault and build a credentials object
sa_info = get_secret('secret/abhavtech/vertex-ai/service-key')
credentials = service_account.Credentials.from_service_account_info(sa_info)

# Initialize Vertex AI
aiplatform.init(
    project="abhavtech-network-analytics",
    location="us-central1",
    credentials=credentials
)

# Predict network anomalies
endpoint = aiplatform.Endpoint("projects/.../endpoints/...")
predictions = endpoint.predict(instances=[network_metrics])
```

---

**Related Sections**:
- [9.2 Microsoft Azure AD Integration](azure-ad.md)
