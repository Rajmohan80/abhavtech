#!/usr/bin/env python3
"""
ABHAVTECH IPv6 Template Deployment Automation
Deploys DNAC templates and ISE policies for SD-Access IPv6

Usage:
    python3 deploy_ipv6_templates.py --dnac <dnac_ip> --ise <ise_ip>

Requirements:
    pip install requests urllib3

Version: 1.0
Author: Abhavtech Network Engineering
"""

import requests
import json
import csv
import time
import argparse
import urllib3
from getpass import getpass

# Disable SSL warnings (for lab environments only)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


class DNACTemplateDeployer:
    """Deploy DNAC IPv6 templates and pools"""
    
    def __init__(self, dnac_host, username, password):
        self.dnac_host = dnac_host
        self.base_url = f"https://{dnac_host}"
        self.username = username
        self.password = password
        self.token = None
        
    def authenticate(self):
        """Get authentication token"""
        url = f"{self.base_url}/dna/system/api/v1/auth/token"
        response = requests.post(
            url,
            auth=(self.username, self.password),
            verify=False,
            timeout=10
        )
        
        if response.status_code == 200:
            self.token = response.json()['Token']
            print(f"✅ Authenticated to DNAC ({self.dnac_host})")
            return True
        else:
            print(f"❌ Authentication failed: {response.text}")
            return False
    
    def get_headers(self):
        """Return headers with auth token"""
        return {
            'X-Auth-Token': self.token,
            'Content-Type': 'application/json'
        }
    
    def import_template(self, template_file):
        """Import a DNAC template from JSON file"""
        print(f"\nImporting template: {template_file}")
        
        with open(template_file, 'r') as f:
            template_data = json.load(f)
        
        # Create template project if not exists
        project_name = "SD-Access-IPv6-Templates"
        project_id = self._get_or_create_project(project_name)
        
        # Import template
        url = f"{self.base_url}/dna/intent/api/v1/template-programmer/project/{project_id}/template"
        
        response = requests.post(
            url,
            headers=self.get_headers(),
            json=template_data,
            verify=False
        )
        
        if response.status_code in [200, 201, 202]:
            print(f"  ✅ Template imported: {template_data['templateName']}")
            return response.json()
        else:
            print(f"  ❌ Import failed: {response.text}")
            return None
    
    def _get_or_create_project(self, project_name):
        """Get existing project ID or create new project"""
        url = f"{self.base_url}/dna/intent/api/v1/template-programmer/project"
        
        # Check if project exists
        response = requests.get(url, headers=self.get_headers(), verify=False)
        projects = response.json()
        
        for project in projects:
            if project['name'] == project_name:
                return project['id']
        
        # Create new project
        project_data = {
            "name": project_name,
            "description": "SD-Access IPv6 deployment templates"
        }
        
        response = requests.post(
            url,
            headers=self.get_headers(),
            json=project_data,
            verify=False
        )
        
        if response.status_code in [200, 201, 202]:
            return response.json()['response']['id']
        else:
            raise Exception(f"Failed to create project: {response.text}")
    
    def import_ipv6_pools_csv(self, csv_file):
        """Import IPv6 pools from CSV file"""
        print(f"\nImporting IPv6 pools from: {csv_file}")
        
        with open(csv_file, 'r') as f:
            reader = csv.DictReader(f)
            pools = list(reader)
        
        success_count = 0
        fail_count = 0
        
        for pool in pools:
            pool_data = {
                "ipPoolName": pool['Pool Name'],
                "ipPoolCidr": pool['IPv6 Prefix'],
                "type": pool['Pool Type'],
                "gateways": [pool['IPv6 Gateway']],
                "dnsServerIps": [
                    pool['DNS Server Primary IPv6'],
                    pool['DNS Server Secondary IPv6']
                ],
                "dhcpServerIps": [],
                "ipPoolOwner": "DNAC",
                "IpAddressSpace": "IPv6"
            }
            
            url = f"{self.base_url}/dna/intent/api/v1/reserve-ip-subpool"
            
            response = requests.post(
                url,
                headers=self.get_headers(),
                json=pool_data,
                verify=False
            )
            
            if response.status_code in [200, 201, 202]:
                print(f"  ✅ Pool created: {pool['Pool Name']}")
                success_count += 1
            else:
                print(f"  ❌ Pool failed: {pool['Pool Name']} - {response.text}")
                fail_count += 1
        
        print(f"\nIPv6 Pool Import Summary: {success_count} success, {fail_count} failed")


class ISEPolicyDeployer:
    """Deploy ISE IPv6 profiling policies and network devices"""
    
    def __init__(self, ise_host, username, password):
        self.ise_host = ise_host
        self.base_url = f"https://{ise_host}:9060"
        self.username = username
        self.password = password
    
    def import_network_devices_csv(self, csv_file):
        """Import network devices with IPv6 addresses from CSV"""
        print(f"\nImporting ISE network devices from: {csv_file}")
        
        with open(csv_file, 'r') as f:
            reader = csv.DictReader(f)
            devices = list(reader)
        
        success_count = 0
        fail_count = 0
        
        for device in devices:
            device_data = {
                "NetworkDevice": {
                    "name": device['Device Name'],
                    "description": f"IPv6 dual-stack device at {device['Location']}",
                    "NetworkDeviceIPList": [
                        {
                            "ipaddress": device['IPv4 Address'],
                            "mask": 32
                        },
                        {
                            "ipaddress": device['IPv6 Address'],
                            "mask": int(device['IPv6 Prefix Length'])
                        }
                    ],
                    "NetworkDeviceGroupList": [
                        f"Location#{device['Location']}",
                        f"Device Type#{device['Device Type']}"
                    ],
                    "authenticationSettings": {
                        "radiusSharedSecret": device['RADIUS Shared Secret'],
                        "enableKeyWrap": False,
                        "dtlsRequired": False
                    },
                    "tacacsSettings": {
                        "sharedSecret": device['TACACS Shared Secret']
                    },
                    "profileName": device['Device Profile'],
                    "coaPort": int(device['CoA Port'])
                }
            }
            
            url = f"{self.base_url}/ers/config/networkdevice"
            
            response = requests.post(
                url,
                auth=(self.username, self.password),
                headers={
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                json=device_data,
                verify=False
            )
            
            if response.status_code in [200, 201]:
                print(f"  ✅ Device added: {device['Device Name']}")
                success_count += 1
            else:
                print(f"  ❌ Device failed: {device['Device Name']} - {response.text}")
                fail_count += 1
        
        print(f"\nNetwork Device Import Summary: {success_count} success, {fail_count} failed")


def main():
    """Main deployment function"""
    parser = argparse.ArgumentParser(
        description='Deploy Abhavtech IPv6 templates to DNAC and ISE'
    )
    parser.add_argument('--dnac', help='DNAC hostname or IP', required=False)
    parser.add_argument('--ise', help='ISE hostname or IP', required=False)
    parser.add_argument('--dnac-user', help='DNAC username', default='admin')
    parser.add_argument('--ise-user', help='ISE username', default='admin')
    parser.add_argument('--templates-dir', help='Directory containing templates', default='.')
    
    args = parser.parse_args()
    
    print("═══════════════════════════════════════════════════════════")
    print("   ABHAVTECH IPv6 TEMPLATE DEPLOYMENT AUTOMATION")
    print("═══════════════════════════════════════════════════════════\n")
    
    # DNAC Deployment
    if args.dnac:
        print("DNAC DEPLOYMENT")
        print("─────────────────────────────────────────────────────────")
        
        dnac_password = getpass(f"Enter DNAC password for {args.dnac_user}: ")
        dnac = DNACTemplateDeployer(args.dnac, args.dnac_user, dnac_password)
        
        if dnac.authenticate():
            # Import templates
            template_files = [
                f"{args.templates_dir}/Edge-Switch-Dual-Stack-IPv6.json"
            ]
            
            for template_file in template_files:
                try:
                    dnac.import_template(template_file)
                except FileNotFoundError:
                    print(f"  ⚠️  Template file not found: {template_file}")
                except Exception as e:
                    print(f"  ❌ Error importing template: {e}")
            
            # Import IPv6 pools
            pools_csv = f"{args.templates_dir}/DNAC-IPv6-Pools-Import.csv"
            try:
                dnac.import_ipv6_pools_csv(pools_csv)
            except FileNotFoundError:
                print(f"  ⚠️  Pools CSV not found: {pools_csv}")
            except Exception as e:
                print(f"  ❌ Error importing pools: {e}")
    
    # ISE Deployment
    if args.ise:
        print("\n\nISE DEPLOYMENT")
        print("─────────────────────────────────────────────────────────")
        
        ise_password = getpass(f"Enter ISE password for {args.ise_user}: ")
        ise = ISEPolicyDeployer(args.ise, args.ise_user, ise_password)
        
        # Import network devices
        devices_csv = f"{args.templates_dir}/ISE-Network-Devices-IPv6-Import.csv"
        try:
            ise.import_network_devices_csv(devices_csv)
        except FileNotFoundError:
            print(f"  ⚠️  Devices CSV not found: {devices_csv}")
        except Exception as e:
            print(f"  ❌ Error importing devices: {e}")
    
    print("\n═══════════════════════════════════════════════════════════")
    print("   DEPLOYMENT COMPLETE")
    print("═══════════════════════════════════════════════════════════\n")
    
    if not args.dnac and not args.ise:
        print("No targets specified. Use --dnac and/or --ise to deploy.")
        print("\nExample:")
        print("  python3 deploy_ipv6_templates.py --dnac dnac.abhavtech.com --ise ise.abhavtech.com")


if __name__ == "__main__":
    main()
