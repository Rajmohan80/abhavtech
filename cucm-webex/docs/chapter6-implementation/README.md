# Implementation & Deployment

This chapter provides step-by-step procedures for implementing Webex Calling and Contact Center, including Control Hub configuration, PSTN setup, and ready-to-use configuration templates.

## Chapter Overview

### Sections

**[6.1 Control Hub Setup ->](control-hub-setup.md)**  
Complete implementation guide including Control Hub initial setup, PSTN configuration (Local Gateway and CCPP), and configuration templates for India Zone/Edge, LGW CUBE, and route groups

**[6.2 PSTN Configuration ->](pstn-configuration.md)**  
PSTN connectivity setup by region, trunk configuration, route group assignments, emergency services

**[6.3 Configuration Templates ->](configuration-templates.md)**  
Ready-to-use templates for India LGW CUBE, Zone/Edge, Control Hub settings, dial plan configuration

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)

**Control Hub Setup**:
- [ ] Create organization and activate trial/production licenses
- [ ] Configure calling regions (APAC, UK, EU, US)
- [ ] Create Webex locations matching physical sites
- [ ] Configure number management and DID ranges

**Directory Integration**:
- [ ] Azure AD / LDAP integration
- [ ] User provisioning and synchronization
- [ ] Group assignments and access policies

### Phase 2: PSTN Integration (Weeks 3-4)

**India - Local Gateway Deployment**:
- [ ] Deploy ISR 4K routers per telecom circle
- [ ] Configure CUBE for SIP trunking to Tata/Airtel
- [ ] Deploy Webex Zone and Trusted Network Edge
- [ ] Configure trunk groups and route lists
- [ ] Test PSTN connectivity and toll bypass compliance

**EMEA/Americas - Cloud Connected PSTN**:
- [ ] Order CCPP service from IntelePeer (UK/EU/US)
- [ ] Configure trunk groups in Control Hub
- [ ] Port existing DID numbers
- [ ] Test PSTN connectivity

### Phase 3: Features & Policies (Weeks 5-6)

**User Features**:
- [ ] Configure voicemail settings
- [ ] Enable call forwarding and simultaneous ring
- [ ] Set up hunt groups and call queues
- [ ] Configure paging groups
- [ ] Enable mobile integration (Webex Go)

**Call Policies**:
- [ ] Outbound calling permissions
- [ ] International calling restrictions
- [ ] Call recording policies (where applicable)
- [ ] Emergency services configuration

---

## India-Specific Implementation

### Local Gateway Deployment (Per Telecom Circle)

**Hardware Requirements**:

| Circle | Router Model | Licenses | PSTN Provider |
|--------|-------------|----------|---------------|
| Mumbai | ISR 4451-X | CUBE + DNA | Tata/Airtel |
| Tamil Nadu | ISR 4351 | CUBE + DNA | Tata |
| Karnataka | ISR 4331 | CUBE + DNA | Tata |
| Delhi | ISR 4331 | CUBE + DNA | Tata |
| UP West | ISR 4331 | CUBE + DNA | Tata |
| AP/Telangana | ISR 4331 | CUBE + DNA | Tata |

**Zone/Edge Components**:
- **Webex Zone**: Virtual appliance (OVA) deployed on-premises
- **Trusted Network Edge**: Public IP for PSTN egress
- **SIP Trunks**: To PSTN provider per circle

### Configuration Template Example

```
! ISR 4331 CUBE Configuration for Mumbai Circle
voice service voip
 ip address trusted list
  ipv4 <webex-zone-IP>
  ipv4 <tata-sip-trunk-IP>
 allow-connections sip to sip
 fax protocol t38 version 0 ls-redundancy 0 hs-redundancy 0
 sip
  early-offer forced
```

---

## EMEA/Americas Implementation

### Cloud Connected PSTN Setup

**Configuration Steps**:

1. **Order CCPP Service**
   - Select regional provider (IntelePeer UK/EU/US)
   - Specify DID quantities and number types
   - Request E911/emergency services provisioning

2. **Control Hub Configuration**
   - Add CCPP trunk group
   - Assign trunk to locations
   - Configure outbound routing

3. **Number Porting** (if migrating existing DIDs)
   - Submit LOA (Letter of Authorization)
   - Schedule port date
   - Test ported numbers before cutover

---

## Configuration Templates

### Included Templates

**Appendix H** contains ready-to-use templates for:

- India LGW CUBE configuration (per ISR model)
- Webex Zone deployment guide
- Control Hub location settings
- Route group and route list configuration
- Emergency services configuration (India/UK/EU/US)
- Dial plan templates

---

## Implementation Validation

Before proceeding to migration:

- [ ] Control Hub organization fully configured
- [ ] All Webex locations created and validated
- [ ] PSTN connectivity tested (inbound and outbound calls)
- [ ] India toll bypass compliance validated
- [ ] Emergency services tested
- [ ] User features tested
- [ ] Policies and restrictions validated

---

## Next Steps

1. Review [Migration Execution](../chapter7-migration/README.md) for cutover procedures
2. Review **Appendix H** for detailed configuration templates
3. Begin pilot user testing before full migration
