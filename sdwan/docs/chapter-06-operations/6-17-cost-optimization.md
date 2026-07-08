# 6.17 Cost Optimization

## 6.17.1 Cost Optimization Framework

### Framework Overview

```yaml
cost_optimization_framework:
  purpose: "Maximize value while minimizing total cost of ownership"
  
  pillars:
    circuit_optimization:
      description: "Optimize WAN circuit costs"
      potential_savings: "20-40%"
      
    resource_optimization:
      description: "Right-size devices and licenses"
      potential_savings: "10-20%"
      
    operational_efficiency:
      description: "Reduce operational costs through automation"
      potential_savings: "15-30%"
      
    vendor_management:
      description: "Negotiate better terms and consolidate vendors"
      potential_savings: "10-25%"
```

### Current Cost Baseline

```yaml
current_cost_baseline:
  monthly_costs:
    wan_circuits:
      mpls:
        provider: "Tata Communications"
        monthly_cost: 45000  # USD
        sites_covered: 7
        avg_per_site: 6428
        
      internet:
        provider: "Multiple"
        monthly_cost: 12000
        sites_covered: 9
        avg_per_site: 1333
        
      backup_lte:
        provider: "Multiple"
        monthly_cost: 3000
        sites_covered: 5
        avg_per_site: 600
        
      total_circuits: 60000
      
    software_licenses:
      dna_advantage:
        monthly_cost: 15000
        devices_licensed: 854
        
      security_features:
        monthly_cost: 5000
        
      total_licenses: 20000
      
    support_contracts:
      cisco_smartnet:
        monthly_cost: 8000
        coverage: "24x7x4"
        
      total_support: 8000
      
    operational:
      staffing_allocation:
        monthly_cost: 25000
        fte_equivalent: 2.5
        
      tools_monitoring:
        monthly_cost: 3000
        
      total_operational: 28000
      
    total_monthly: 116000
    total_annual: 1392000
```

---

## 6.17.2 Circuit Cost Optimization

### MPLS to Internet Offload

```yaml
mpls_optimization:
  strategy: "Shift appropriate traffic from MPLS to Internet"
  
  traffic_analysis:
    current_mpls_traffic:
      - type: "Business critical (SAP, Oracle)"
        percentage: 30
        action: "Keep on MPLS"
        
      - type: "Collaboration (Voice, Video)"
        percentage: 25
        action: "Keep on MPLS with QoS"
        
      - type: "Cloud applications (O365, SaaS)"
        percentage: 35
        action: "Move to Direct Internet Access"
        
      - type: "General internet"
        percentage: 10
        action: "Move to Internet"
        
  optimization_plan:
    phase_1:
      action: "Enable Cloud OnRamp for O365"
      traffic_offload: "20%"
      mpls_reduction: "Consider bandwidth reduction"
      
    phase_2:
      action: "Enable SaaS DIA"
      traffic_offload: "15%"
      
    phase_3:
      action: "Right-size MPLS circuits"
      potential_savings: "$XX,XXX/month"
```

### Circuit Right-Sizing

```python
#!/usr/bin/env python3
"""
Circuit Cost Optimizer
Analyzes circuit utilization and recommends cost optimization
"""

import requests
from datetime import datetime, timedelta

class CircuitCostOptimizer:
    def __init__(self, vmanage_host, username, password):
        self.base_url = f"https://{vmanage_host}"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
        
        # Circuit pricing (monthly USD)
        self.circuit_pricing = {
            'mpls': {
                '100': 3000,
                '200': 4500,
                '500': 8000,
                '1000': 12000
            },
            'internet': {
                '100': 500,
                '200': 800,
                '500': 1500,
                '1000': 2500
            }
        }
        
    def authenticate(self, username, password):
        """Authenticate to vManage"""
        auth_url = f"{self.base_url}/j_security_check"
        payload = {'j_username': username, 'j_password': password}
        self.session.post(auth_url, data=payload)
        
        token_url = f"{self.base_url}/dataservice/client/token"
        token_response = self.session.get(token_url)
        if token_response.status_code == 200:
            self.session.headers['X-XSRF-TOKEN'] = token_response.text
            
    def get_utilization_data(self, device_id, days=30):
        """Get circuit utilization data"""
        end_time = datetime.now()
        start_time = end_time - timedelta(days=days)
        
        url = f"{self.base_url}/dataservice/statistics/interface/aggregation"
        params = {
            'startDate': start_time.strftime('%Y-%m-%dT%H:%M:%S'),
            'endDate': end_time.strftime('%Y-%m-%dT%H:%M:%S'),
            'deviceId': device_id,
            'count': 50000
        }
        
        response = self.session.get(url, params=params)
        return response.json() if response.status_code == 200 else None
        
    def analyze_circuit(self, device_id, interface, circuit_type, current_capacity, current_cost):
        """Analyze single circuit for optimization"""
        utilization_data = self.get_utilization_data(device_id)
        
        if not utilization_data or 'data' not in utilization_data:
            return None
            
        # Filter for specific interface
        interface_data = [
            d for d in utilization_data['data'] 
            if d.get('interface') == interface
        ]
        
        if not interface_data:
            return None
            
        # Calculate utilization metrics
        throughputs = [
            max(d.get('tx_kbps', 0), d.get('rx_kbps', 0)) 
            for d in interface_data
        ]
        
        avg_throughput_mbps = (sum(throughputs) / len(throughputs)) / 1000
        peak_throughput_mbps = max(throughputs) / 1000
        p95_throughput_mbps = sorted(throughputs)[int(len(throughputs) * 0.95)] / 1000
        
        # Calculate utilization percentages
        avg_util = (avg_throughput_mbps / current_capacity) * 100
        peak_util = (peak_throughput_mbps / current_capacity) * 100
        p95_util = (p95_throughput_mbps / current_capacity) * 100
        
        analysis = {
            'device_id': device_id,
            'interface': interface,
            'circuit_type': circuit_type,
            'current_capacity_mbps': current_capacity,
            'current_monthly_cost': current_cost,
            'utilization': {
                'average_percent': round(avg_util, 2),
                'peak_percent': round(peak_util, 2),
                'p95_percent': round(p95_util, 2),
                'avg_throughput_mbps': round(avg_throughput_mbps, 2),
                'peak_throughput_mbps': round(peak_throughput_mbps, 2)
            },
            'recommendation': None,
            'potential_savings': 0
        }
        
        # Generate recommendation
        if p95_util < 30:
            # Significantly over-provisioned
            recommended_capacity = self.get_next_lower_tier(current_capacity, circuit_type)
            if recommended_capacity:
                new_cost = self.circuit_pricing[circuit_type].get(str(recommended_capacity), current_cost)
                savings = current_cost - new_cost
                
                analysis['recommendation'] = {
                    'action': 'Downgrade circuit',
                    'from_capacity': current_capacity,
                    'to_capacity': recommended_capacity,
                    'from_cost': current_cost,
                    'to_cost': new_cost,
                    'monthly_savings': savings,
                    'annual_savings': savings * 12,
                    'risk': 'LOW - P95 utilization well below new capacity'
                }
                analysis['potential_savings'] = savings
                
        elif p95_util < 50:
            # Moderately over-provisioned
            analysis['recommendation'] = {
                'action': 'Monitor for potential downgrade',
                'reason': 'Utilization below 50% - evaluate in 90 days',
                'risk': 'MEDIUM - Ensure headroom for growth'
            }
            
        elif p95_util > 80:
            # Under-provisioned
            recommended_capacity = self.get_next_higher_tier(current_capacity, circuit_type)
            if recommended_capacity:
                new_cost = self.circuit_pricing[circuit_type].get(str(recommended_capacity), current_cost * 1.5)
                
                analysis['recommendation'] = {
                    'action': 'Upgrade circuit',
                    'from_capacity': current_capacity,
                    'to_capacity': recommended_capacity,
                    'from_cost': current_cost,
                    'to_cost': new_cost,
                    'monthly_increase': new_cost - current_cost,
                    'risk': 'HIGH - Current utilization exceeds safe threshold'
                }
        else:
            analysis['recommendation'] = {
                'action': 'No change needed',
                'reason': 'Utilization within optimal range (50-80%)'
            }
            
        return analysis
        
    def get_next_lower_tier(self, current, circuit_type):
        """Get next lower capacity tier"""
        tiers = sorted([int(t) for t in self.circuit_pricing[circuit_type].keys()])
        for i, tier in enumerate(tiers):
            if tier == current and i > 0:
                return tiers[i-1]
        return None
        
    def get_next_higher_tier(self, current, circuit_type):
        """Get next higher capacity tier"""
        tiers = sorted([int(t) for t in self.circuit_pricing[circuit_type].keys()])
        for i, tier in enumerate(tiers):
            if tier == current and i < len(tiers) - 1:
                return tiers[i+1]
        return None
        
    def generate_optimization_report(self, circuits):
        """Generate comprehensive optimization report"""
        report = {
            'generated_at': datetime.now().isoformat(),
            'analysis_period': '30 days',
            'circuits': [],
            'summary': {
                'total_circuits': 0,
                'over_provisioned': 0,
                'optimally_provisioned': 0,
                'under_provisioned': 0,
                'total_current_cost': 0,
                'potential_monthly_savings': 0,
                'potential_annual_savings': 0
            }
        }
        
        for circuit in circuits:
            analysis = self.analyze_circuit(
                circuit['device_id'],
                circuit['interface'],
                circuit['type'],
                circuit['capacity'],
                circuit['cost']
            )
            
            if analysis:
                report['circuits'].append(analysis)
                report['summary']['total_circuits'] += 1
                report['summary']['total_current_cost'] += circuit['cost']
                
                if analysis.get('potential_savings', 0) > 0:
                    report['summary']['over_provisioned'] += 1
                    report['summary']['potential_monthly_savings'] += analysis['potential_savings']
                elif analysis['recommendation'] and 'Upgrade' in str(analysis['recommendation'].get('action', '')):
                    report['summary']['under_provisioned'] += 1
                else:
                    report['summary']['optimally_provisioned'] += 1
                    
        report['summary']['potential_annual_savings'] = report['summary']['potential_monthly_savings'] * 12
        
        return report
        
    def format_report(self, report):
        """Format optimization report"""
        output = []
        output.append("=" * 70)
        output.append("CIRCUIT COST OPTIMIZATION REPORT")
        output.append("=" * 70)
        output.append(f"Generated: {report['generated_at']}")
        output.append(f"Analysis Period: {report['analysis_period']}")
        output.append("")
        
        output.append("EXECUTIVE SUMMARY")
        output.append("-" * 70)
        output.append(f"Total Circuits Analyzed: {report['summary']['total_circuits']}")
        output.append(f"Current Monthly Cost: ${report['summary']['total_current_cost']:,.0f}")
        output.append(f"Over-provisioned: {report['summary']['over_provisioned']}")
        output.append(f"Optimally Provisioned: {report['summary']['optimally_provisioned']}")
        output.append(f"Under-provisioned: {report['summary']['under_provisioned']}")
        output.append("")
        output.append(f"POTENTIAL SAVINGS:")
        output.append(f"  Monthly: ${report['summary']['potential_monthly_savings']:,.0f}")
        output.append(f"  Annual:  ${report['summary']['potential_annual_savings']:,.0f}")
        output.append("")
        
        # Recommendations
        savings_circuits = [c for c in report['circuits'] if c.get('potential_savings', 0) > 0]
        if savings_circuits:
            output.append("RECOMMENDED OPTIMIZATIONS")
            output.append("-" * 70)
            for circuit in sorted(savings_circuits, key=lambda x: x['potential_savings'], reverse=True):
                output.append(f"\n{circuit['device_id']} - {circuit['interface']}")
                output.append(f"  Type: {circuit['circuit_type'].upper()}")
                output.append(f"  Current: {circuit['current_capacity_mbps']} Mbps @ ${circuit['current_monthly_cost']}/month")
                output.append(f"  Utilization: Avg {circuit['utilization']['average_percent']}%, P95 {circuit['utilization']['p95_percent']}%")
                rec = circuit['recommendation']
                output.append(f"  Recommendation: {rec['action']}")
                output.append(f"  New Capacity: {rec['to_capacity']} Mbps @ ${rec['to_cost']}/month")
                output.append(f"  Monthly Savings: ${rec['monthly_savings']:,.0f}")
                output.append(f"  Risk: {rec['risk']}")
                
        output.append("\n" + "=" * 70)
        return "\n".join(output)


if __name__ == "__main__":
    optimizer = CircuitCostOptimizer(
        vmanage_host="10.100.1.10",
        username="admin",
        password="admin_password"
    )
    
    circuits = [
        {'device_id': 'mumbai-hub-edge01', 'interface': 'GigabitEthernet0/0/0', 'type': 'mpls', 'capacity': 1000, 'cost': 12000},
        {'device_id': 'bangalore-branch-edge01', 'interface': 'GigabitEthernet0/0/0', 'type': 'mpls', 'capacity': 200, 'cost': 4500},
        {'device_id': 'bangalore-branch-edge01', 'interface': 'GigabitEthernet0/0/1', 'type': 'internet', 'capacity': 100, 'cost': 500}
    ]
    
    report = optimizer.generate_optimization_report(circuits)
    print(optimizer.format_report(report))
```

---

## 6.17.3 License Optimization

### License Inventory Analysis

```yaml
license_optimization:
  current_licenses:
    dna_advantage:
      quantity: 854
      term: "3-year"
      monthly_per_device: 17.50
      total_monthly: 14945
      features_used:
        - "SD-WAN fabric"
        - "Application visibility"
        - "Security features"
        - "Cloud OnRamp"
      features_unused:
        - "ThousandEyes integration"
        - "Advanced analytics"
        
  optimization_opportunities:
    right_sizing:
      description: "Match license tier to actual usage"
      analysis:
        branch_sites:
          current_tier: "Advantage"
          required_features: "Basic SD-WAN + Security"
          recommended_tier: "Essentials"
          devices_affected: 12
          potential_savings: "$XXX/month per device"
          
    term_optimization:
      current_term: "3-year"
      alternative: "5-year"
      discount: "15%"
      annual_savings: "$XX,XXX"
      
    unused_licenses:
      count: 23
      reason: "Decommissioned devices"
      action: "Reassign or reduce renewal"
```

### License Cost Calculator

```python
#!/usr/bin/env python3
"""
License Cost Optimizer
Analyzes license utilization and recommends optimization
"""

class LicenseCostOptimizer:
    def __init__(self):
        # License pricing (monthly per device, USD)
        self.license_pricing = {
            'dna_essentials': {
                '1_year': 12.00,
                '3_year': 10.00,
                '5_year': 8.50
            },
            'dna_advantage': {
                '1_year': 21.00,
                '3_year': 17.50,
                '5_year': 14.88
            },
            'dna_premier': {
                '1_year': 35.00,
                '3_year': 29.17,
                '5_year': 24.79
            }
        }
        
        # Feature requirements by tier
        self.tier_features = {
            'dna_essentials': [
                'sd_wan_fabric',
                'basic_security',
                'basic_analytics'
            ],
            'dna_advantage': [
                'sd_wan_fabric',
                'basic_security',
                'basic_analytics',
                'advanced_security',
                'application_visibility',
                'cloud_onramp',
                'advanced_analytics'
            ],
            'dna_premier': [
                'sd_wan_fabric',
                'basic_security',
                'basic_analytics',
                'advanced_security',
                'application_visibility',
                'cloud_onramp',
                'advanced_analytics',
                'thousandeyes',
                'ai_analytics',
                'predictive_insights'
            ]
        }
        
    def analyze_license_needs(self, devices):
        """Analyze license needs based on feature requirements"""
        analysis = {
            'devices': [],
            'summary': {
                'total_devices': len(devices),
                'by_tier': {
                    'essentials': 0,
                    'advantage': 0,
                    'premier': 0
                },
                'current_monthly_cost': 0,
                'optimized_monthly_cost': 0,
                'potential_savings': 0
            }
        }
        
        for device in devices:
            device_analysis = {
                'hostname': device['hostname'],
                'site_type': device['site_type'],
                'current_tier': device['current_tier'],
                'current_term': device['current_term'],
                'features_used': device['features_used'],
                'recommended_tier': None,
                'current_cost': 0,
                'optimized_cost': 0,
                'savings': 0
            }
            
            # Determine minimum required tier
            required_tier = self.determine_minimum_tier(device['features_used'])
            device_analysis['recommended_tier'] = required_tier
            
            # Calculate costs
            current_cost = self.license_pricing[device['current_tier']][device['current_term']]
            optimized_cost = self.license_pricing[required_tier][device['current_term']]
            
            device_analysis['current_cost'] = current_cost
            device_analysis['optimized_cost'] = optimized_cost
            device_analysis['savings'] = current_cost - optimized_cost
            
            analysis['devices'].append(device_analysis)
            analysis['summary']['current_monthly_cost'] += current_cost
            analysis['summary']['optimized_monthly_cost'] += optimized_cost
            
            # Count by tier
            tier_key = required_tier.replace('dna_', '')
            analysis['summary']['by_tier'][tier_key] += 1
            
        analysis['summary']['potential_savings'] = (
            analysis['summary']['current_monthly_cost'] - 
            analysis['summary']['optimized_monthly_cost']
        )
        
        return analysis
        
    def determine_minimum_tier(self, features_used):
        """Determine minimum license tier for required features"""
        for tier in ['dna_essentials', 'dna_advantage', 'dna_premier']:
            tier_features = self.tier_features[tier]
            if all(f in tier_features for f in features_used):
                return tier
        return 'dna_premier'  # Default to highest if features not found
        
    def calculate_term_savings(self, devices, current_term, new_term):
        """Calculate savings from term extension"""
        current_cost = 0
        new_cost = 0
        
        for device in devices:
            tier = device.get('current_tier', 'dna_advantage')
            current_cost += self.license_pricing[tier][current_term]
            new_cost += self.license_pricing[tier][new_term]
            
        return {
            'current_term': current_term,
            'new_term': new_term,
            'current_monthly_cost': current_cost,
            'new_monthly_cost': new_cost,
            'monthly_savings': current_cost - new_cost,
            'annual_savings': (current_cost - new_cost) * 12
        }
        
    def generate_report(self, analysis):
        """Generate license optimization report"""
        output = []
        output.append("=" * 70)
        output.append("LICENSE COST OPTIMIZATION REPORT")
        output.append("=" * 70)
        output.append("")
        
        output.append("SUMMARY")
        output.append("-" * 70)
        output.append(f"Total Devices: {analysis['summary']['total_devices']}")
        output.append(f"Current Monthly Cost: ${analysis['summary']['current_monthly_cost']:,.2f}")
        output.append(f"Optimized Monthly Cost: ${analysis['summary']['optimized_monthly_cost']:,.2f}")
        output.append(f"Monthly Savings: ${analysis['summary']['potential_savings']:,.2f}")
        output.append(f"Annual Savings: ${analysis['summary']['potential_savings'] * 12:,.2f}")
        output.append("")
        
        output.append("RECOMMENDED TIER DISTRIBUTION")
        output.append("-" * 70)
        for tier, count in analysis['summary']['by_tier'].items():
            output.append(f"  DNA {tier.title()}: {count} devices")
        output.append("")
        
        # Devices with savings opportunity
        savings_devices = [d for d in analysis['devices'] if d['savings'] > 0]
        if savings_devices:
            output.append("OPTIMIZATION OPPORTUNITIES")
            output.append("-" * 70)
            for device in sorted(savings_devices, key=lambda x: x['savings'], reverse=True)[:10]:
                output.append(f"  {device['hostname']}:")
                output.append(f"    Current: {device['current_tier']} (${device['current_cost']}/mo)")
                output.append(f"    Recommended: {device['recommended_tier']} (${device['optimized_cost']}/mo)")
                output.append(f"    Savings: ${device['savings']}/mo")
                
        output.append("\n" + "=" * 70)
        return "\n".join(output)


if __name__ == "__main__":
    optimizer = LicenseCostOptimizer()
    
    # Sample devices
    devices = [
        {
            'hostname': 'mumbai-hub-edge01',
            'site_type': 'hub',
            'current_tier': 'dna_advantage',
            'current_term': '3_year',
            'features_used': ['sd_wan_fabric', 'advanced_security', 'application_visibility', 'cloud_onramp']
        },
        {
            'hostname': 'bangalore-branch-edge01',
            'site_type': 'branch',
            'current_tier': 'dna_advantage',
            'current_term': '3_year',
            'features_used': ['sd_wan_fabric', 'basic_security']  # Only needs Essentials
        }
    ]
    
    analysis = optimizer.analyze_license_needs(devices)
    print(optimizer.generate_report(analysis))
```

---

## 6.17.4 Operational Cost Optimization

### Automation ROI Analysis

```yaml
automation_roi:
  current_manual_tasks:
    device_provisioning:
      frequency: "20 per month"
      manual_hours: 4
      total_monthly_hours: 80
      hourly_rate: 75
      monthly_cost: 6000
      
    configuration_changes:
      frequency: "50 per month"
      manual_hours: 1
      total_monthly_hours: 50
      monthly_cost: 3750
      
    troubleshooting:
      frequency: "30 incidents per month"
      manual_hours: 2
      total_monthly_hours: 60
      monthly_cost: 4500
      
    reporting:
      frequency: "Weekly + Monthly"
      manual_hours: 8
      total_monthly_hours: 32
      monthly_cost: 2400
      
    total_manual_cost: 16650
    
  automation_investment:
    ztp_implementation:
      one_time_cost: 15000
      hours_saved_monthly: 60
      monthly_savings: 4500
      payback_months: 3.3
      
    ansible_automation:
      one_time_cost: 20000
      hours_saved_monthly: 40
      monthly_savings: 3000
      payback_months: 6.7
      
    automated_reporting:
      one_time_cost: 10000
      hours_saved_monthly: 25
      monthly_savings: 1875
      payback_months: 5.3
      
    total_investment: 45000
    total_monthly_savings: 9375
    total_annual_savings: 112500
    overall_payback: 4.8  # months
```

### NOC Efficiency Improvements

```yaml
noc_optimization:
  current_state:
    staff_count: 3
    coverage: "24x7 rotation"
    monthly_cost: 25000
    
  optimization_strategies:
    intelligent_alerting:
      description: "Reduce alert noise by 70%"
      implementation:
        - "Alert correlation"
        - "Threshold tuning"
        - "Maintenance window suppression"
      impact: "30% reduction in manual triage"
      
    self_healing_automation:
      description: "Auto-remediation for common issues"
      scenarios:
        - "Tunnel flap recovery"
        - "Certificate renewal"
        - "Memory cleanup"
      impact: "20% reduction in manual intervention"
      
    follow_the_sun:
      description: "Leverage global team coverage"
      current: "Single region NOC"
      proposed: "Follow-the-sun with EMEA/Americas"
      impact: "Potential 15% cost reduction"
```

---

## 6.17.5 Vendor Cost Optimization

### Contract Negotiation Strategies

```yaml
vendor_negotiation:
  circuit_providers:
    strategies:
      volume_discount:
        description: "Aggregate spend across sites"
        typical_discount: "10-15%"
        
      multi_year_commitment:
        description: "Commit to 2-3 year terms"
        typical_discount: "15-20%"
        
      competitive_bidding:
        description: "Obtain competing quotes"
        typical_discount: "10-25%"
        
    upcoming_renewals:
      - provider: "Tata Communications"
        renewal_date: "2026-06-30"
        current_spend: "$XX,XXX/month"
        negotiation_target: "15% reduction"
        
  cisco_licensing:
    strategies:
      enterprise_agreement:
        description: "EA for predictable pricing"
        benefits:
          - "Simplified management"
          - "Budget predictability"
          - "Volume discounts"
          
      buying_programs:
        description: "Leverage Cisco buying programs"
        programs:
          - "True Forward"
          - "Co-termination"
          
    optimization_actions:
      - "Consolidate license terms"
      - "Evaluate EA vs. à la carte"
      - "Right-size license tiers"
```

### Total Cost Comparison

```yaml
vendor_comparison:
  mpls_providers:
    tata_communications:
      current_spend: "$XX,XXX/month"
      strengths:
        - "Established relationship"
        - "Coverage in India"
        - "SLA performance"
      weaknesses:
        - "Premium pricing"
        
    alternative_providers:
      reliance_jio:
        estimated_cost: "$XX,XXX/month"
        savings: "$X,XXX/month"
        considerations:
          - "Migration effort"
          - "SLA comparison"
          - "Support quality"
          
      airtel_business:
        estimated_cost: "$XX,XXX/month"
        savings: "$X,XXX/month"
        
  recommendation:
    action: "Use quotes for negotiation"
    approach: "Negotiate with Tata using competitive quotes"
    target_savings: "$X,XXX-X,XXX/month"
```

---

## 6.17.6 Cost Optimization Tracking

### Monthly Cost Dashboard

```python
#!/usr/bin/env python3
"""
Cost Optimization Dashboard
Tracks and reports cost optimization progress
"""

from datetime import datetime
import json

class CostOptimizationDashboard:
    def __init__(self):
        self.cost_categories = {
            'wan_circuits': {
                'baseline': 60000,
                'current': 60000,
                'target': 48000,
                'savings_achieved': 0
            },
            'licenses': {
                'baseline': 20000,
                'current': 20000,
                'target': 16000,
                'savings_achieved': 0
            },
            'support': {
                'baseline': 8000,
                'current': 8000,
                'target': 7000,
                'savings_achieved': 0
            },
            'operations': {
                'baseline': 28000,
                'current': 28000,
                'target': 22000,
                'savings_achieved': 0
            }
        }
        
        self.initiatives = []
        
    def add_initiative(self, initiative):
        """Add cost optimization initiative"""
        self.initiatives.append({
            'id': f"OPT-{len(self.initiatives) + 1:03d}",
            'name': initiative['name'],
            'category': initiative['category'],
            'status': initiative.get('status', 'Planned'),
            'expected_savings': initiative['expected_savings'],
            'actual_savings': initiative.get('actual_savings', 0),
            'start_date': initiative.get('start_date'),
            'completion_date': initiative.get('completion_date'),
            'owner': initiative.get('owner')
        })
        
    def update_initiative(self, initiative_id, updates):
        """Update initiative status"""
        for init in self.initiatives:
            if init['id'] == initiative_id:
                init.update(updates)
                
                # Update category savings if completed
                if updates.get('status') == 'Completed' and updates.get('actual_savings'):
                    category = init['category']
                    self.cost_categories[category]['savings_achieved'] += updates['actual_savings']
                    self.cost_categories[category]['current'] -= updates['actual_savings']
                break
                
    def calculate_totals(self):
        """Calculate total costs and savings"""
        totals = {
            'baseline_monthly': sum(c['baseline'] for c in self.cost_categories.values()),
            'current_monthly': sum(c['current'] for c in self.cost_categories.values()),
            'target_monthly': sum(c['target'] for c in self.cost_categories.values()),
            'savings_achieved': sum(c['savings_achieved'] for c in self.cost_categories.values())
        }
        
        totals['baseline_annual'] = totals['baseline_monthly'] * 12
        totals['current_annual'] = totals['current_monthly'] * 12
        totals['target_annual'] = totals['target_monthly'] * 12
        totals['savings_annual'] = totals['savings_achieved'] * 12
        
        totals['progress_percent'] = (
            totals['savings_achieved'] / 
            (totals['baseline_monthly'] - totals['target_monthly']) * 100
        ) if totals['baseline_monthly'] > totals['target_monthly'] else 0
        
        return totals
        
    def generate_dashboard(self):
        """Generate cost optimization dashboard"""
        totals = self.calculate_totals()
        
        dashboard = {
            'generated_at': datetime.now().isoformat(),
            'period': datetime.now().strftime('%Y-%m'),
            'summary': {
                'baseline_monthly': totals['baseline_monthly'],
                'current_monthly': totals['current_monthly'],
                'target_monthly': totals['target_monthly'],
                'savings_to_date': totals['savings_achieved'],
                'remaining_opportunity': totals['baseline_monthly'] - totals['target_monthly'] - totals['savings_achieved'],
                'progress_percent': round(totals['progress_percent'], 1)
            },
            'by_category': {},
            'initiatives': self.initiatives
        }
        
        for category, data in self.cost_categories.items():
            dashboard['by_category'][category] = {
                'baseline': data['baseline'],
                'current': data['current'],
                'target': data['target'],
                'savings_achieved': data['savings_achieved'],
                'remaining_opportunity': data['baseline'] - data['target'] - data['savings_achieved'],
                'progress_percent': round(
                    data['savings_achieved'] / (data['baseline'] - data['target']) * 100
                    if data['baseline'] > data['target'] else 0, 1
                )
            }
            
        return dashboard
        
    def format_dashboard(self, dashboard):
        """Format dashboard for display"""
        output = []
        output.append("=" * 70)
        output.append("COST OPTIMIZATION DASHBOARD")
        output.append("=" * 70)
        output.append(f"Period: {dashboard['period']}")
        output.append(f"Generated: {dashboard['generated_at']}")
        output.append("")
        
        output.append("EXECUTIVE SUMMARY")
        output.append("-" * 70)
        s = dashboard['summary']
        output.append(f"Baseline Monthly Cost:    ${s['baseline_monthly']:>10,}")
        output.append(f"Current Monthly Cost:     ${s['current_monthly']:>10,}")
        output.append(f"Target Monthly Cost:      ${s['target_monthly']:>10,}")
        output.append(f"Savings Achieved:         ${s['savings_to_date']:>10,}")
        output.append(f"Remaining Opportunity:    ${s['remaining_opportunity']:>10,}")
        output.append(f"Progress to Target:       {s['progress_percent']:>10}%")
        output.append("")
        
        output.append("BY CATEGORY")
        output.append("-" * 70)
        output.append(f"{'Category':<20} {'Baseline':>10} {'Current':>10} {'Target':>10} {'Saved':>10} {'Progress':>10}")
        output.append("-" * 70)
        
        for category, data in dashboard['by_category'].items():
            output.append(
                f"{category:<20} "
                f"${data['baseline']:>9,} "
                f"${data['current']:>9,} "
                f"${data['target']:>9,} "
                f"${data['savings_achieved']:>9,} "
                f"{data['progress_percent']:>9}%"
            )
        output.append("")
        
        output.append("ACTIVE INITIATIVES")
        output.append("-" * 70)
        active = [i for i in dashboard['initiatives'] if i['status'] in ['In Progress', 'Planned']]
        for init in active[:5]:
            output.append(f"  {init['id']}: {init['name']}")
            output.append(f"    Status: {init['status']}, Expected Savings: ${init['expected_savings']:,}/month")
            
        output.append("\n" + "=" * 70)
        return "\n".join(output)


if __name__ == "__main__":
    dashboard = CostOptimizationDashboard()
    
    # Add initiatives
    dashboard.add_initiative({
        'name': 'MPLS Circuit Right-sizing',
        'category': 'wan_circuits',
        'expected_savings': 8000,
        'status': 'In Progress',
        'owner': 'Network Team'
    })
    
    dashboard.add_initiative({
        'name': 'License Tier Optimization',
        'category': 'licenses',
        'expected_savings': 3000,
        'status': 'Planned',
        'owner': 'IT Operations'
    })
    
    dashboard.add_initiative({
        'name': 'NOC Automation',
        'category': 'operations',
        'expected_savings': 5000,
        'status': 'In Progress',
        'owner': 'Operations Team'
    })
    
    # Update completed initiative
    dashboard.update_initiative('OPT-003', {
        'status': 'Completed',
        'actual_savings': 4500,
        'completion_date': '2025-01-15'
    })
    
    report = dashboard.generate_dashboard()
    print(dashboard.format_dashboard(report))
```

---

## 6.17.7 Cost Optimization Roadmap

### 12-Month Optimization Plan

```yaml
cost_optimization_roadmap:
  q1_2025:
    focus: "Quick wins and assessment"
    initiatives:
      - name: "Circuit utilization analysis"
        expected_savings: "$X,XXX/month"
        effort: "Low"
        
      - name: "License inventory cleanup"
        expected_savings: "$X,XXX/month"
        effort: "Low"
        
      - name: "Baseline cost tracking"
        expected_savings: "Foundation for future savings"
        effort: "Medium"
        
  q2_2025:
    focus: "Circuit optimization"
    initiatives:
      - name: "MPLS right-sizing"
        expected_savings: "$X,XXX/month"
        effort: "Medium"
        
      - name: "Cloud OnRamp expansion"
        expected_savings: "$X,XXX/month"
        effort: "Medium"
        
  q3_2025:
    focus: "License and operational optimization"
    initiatives:
      - name: "License tier optimization"
        expected_savings: "$X,XXX/month"
        effort: "Medium"
        
      - name: "NOC automation"
        expected_savings: "$X,XXX/month"
        effort: "High"
        
  q4_2025:
    focus: "Contract negotiations"
    initiatives:
      - name: "Circuit contract renegotiation"
        expected_savings: "$X,XXX/month"
        effort: "Medium"
        
      - name: "License EA evaluation"
        expected_savings: "$X,XXX/month"
        effort: "Low"
        
  total_projected_savings:
    monthly: "$XX,XXX"
    annual: "$XXX,XXX"
    percentage_reduction: "29%"
```

---

*Document version: 1.0*
*Last updated: 2025*
*Classification: Internal Use*
