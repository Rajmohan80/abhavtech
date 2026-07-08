# Chapter 3: Development Environment Setup

Complete setup guide for the automation control node, including VS Code with WSL Ubuntu configuration, Python virtual environments, Terraform installation, Ansible Cisco collections, Git repository structure, and pre-commit hooks for code quality.

## What You'll Learn

### VS Code + WSL Ubuntu Configuration
Set up a Linux-native environment for Terraform, Ansible, and Python while maintaining Windows desktop experience:

- WSL 2 installation with Ubuntu 22.04
- Essential packages for network automation
- VS Code Remote WSL extension configuration
- Terminal integration and syntax highlighting

### Python Virtual Environment
Isolated Python environment with all required packages:

- Ansible 9.2.0 for configuration management
- Netmiko/Nornir for device interaction
- Cisco SDKs (DNA Center, ISE, Webex)
- HashiCorp Vault client (hvac)
- pyATS for automated testing

### Terraform Installation
HashiCorp Terraform 1.7+ with required providers:

- Official HashiCorp APT repository setup
- CML2 provider for lab automation
- Cisco DNAC/ISE/SD-WAN providers
- Webex provider for UC automation

### Ansible Cisco Collections
Required Galaxy collections for Cisco automation:

- cisco.ios for IOS/IOS-XE devices
- cisco.nxos for Nexus platforms
- cisco.dnac for DNA Center API
- cisco.ise for Identity Services Engine

### Git Repository Structure
Abhavtech automation repository organization:

- `/terraform` - Infrastructure provisioning code
- `/ansible` - Playbooks and templates
- `/scripts` - Python automation helpers
- `/docs` - Documentation and diagrams

### Pre-Commit Hooks
Automated code quality checks:

- YAML linting
- Terraform validation
- Ansible syntax checking
- Secrets detection

## Chapter Navigation

- **[3.1 VS Code and WSL Configuration](vscode-wsl.md)** - Development environment setup
- **[3.2 Python Virtual Environment](python-venv.md)** - Package installation
- **[3.3 Terraform Installation](terraform.md)** - Terraform setup and providers
- **[3.4 Ansible Cisco Collections](ansible.md)** - Galaxy collection installation
- **[3.5 Git Repository Structure](git-structure.md)** - Folder organization
- **[3.6 Pre-Commit Hooks](precommit-hooks.md)** - Code quality automation

## Prerequisites

- Windows 10/11 with WSL 2 support
- Administrator access for PowerShell
- 16GB RAM minimum (20GB recommended)
- 100GB free disk space for CML labs
- Network access to Abhavtech infrastructure

---

**Previous**: [← Automation Architecture](../chapter2-automation-architecture/README.md)  
**Next**: [Secrets & Security Management](../chapter4-secrets-security/README.md) →
