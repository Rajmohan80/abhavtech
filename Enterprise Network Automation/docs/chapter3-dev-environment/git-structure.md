# 3.5 Git Repository Structure

The repository structure mirrors the Abhavtech technology domains, with clear separation between Terraform provisioning, Ansible configuration, and Python custom scripts.

## Repository Structure

```
abhavtech-automation/
├── terraform/                  # Infrastructure provisioning
│   ├── cml-lab/               # CML topology definitions
│   ├── dnac/                  # DNA Center site/fabric provisioning
│   ├── ise/                   # ISE policy provisioning
│   ├── sdwan/                 # SD-WAN vManage configuration
│   ├── webex/                 # Webex locations, users, queues
│   └── modules/               # Reusable Terraform modules
├── ansible/                   # Device configuration
│   ├── inventory/             # Inventory files (lab, staging, prod)
│   ├── playbooks/             # Ansible playbooks
│   ├── roles/                 # Ansible roles
│   ├── templates/             # Jinja2 configuration templates
│   ├── vars/                  # Variable files
│   └── requirements.yml       # Galaxy collection dependencies
├── scripts/                   # Custom automation scripts
│   ├── python/                # Python scripts
│   │   ├── sdwan/            # vManage API scripts
│   │   ├── webex/            # Webex API scripts
│   │   └── vault_helper.py   # Vault integration
│   └── bash/                  # Shell scripts
├── docs/                      # Documentation
│   ├── diagrams/             # Network diagrams
│   ├── runbooks/             # Operational procedures
│   └── architecture/         # Design documents
├── .venv/                     # Python virtual environment (gitignored)
├── .gitignore                 # Files to exclude from Git
├── .pre-commit-config.yaml   # Pre-commit hook configuration
├── README.md                  # Project overview
└── requirements.txt           # Python package dependencies
```

## Branching Strategy

- **main**: Production-ready code
- **staging**: Pre-production testing
- **lab**: CML validation environment
- **feature/***: Individual feature development

---

**Related Sections**:
- [3.6 Pre-Commit Hooks](precommit-hooks.md)
- [Chapter 5: Git Workflow](../chapter5-git-workflow/README.md)
