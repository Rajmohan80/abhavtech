# 12.2 Automated Device Config Backup

Backup device configurations automatically.

## Backup Script

```python
from netmiko import ConnectHandler
import git

devices = ['10.252.1.101', '10.252.1.102']

for device_ip in devices:
    connection = ConnectHandler(
        device_type='cisco_ios',
        host=device_ip,
        username=vault_get('ssh_username'),
        password=vault_get('ssh_password')
    )
    config = connection.send_command('show running-config')
    
    # Save to Git
    with open(f'backups/{device_ip}.cfg', 'w') as f:
        f.write(config)
    
    repo = git.Repo('.')
    repo.index.add([f'backups/{device_ip}.cfg'])
    repo.index.commit(f'Auto-backup {device_ip}')
```

---

**Related Sections**:
- [12.3 Scheduled Automation Tasks](scheduled-tasks.md)
