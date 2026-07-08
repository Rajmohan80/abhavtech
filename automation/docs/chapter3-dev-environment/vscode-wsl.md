# 3.1 VS Code and WSL Configuration

The development environment uses **Visual Studio Code** with the **Remote WSL extension** connecting to **Ubuntu 22.04** running under **Windows Subsystem for Linux**. This provides a Linux-native environment for Terraform, Ansible, and Python while maintaining the Windows desktop experience.

## Why WSL Instead of Native Windows?

| Consideration | Windows Native | WSL Ubuntu |
|--------------|----------------|------------|
| **Terraform execution** | Works, but path issues with PowerShell | Native Linux paths, seamless |
| **Ansible** | Not supported on Windows | Fully supported |
| **Python packages** | Some require Visual Studio build tools | Standard pip install |
| **Shell scripts** | Requires Git Bash or PowerShell rewrites | Bash scripts work as-is |
| **SSH keys** | Separate Windows/Linux key stores | Single `~/.ssh/` directory |

!!! note "Manual Deployment Context"
    In the manual deployment, Abhavtech engineers used PuTTY and SecureCRT for SSH sessions and browser-based GUIs for DNAC, ISE, and vManage. The automated environment consolidates all tooling into a single VS Code workspace with integrated terminal, syntax highlighting, and Git integration.

## WSL Installation and Configuration

### Step 1: Install WSL and Ubuntu

From **Windows PowerShell (Administrator)**:

```powershell
# Install WSL with Ubuntu 22.04
wsl --install -d Ubuntu-22.04

# System will reboot
```

After reboot, Ubuntu terminal launches automatically. Set your username and password:

```
Enter new UNIX username: abhavtech
New password: ********
Retype new password: ********
```

### Step 2: Update Ubuntu and Install Essential Packages

```bash
# Update package lists
sudo apt update && sudo apt upgrade -y

# Install essential development tools
sudo apt install -y \
  python3 \
  python3-pip \
  python3-venv \
  git \
  curl \
  unzip \
  software-properties-common \
  gnupg2 \
  sshpass \
  jq \
  yamllint \
  tree \
  htop

# Set Python 3 as default
sudo update-alternatives --install /usr/bin/python python /usr/bin/python3 1

# Verify
python --version
# Expected: Python 3.10.x or 3.11.x
```

### Step 3: Configure Git

```bash
# Set global Git configuration
git config --global user.name "Your Name"
git config --global user.email "your.email@abhavtech.com"

# Set default editor to VS Code (optional)
git config --global core.editor "code --wait"

# Enable credential caching (saves typing password repeatedly)
git config --global credential.helper cache
git config --global credential.helper 'cache --timeout=3600'

# Verify
git config --list
```

### Step 4: Generate SSH Key for Git/Device Access

```bash
# Generate Ed25519 SSH key (more secure than RSA)
ssh-keygen -t ed25519 -C "your.email@abhavtech.com"

# Press Enter to accept default location: /home/username/.ssh/id_ed25519
# Enter passphrase (recommended but optional)

# Display public key
cat ~/.ssh/id_ed25519.pub

# Copy this public key to:
# - GitHub/GitLab (for repository access)
# - HashiCorp Vault (for automated device SSH)
```

## VS Code Installation and Configuration

### Step 1: Install VS Code on Windows

Download from [code.visualstudio.com](https://code.visualstudio.com/)

Install with default options.

### Step 2: Install Required VS Code Extensions

Open VS Code → Extensions (Ctrl+Shift+X) → Install:

| Extension | Publisher | Purpose |
|-----------|-----------|---------|
| **Remote - WSL** | Microsoft | Connect to WSL Ubuntu |
| **Python** | Microsoft | Python intellisense, debugging |
| **Pylance** | Microsoft | Fast Python language server |
| **HashiCorp Terraform** | HashiCorp | Terraform syntax, validation |
| **Ansible** | Red Hat | Ansible YAML syntax, validation |
| **YAML** | Red Hat | YAML syntax highlighting |
| **GitLens** | GitKraken | Git commit history, blame |
| **Better Comments** | Aaron Bond | Color-coded comment types |
| **Bracket Pair Colorizer 2** | CoenraadS | Matching bracket colors |
| **indent-rainbow** | oderwat | Indent level visualization |
| **Trailing Spaces** | Shardul Mahadik | Highlight trailing whitespace |

### Step 3: Connect VS Code to WSL

**Method 1: From VS Code**

1. Press `F1` or `Ctrl+Shift+P`
2. Type: "WSL: Connect to WSL"
3. VS Code reloads, now running inside WSL

**Method 2: From WSL Terminal**

```bash
# Open VS Code in current directory
code .

# VS Code launches connected to WSL
```

### Step 4: VS Code Settings for Automation

Create `.vscode/settings.json` in your automation repository:

```json
{
  // Python
  "python.defaultInterpreterPath": "${workspaceFolder}/.venv/bin/python",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.formatting.provider": "black",
  
  // Terraform
  "terraform.experimentalFeatures.validateOnSave": true,
  "terraform.languageServer.enable": true,
  
  // Ansible
  "ansible.python.interpreterPath": "${workspaceFolder}/.venv/bin/python",
  "ansible.validation.enabled": true,
  "ansible.validation.lint.enabled": true,
  
  // YAML
  "yaml.schemas": {
    "https://raw.githubusercontent.com/ansible/ansible-lint/main/src/ansiblelint/schemas/ansible.json": "playbooks/*.{yml,yaml}",
    "https://raw.githubusercontent.com/ansible/ansible-lint/main/src/ansiblelint/schemas/vars.json": "vars/*.{yml,yaml}"
  },
  
  // Git
  "git.autofetch": true,
  "git.confirmSync": false,
  
  // Editor
  "editor.formatOnSave": true,
  "editor.rulers": [80, 120],
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  
  // Terminal
  "terminal.integrated.defaultProfile.linux": "bash",
  "terminal.integrated.fontSize": 14
}
```

### Step 5: Workspace Shortcuts

Create **keyboard shortcuts** for common tasks:

Press `Ctrl+K Ctrl+S` → Open Keyboard Shortcuts → Add:

```json
[
  {
    "key": "ctrl+shift+t",
    "command": "workbench.action.terminal.new"
  },
  {
    "key": "ctrl+shift+r",
    "command": "workbench.action.tasks.runTask",
    "args": "Terraform Plan"
  },
  {
    "key": "ctrl+shift+a",
    "command": "workbench.action.tasks.runTask",
    "args": "Ansible Playbook Check"
  }
]
```

## Repository Structure in VS Code

When you open your automation repository in VS Code:

```
abhavtech-automation/         # Root workspace folder
├── .vscode/
│   ├── settings.json         # VS Code workspace settings
│   └── tasks.json            # Task definitions (terraform plan, ansible-playbook)
├── terraform/
│   ├── dnac/
│   ├── ise/
│   ├── sdwan/
│   └── webex/
├── ansible/
│   ├── inventory/
│   ├── playbooks/
│   └── templates/
├── scripts/
│   ├── python/
│   └── bash/
├── .venv/                    # Python virtual environment
├── .gitignore
└── README.md
```

## Integrated Terminal Workflow

VS Code's integrated terminal runs inside WSL:

```bash
# Open terminal: Ctrl+` (backtick)

# Activate Python venv
source .venv/bin/activate

# Run Terraform
cd terraform/dnac
terraform plan

# Run Ansible
cd ../../ansible
ansible-playbook -i inventory/lab.yml playbooks/configure-fabric.yaml --check

# Run Python script
cd ../scripts/python
python vault_helper.py --list-secrets
```

## Tasks Configuration

Create `.vscode/tasks.json` for one-click automation:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Terraform Plan",
      "type": "shell",
      "command": "terraform plan",
      "options": {
        "cwd": "${workspaceFolder}/terraform/dnac"
      },
      "problemMatcher": []
    },
    {
      "label": "Terraform Apply",
      "type": "shell",
      "command": "terraform apply -auto-approve",
      "options": {
        "cwd": "${workspaceFolder}/terraform/dnac"
      },
      "problemMatcher": []
    },
    {
      "label": "Ansible Playbook Check",
      "type": "shell",
      "command": "ansible-playbook -i inventory/lab.yml playbooks/configure-fabric.yaml --check",
      "options": {
        "cwd": "${workspaceFolder}/ansible"
      },
      "problemMatcher": []
    },
    {
      "label": "Ansible Playbook Run",
      "type": "shell",
      "command": "ansible-playbook -i inventory/lab.yml playbooks/configure-fabric.yaml",
      "options": {
        "cwd": "${workspaceFolder}/ansible"
      },
      "problemMatcher": []
    }
  ]
}
```

Run tasks: `Ctrl+Shift+P` → "Tasks: Run Task" → Select task

## Troubleshooting

### Issue: VS Code Cannot Connect to WSL

**Solution**:

```bash
# Restart WSL
wsl --shutdown
wsl

# Reinstall VS Code Server in WSL
rm -rf ~/.vscode-server
# Reconnect from VS Code
```

### Issue: Python Extension Not Finding Interpreter

**Solution**:

1. Press `Ctrl+Shift+P`
2. Type: "Python: Select Interpreter"
3. Choose: `.venv/bin/python`

### Issue: Ansible Extension Showing Errors

**Solution**:

```bash
# Install ansible-lint
pip install ansible-lint

# Verify
ansible-lint --version
```

---

**Related Sections**:
- [3.2 Python Virtual Environment](python-venv.md) - Setting up Python venv
- [3.3 Terraform Installation](terraform.md) - Installing Terraform in WSL
- [3.4 Ansible Cisco Collections](ansible.md) - Installing Ansible Galaxy collections
