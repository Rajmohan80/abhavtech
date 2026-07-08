# 3.3 Terraform Installation

Install Terraform via the official HashiCorp APT repository to ensure automatic updates and version management.

## Installation Steps

### Step 1: Add HashiCorp GPG Key

```bash
# Download and add HashiCorp GPG key
wget -O- https://apt.releases.hashicorp.com/gpg | \
  sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
```

### Step 2: Add HashiCorp Repository

```bash
# Add repository to sources list
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \
https://apt.releases.hashicorp.com $(lsb_release -cs) main" | \
  sudo tee /etc/apt/sources.list.d/hashicorp.list
```

### Step 3: Install Terraform

```bash
# Update package list
sudo apt update

# Install Terraform
sudo apt install terraform

# Verify installation
terraform --version

# Expected: Terraform v1.7.x or later
```

## Enable Tab Completion

```bash
# Enable Terraform autocomplete for bash
terraform -install-autocomplete

# Restart shell or source .bashrc
source ~/.bashrc
```

## Verify Installation

```bash
# Create test directory
mkdir -p ~/terraform-test
cd ~/terraform-test

# Create simple test file
cat > main.tf << 'EOF'
terraform {
  required_version = ">= 1.7.0"
}

output "hello" {
  value = "Terraform is working!"
}
EOF

# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# Plan (should show the output value)
terraform plan

# Expected output:
# Changes to Outputs:
#   + hello = "Terraform is working!"
```

## Terraform Providers for Abhavtech

Install provider documentation locally:

```bash
# DNAC provider
terraform init -upgrade
# Downloads cisco-en-programmability/dnacenter provider

# ISE provider  
# Downloads CiscoISE/ise provider

# Webex provider
# Downloads cisco-open/webex provider
```

## Configuration

Create `~/.terraformrc` for global settings:

```hcl
# Terraform CLI configuration
plugin_cache_dir = "$HOME/.terraform.d/plugin-cache"
disable_checkpoint = true

credentials "app.terraform.io" {
  token = "your-terraform-cloud-token-here"
}
```

---

**Related Sections**:
- [3.1 VS Code and WSL Configuration](vscode-wsl.md)
- [Chapter 6: Terraform Provisioning](../chapter6-terraform/README.md)
