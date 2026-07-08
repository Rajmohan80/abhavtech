# 3.2 Python Virtual Environment

Create a dedicated Python virtual environment for network automation packages. This isolates dependencies and prevents version conflicts with system Python.

## Why Virtual Environments?

| Without venv | With venv |
|--------------|-----------|
| Packages install system-wide | Packages isolated per project |
| Version conflicts between projects | Each project has own versions |
| Requires sudo for pip install | No sudo needed |
| Difficult to replicate environment | requirements.txt = exact replica |

## Creating the Virtual Environment

```bash
# Navigate to home directory
cd ~

# Create virtual environment
python3 -m venv abhavtech-automation-venv

# Activate it
source abhavtech-automation-venv/bin/activate

# Prompt changes to show (abhavtech-automation-venv)
```

## Installing Required Packages

```bash
# Upgrade pip first
pip install --upgrade pip

# Install Ansible
pip install ansible==9.2.0

# Install network automation libraries
pip install netmiko==4.3.0          # Multi-vendor SSH library
pip install nornir==3.4.1           # Network automation framework
pip install nornir-netmiko==1.0.1   # Netmiko plugin for Nornir
pip install nornir-utils==0.2.0     # Nornir utility functions

# Install API clients
pip install requests==2.31.0        # HTTP library
pip install hvac==2.1.0             # HashiCorp Vault client
pip install dnacentersdk==2.7.0     # Cisco DNA Center SDK
pip install ciscoisesdk==2.1.1      # Cisco ISE SDK
pip install webexpythonsdk==2.0.6     # Webex Python SDK (formerly webexteamssdk)

# Install template engines and parsers
pip install jinja2==3.1.3           # Template engine for configs
pip install pyyaml==6.0.1           # YAML parser
pip install xmltodict==0.13.0       # XML to dict converter

# Install testing and validation
pip install pyats[full]==24.1       # Cisco pyATS testing framework
pip install paramiko==3.4.0         # SSH library (dependency)

# Install CLI utilities
pip install rich==13.7.0            # Beautiful terminal output
pip install click==8.1.7            # CLI framework

# Verify installations
ansible --version
python -c "import netmiko; print(netmiko.__version__)"
```

## Creating requirements.txt

```bash
# Generate requirements file from current venv
pip freeze > requirements.txt

# File contents:
cat requirements.txt
```

Example `requirements.txt`:

```txt
ansible==9.2.0
netmiko==4.3.0
nornir==3.4.1
nornir-netmiko==1.0.1
nornir-utils==0.2.0
requests==2.31.0
hvac==2.1.0
jinja2==3.1.3
pyyaml==6.0.1
dnacentersdk==2.7.0
ciscoisesdk==2.1.1
webexpythonsdk==2.0.6
xmltodict==0.13.0
rich==13.7.0
pyats[full]==24.1
paramiko==3.4.0
click==8.1.7
```

## Activating/Deactivating

```bash
# Activate venv (run this in every new terminal session)
source ~/abhavtech-automation-venv/bin/activate

# Deactivate venv
deactivate

# Add to .bashrc for automatic activation
echo "source ~/abhavtech-automation-venv/bin/activate" >> ~/.bashrc
```

## Replicating Environment on Another Machine

```bash
# On new machine:
python3 -m venv abhavtech-automation-venv
source abhavtech-automation-venv/bin/activate
pip install -r requirements.txt

# Exact same package versions installed
```

## Verification

```bash
# Check Ansible version
ansible --version

# Expected output:
# ansible [core 2.16.x]
# python version = 3.10.x

# Check installed packages
pip list

# Test imports
python << EOF
import netmiko
import nornir
import dnacentersdk
import ciscoisesdk
print("All imports successful!")
EOF
```

---

**Related Sections**:
- [3.1 VS Code and WSL Configuration](vscode-wsl.md)
- [3.4 Ansible Cisco Collections](ansible.md)
