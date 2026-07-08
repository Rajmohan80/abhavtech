# 12.3 Scheduled Automation Tasks

Schedule recurring automation tasks.

## Cron Jobs

```bash
# Daily config backup at 2 AM
0 2 * * * /home/automation/scripts/backup_configs.py

# Weekly compliance check on Sundays at 3 AM
0 3 * * 0 ansible-playbook /home/automation/ansible/playbooks/compliance.yml
```

---

**Related Sections**:
- [Chapter 12 Overview](README.md)
