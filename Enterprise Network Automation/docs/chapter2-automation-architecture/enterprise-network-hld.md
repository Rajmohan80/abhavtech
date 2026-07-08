# Enterprise Network Architecture — HLD

This page provides the high-level view of Abhavtech's enterprise network — the infrastructure that the automation framework targets. It shows what Cisco components exist at each site tier across all three regions.

!!! note "Scope"
    This is the **network** architecture (what exists on the wire). The automation toolchain that manages this infrastructure is covered in [2.2 Automation Architecture](architecture.md).

---

## Architecture Overview

<div style="overflow-x: auto; margin: 1.5em 0;">
<svg viewBox="0 0 1100 920" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:1100px; font-family:'Inter',Arial,sans-serif;">
  <defs>
    <linearGradient id="hdr" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#1B6CA0"/>
      <stop offset="100%" style="stop-color:#4AADE1"/>
    </linearGradient>
    <linearGradient id="apac_g" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#fff5f5"/>
      <stop offset="100%" style="stop-color:#fed7d7"/>
    </linearGradient>
    <linearGradient id="emea_g" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ebf8ff"/>
      <stop offset="100%" style="stop-color:#bee3f8"/>
    </linearGradient>
    <linearGradient id="amer_g" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#f0fff4"/>
      <stop offset="100%" style="stop-color:#c6f6d5"/>
    </linearGradient>
  </defs>

  <!-- ═══════════════════════════════════════════════════════
       LAYER 1: CLOUD & MANAGEMENT
  ════════════════════════════════════════════════════════════ -->
  <rect x="10" y="10" width="1080" height="30" rx="6" fill="url(#hdr)"/>
  <text x="550" y="30" text-anchor="middle" font-size="13" font-weight="700" fill="white">CLOUD SERVICES &amp; MANAGEMENT PLANE</text>

  <!-- SaaS -->
  <rect x="20" y="50" width="180" height="75" rx="8" fill="#ebf8ff" stroke="#4299e1" stroke-width="1.5"/>
  <text x="110" y="68" text-anchor="middle" font-size="11" font-weight="700" fill="#2c5282">SaaS Applications</text>
  <text x="110" y="84" text-anchor="middle" font-size="10" fill="#4a5568">Microsoft 365</text>
  <text x="110" y="97" text-anchor="middle" font-size="10" fill="#4a5568">Salesforce · Box</text>
  <text x="110" y="110" text-anchor="middle" font-size="10" fill="#4a5568">Internet Breakout (DIA)</text>

  <!-- Webex Cloud -->
  <rect x="215" y="50" width="200" height="75" rx="8" fill="#faf5ff" stroke="#9f7aea" stroke-width="1.5"/>
  <text x="315" y="68" text-anchor="middle" font-size="11" font-weight="700" fill="#553c9a">Webex Cloud (UC)</text>
  <text x="315" y="84" text-anchor="middle" font-size="10" fill="#4a5568">Calling — 3,200 users</text>
  <text x="315" y="97" text-anchor="middle" font-size="10" fill="#4a5568">Meetings · Messaging</text>
  <text x="315" y="110" text-anchor="middle" font-size="10" fill="#4a5568">Contact Center — 175 agents</text>

  <!-- Security Cloud -->
  <rect x="430" y="50" width="210" height="75" rx="8" fill="#fff5f5" stroke="#fc8181" stroke-width="1.5"/>
  <text x="535" y="68" text-anchor="middle" font-size="11" font-weight="700" fill="#c53030">Cisco Security Cloud</text>
  <text x="535" y="84" text-anchor="middle" font-size="10" fill="#4a5568">Umbrella SIG (DNS/SWG/CASB)</text>
  <text x="535" y="97" text-anchor="middle" font-size="10" fill="#4a5568">XDR · Duo MFA</text>
  <text x="535" y="110" text-anchor="middle" font-size="10" fill="#4a5568">FMC — NJ Primary / LON DR</text>

  <!-- Management Plane -->
  <rect x="655" y="50" width="215" height="75" rx="8" fill="#f0fff4" stroke="#68d391" stroke-width="1.5"/>
  <text x="762" y="68" text-anchor="middle" font-size="11" font-weight="700" fill="#276749">Management Plane</text>
  <text x="762" y="84" text-anchor="middle" font-size="10" fill="#4a5568">DNAC — 6 nodes (NJ + LON DR)</text>
  <text x="762" y="97" text-anchor="middle" font-size="10" fill="#4a5568">ISE — 14 nodes (2 PAN + 12 PSN)</text>
  <text x="762" y="110" text-anchor="middle" font-size="10" fill="#4a5568">vManage — Cloud HA cluster</text>

  <!-- SD-WAN Controllers -->
  <rect x="885" y="50" width="205" height="75" rx="8" fill="#fffaf0" stroke="#f6ad55" stroke-width="1.5"/>
  <text x="987" y="68" text-anchor="middle" font-size="11" font-weight="700" fill="#744210">SD-WAN Controllers</text>
  <text x="987" y="84" text-anchor="middle" font-size="10" fill="#4a5568">vSmart × 2 (Route Policy)</text>
  <text x="987" y="97" text-anchor="middle" font-size="10" fill="#4a5568">vBond × 2 (Orchestration)</text>
  <text x="987" y="110" text-anchor="middle" font-size="10" fill="#4a5568">24 × cEdge (ISR4451/4351)</text>

  <!-- Arrow down -->
  <line x1="550" y1="125" x2="550" y2="148" stroke="#a0aec0" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- ═══════════════════════════════════════════════════════
       LAYER 2: WAN TRANSPORT
  ════════════════════════════════════════════════════════════ -->
  <rect x="10" y="148" width="1080" height="28" rx="6" fill="#2d3748"/>
  <text x="550" y="167" text-anchor="middle" font-size="12" font-weight="700" fill="white">WAN TRANSPORT LAYER</text>

  <rect x="20"  y="185" width="230" height="50" rx="7" fill="#e6fffa" stroke="#38b2ac" stroke-width="1.5"/>
  <text x="135" y="205" text-anchor="middle" font-size="11" font-weight="700" fill="#234e52">SD-WAN IPsec Overlay</text>
  <text x="135" y="220" text-anchor="middle" font-size="10" fill="#4a5568">App-aware routing · QoS · FEC</text>

  <rect x="265" y="185" width="230" height="50" rx="7" fill="#f0fff4" stroke="#48bb78" stroke-width="1.5"/>
  <text x="380" y="205" text-anchor="middle" font-size="11" font-weight="700" fill="#22543d">MPLS (Primary)</text>
  <text x="380" y="220" text-anchor="middle" font-size="10" fill="#4a5568">Tata (APAC) · AT&amp;T (US) · BT (EMEA)</text>

  <rect x="510" y="185" width="230" height="50" rx="7" fill="#ebf8ff" stroke="#4299e1" stroke-width="1.5"/>
  <text x="625" y="205" text-anchor="middle" font-size="11" font-weight="700" fill="#2c5282">Internet DIA</text>
  <text x="625" y="220" text-anchor="middle" font-size="10" fill="#4a5568">SaaS breakout · Tunnel backup</text>

  <rect x="755" y="185" width="335" height="50" rx="7" fill="#fffaf0" stroke="#f6ad55" stroke-width="1.5"/>
  <text x="922" y="205" text-anchor="middle" font-size="11" font-weight="700" fill="#744210">5G / LTE Backup</text>
  <text x="922" y="220" text-anchor="middle" font-size="10" fill="#4a5568">Branch failover — activated only on WAN outage</text>

  <!-- Arrow down -->
  <line x1="550" y1="235" x2="550" y2="258" stroke="#a0aec0" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- ═══════════════════════════════════════════════════════
       LAYER 3: REGIONAL INFRASTRUCTURE
  ════════════════════════════════════════════════════════════ -->
  <rect x="10" y="258" width="1080" height="28" rx="6" fill="#2d3748"/>
  <text x="550" y="277" text-anchor="middle" font-size="12" font-weight="700" fill="white">REGIONAL INFRASTRUCTURE — 19 SITES (6 Hubs + 13 Branches)</text>

  <!-- ── APAC ── -->
  <rect x="10" y="295" width="350" height="355" rx="10" fill="url(#apac_g)" stroke="#fc8181" stroke-width="2"/>
  <text x="185" y="318" text-anchor="middle" font-size="13" font-weight="700" fill="#c53030">APAC REGION</text>

  <!-- Mumbai - Primary Hub -->
  <rect x="22" y="328" width="155" height="135" rx="7" fill="white" stroke="#c53030" stroke-width="1.5"/>
  <rect x="22" y="328" width="155" height="22" rx="7" fill="#c53030"/>
  <text x="99" y="343" text-anchor="middle" font-size="10" font-weight="700" fill="white">Mumbai — Primary Hub</text>
  <text x="35" y="364" font-size="9.5" fill="#4a5568">• SD-WAN Edge (C8500)</text>
  <text x="35" y="378" font-size="9.5" fill="#4a5568">• SD-Access Border/CP</text>
  <text x="35" y="392" font-size="9.5" fill="#4a5568">• FTD Firewall (FPR-4115 HA)</text>
  <text x="35" y="406" font-size="9.5" fill="#4a5568">• ISE PSN × 2</text>
  <text x="35" y="420" font-size="9.5" fill="#4a5568">• WLC C9800-80 (HA)</text>
  <text x="35" y="434" font-size="9.5" fill="#4a5568">• C9300/C9500 Fabric</text>
  <text x="35" y="448" font-size="9.5" fill="#e53e3e">• Data Center (Primary)</text>

  <!-- Chennai - Secondary Hub -->
  <rect x="185" y="328" width="165" height="135" rx="7" fill="white" stroke="#e53e3e" stroke-width="1.5"/>
  <rect x="185" y="328" width="165" height="22" rx="7" fill="#e53e3e"/>
  <text x="267" y="343" text-anchor="middle" font-size="10" font-weight="700" fill="white">Chennai — Secondary Hub</text>
  <text x="197" y="364" font-size="9.5" fill="#4a5568">• SD-WAN Edge (ISR4451)</text>
  <text x="197" y="378" font-size="9.5" fill="#4a5568">• SD-Access Border/CP</text>
  <text x="197" y="392" font-size="9.5" fill="#4a5568">• FTD Firewall (FPR-2130 HA)</text>
  <text x="197" y="406" font-size="9.5" fill="#4a5568">• ISE PSN × 2</text>
  <text x="197" y="420" font-size="9.5" fill="#4a5568">• WLC C9800-40 (HA)</text>
  <text x="197" y="434" font-size="9.5" fill="#4a5568">• C9300/C9500 Fabric</text>
  <text x="197" y="448" font-size="9.5" fill="#4a5568">• Data Center (DR)</text>

  <!-- APAC Branches -->
  <rect x="22" y="475" width="328" height="90" rx="7" fill="white" stroke="#feb2b2" stroke-width="1.5"/>
  <rect x="22" y="475" width="328" height="22" rx="7" fill="#feb2b2"/>
  <text x="186" y="490" text-anchor="middle" font-size="10" font-weight="700" fill="#742a2a">APAC Branches (3): Bangalore · Delhi · Noida</text>
  <text x="36" y="510" font-size="9.5" fill="#4a5568">• SD-WAN Edge (ISR1100 / ISR4351)</text>
  <text x="36" y="524" font-size="9.5" fill="#4a5568">• Fabric-in-a-Box (C9300-48UXM × 2)</text>
  <text x="36" y="538" font-size="9.5" fill="#4a5568">• Extended Nodes (C9200) · APs (C9120AXI)</text>
  <text x="36" y="552" font-size="9.5" fill="#4a5568">• 5G/LTE Backup · 802.1X via ISE PSN (hub)</text>

  <!-- SD-Access VN note APAC -->
  <rect x="22" y="575" width="328" height="66" rx="7" fill="#fff5f5" stroke="#fed7d7" stroke-width="1"/>
  <text x="186" y="591" text-anchor="middle" font-size="9.5" font-weight="700" fill="#c53030">SD-Access Fabric (All APAC Sites)</text>
  <text x="36" y="606" font-size="9" fill="#718096">VN_CORPORATE · VN_VOICE · VN_GUEST · VN_IOT · VN_SERVERS</text>
  <text x="36" y="619" font-size="9" fill="#718096">TrustSec SGTs enforced via ISE SGACL</text>
  <text x="36" y="632" font-size="9" fill="#718096">LISP/VXLAN overlay · C9500 Border Nodes</text>

  <!-- ── EMEA ── -->
  <rect x="375" y="295" width="350" height="355" rx="10" fill="url(#emea_g)" stroke="#63b3ed" stroke-width="2"/>
  <text x="550" y="318" text-anchor="middle" font-size="13" font-weight="700" fill="#2b6cb0">EMEA REGION</text>

  <!-- London - Primary Hub -->
  <rect x="387" y="328" width="155" height="145" rx="7" fill="white" stroke="#3182ce" stroke-width="1.5"/>
  <rect x="387" y="328" width="155" height="22" rx="7" fill="#3182ce"/>
  <text x="464" y="343" text-anchor="middle" font-size="10" font-weight="700" fill="white">London — Primary Hub</text>
  <text x="399" y="364" font-size="9.5" fill="#4a5568">• SD-WAN Edge (C8500)</text>
  <text x="399" y="378" font-size="9.5" fill="#4a5568">• SD-Access Border/CP</text>
  <text x="399" y="392" font-size="9.5" fill="#4a5568">• FTD Firewall (FPR-4115 HA)</text>
  <text x="399" y="406" font-size="9.5" fill="#4a5568">• ISE PAN (Secondary)</text>
  <text x="399" y="420" font-size="9.5" fill="#4a5568">• ISE PSN × 2</text>
  <text x="399" y="434" font-size="9.5" fill="#4a5568">• WLC C9800-80 (HA)</text>
  <text x="399" y="448" font-size="9.5" fill="#4a5568">• C9300/C9500 Fabric</text>
  <text x="399" y="462" font-size="9.5" fill="#2b6cb0">• DNAC DR Cluster (3-node)</text>

  <!-- Frankfurt -->
  <rect x="553" y="328" width="162" height="145" rx="7" fill="white" stroke="#4299e1" stroke-width="1.5"/>
  <rect x="553" y="328" width="162" height="22" rx="7" fill="#4299e1"/>
  <text x="634" y="343" text-anchor="middle" font-size="10" font-weight="700" fill="white">Frankfurt — Secondary Hub</text>
  <text x="565" y="364" font-size="9.5" fill="#4a5568">• SD-WAN Edge (ISR4451)</text>
  <text x="565" y="378" font-size="9.5" fill="#4a5568">• SD-Access Border/CP</text>
  <text x="565" y="392" font-size="9.5" fill="#4a5568">• FTD Firewall (FPR-2130 HA)</text>
  <text x="565" y="406" font-size="9.5" fill="#4a5568">• ISE PSN × 2</text>
  <text x="565" y="420" font-size="9.5" fill="#4a5568">• WLC C9800-40 (HA)</text>
  <text x="565" y="434" font-size="9.5" fill="#4a5568">• C9300/C9500 Fabric</text>
  <text x="565" y="448" font-size="9.5" fill="#4a5568">• FMC (Secondary)</text>

  <!-- EMEA Branches -->
  <rect x="387" y="485" width="328" height="80" rx="7" fill="white" stroke="#bee3f8" stroke-width="1.5"/>
  <rect x="387" y="485" width="328" height="22" rx="7" fill="#bee3f8"/>
  <text x="551" y="500" text-anchor="middle" font-size="10" font-weight="700" fill="#2a4365">EMEA Branches (5): Paris · Amsterdam · Dublin · Madrid · Milan</text>
  <text x="401" y="520" font-size="9.5" fill="#4a5568">• SD-WAN Edge (ISR1100 / ISR4351)</text>
  <text x="401" y="534" font-size="9.5" fill="#4a5568">• Fabric-in-a-Box (C9300) · APs (C9120AXI) · 5G/LTE Backup</text>
  <text x="401" y="548" font-size="9.5" fill="#4a5568">• 802.1X via ISE PSN (hub) · TrustSec SGT enforcement</text>

  <!-- SD-Access VN note EMEA -->
  <rect x="387" y="575" width="328" height="66" rx="7" fill="#ebf8ff" stroke="#bee3f8" stroke-width="1"/>
  <text x="551" y="591" text-anchor="middle" font-size="9.5" font-weight="700" fill="#2b6cb0">SD-Access Fabric (All EMEA Sites)</text>
  <text x="401" y="606" font-size="9" fill="#718096">VN_CORPORATE · VN_VOICE · VN_GUEST · VN_IOT · VN_SERVERS</text>
  <text x="401" y="619" font-size="9" fill="#718096">TrustSec SGTs enforced via ISE SGACL</text>
  <text x="401" y="632" font-size="9" fill="#718096">LISP/VXLAN overlay · C9500 Border Nodes</text>

  <!-- ── AMERICAS ── -->
  <rect x="740" y="295" width="350" height="355" rx="10" fill="url(#amer_g)" stroke="#68d391" stroke-width="2"/>
  <text x="915" y="318" text-anchor="middle" font-size="13" font-weight="700" fill="#276749">AMERICAS REGION</text>

  <!-- New Jersey - Global HQ -->
  <rect x="752" y="328" width="160" height="155" rx="7" fill="white" stroke="#276749" stroke-width="2"/>
  <rect x="752" y="328" width="160" height="22" rx="7" fill="#276749"/>
  <text x="832" y="343" text-anchor="middle" font-size="10" font-weight="700" fill="white">New Jersey — Global HQ ★</text>
  <text x="764" y="364" font-size="9.5" fill="#4a5568">• SD-WAN Edge (C8500)</text>
  <text x="764" y="378" font-size="9.5" fill="#4a5568">• SD-Access Border/CP</text>
  <text x="764" y="392" font-size="9.5" fill="#4a5568">• FTD Firewall (FPR-4115 HA)</text>
  <text x="764" y="406" font-size="9.5" fill="#4a5568">• ISE PAN (Primary)</text>
  <text x="764" y="420" font-size="9.5" fill="#4a5568">• ISE PSN × 2</text>
  <text x="764" y="434" font-size="9.5" fill="#4a5568">• WLC C9800-80 (HA)</text>
  <text x="764" y="448" font-size="9.5" fill="#4a5568">• C9300/C9500 Fabric</text>
  <text x="764" y="462" font-size="9.5" fill="#276749">• DNAC Primary (3-node XL)</text>
  <text x="764" y="476" font-size="9.5" fill="#276749">• FMC Primary · Data Center</text>

  <!-- Dallas -->
  <rect x="922" y="328" width="158" height="155" rx="7" fill="white" stroke="#48bb78" stroke-width="1.5"/>
  <rect x="922" y="328" width="158" height="22" rx="7" fill="#48bb78"/>
  <text x="1001" y="343" text-anchor="middle" font-size="10" font-weight="700" fill="white">Dallas — Secondary Hub</text>
  <text x="934" y="364" font-size="9.5" fill="#4a5568">• SD-WAN Edge (ISR4451)</text>
  <text x="934" y="378" font-size="9.5" fill="#4a5568">• SD-Access Border/CP</text>
  <text x="934" y="392" font-size="9.5" fill="#4a5568">• FTD Firewall (FPR-2130 HA)</text>
  <text x="934" y="406" font-size="9.5" fill="#4a5568">• ISE PSN × 2</text>
  <text x="934" y="420" font-size="9.5" fill="#4a5568">• WLC C9800-40 (HA)</text>
  <text x="934" y="434" font-size="9.5" fill="#4a5568">• C9300/C9500 Fabric</text>

  <!-- Americas Branches -->
  <rect x="752" y="495" width="328" height="80" rx="7" fill="white" stroke="#c6f6d5" stroke-width="1.5"/>
  <rect x="752" y="495" width="328" height="22" rx="7" fill="#c6f6d5"/>
  <text x="916" y="510" text-anchor="middle" font-size="10" font-weight="700" fill="#22543d">Americas Branches (5): Chicago · Seattle · LA · Atlanta · Denver</text>
  <text x="766" y="530" font-size="9.5" fill="#4a5568">• SD-WAN Edge (ISR1100 / ISR4351)</text>
  <text x="766" y="544" font-size="9.5" fill="#4a5568">• Fabric-in-a-Box (C9300) · APs (C9120AXI) · 5G/LTE Backup</text>
  <text x="766" y="558" font-size="9.5" fill="#4a5568">• 802.1X via ISE PSN (hub) · TrustSec SGT enforcement</text>

  <!-- SD-Access VN note Americas -->
  <rect x="752" y="585" width="328" height="56" rx="7" fill="#f0fff4" stroke="#c6f6d5" stroke-width="1"/>
  <text x="916" y="601" text-anchor="middle" font-size="9.5" font-weight="700" fill="#276749">SD-Access Fabric (All Americas Sites)</text>
  <text x="766" y="616" font-size="9" fill="#718096">VN_CORPORATE · VN_VOICE · VN_GUEST · VN_IOT · VN_SERVERS</text>
  <text x="766" y="629" font-size="9" fill="#718096">TrustSec SGTs enforced via ISE SGACL · LISP/VXLAN overlay</text>

  <!-- Arrow down -->
  <line x1="550" y1="658" x2="550" y2="675" stroke="#a0aec0" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- ═══════════════════════════════════════════════════════
       LAYER 4: VIRTUAL NETWORKS
  ════════════════════════════════════════════════════════════ -->
  <rect x="10" y="675" width="1080" height="28" rx="6" fill="#2d3748"/>
  <text x="550" y="694" text-anchor="middle" font-size="12" font-weight="700" fill="white">VIRTUAL NETWORKS — SD-ACCESS SEGMENTATION (ALL SITES)</text>

  <!-- VN boxes -->
  <rect x="20"  y="713" width="192" height="58" rx="7" fill="#ebf8ff" stroke="#4299e1" stroke-width="1.5"/>
  <text x="116" y="730" text-anchor="middle" font-size="10" font-weight="700" fill="#2c5282">VN_CORPORATE</text>
  <text x="116" y="745" text-anchor="middle" font-size="9" fill="#718096">10.100.0.0/16 · SGT 10-19</text>
  <text x="116" y="758" text-anchor="middle" font-size="9" fill="#718096">Employee workstations</text>

  <rect x="225" y="713" width="185" height="58" rx="7" fill="#faf5ff" stroke="#9f7aea" stroke-width="1.5"/>
  <text x="317" y="730" text-anchor="middle" font-size="10" font-weight="700" fill="#553c9a">VN_VOICE</text>
  <text x="317" y="745" text-anchor="middle" font-size="9" fill="#718096">10.190.0.0/16 · SGT 20</text>
  <text x="317" y="758" text-anchor="middle" font-size="9" fill="#718096">VoIP · Webex endpoints</text>

  <rect x="423" y="713" width="185" height="58" rx="7" fill="#fffaf0" stroke="#f6ad55" stroke-width="1.5"/>
  <text x="515" y="730" text-anchor="middle" font-size="10" font-weight="700" fill="#744210">VN_GUEST</text>
  <text x="515" y="745" text-anchor="middle" font-size="9" fill="#718096">10.200.0.0/16 · SGT 40</text>
  <text x="515" y="758" text-anchor="middle" font-size="9" fill="#718096">Visitor — Internet only</text>

  <rect x="621" y="713" width="185" height="58" rx="7" fill="#fff5f5" stroke="#fc8181" stroke-width="1.5"/>
  <text x="713" y="730" text-anchor="middle" font-size="10" font-weight="700" fill="#c53030">VN_IOT</text>
  <text x="713" y="745" text-anchor="middle" font-size="9" fill="#718096">10.150.0.0/16 · SGT 50-70</text>
  <text x="713" y="758" text-anchor="middle" font-size="9" fill="#718096">Cameras · Sensors · OT</text>

  <rect x="819" y="713" width="185" height="58" rx="7" fill="#f0fff4" stroke="#68d391" stroke-width="1.5"/>
  <text x="911" y="730" text-anchor="middle" font-size="10" font-weight="700" fill="#276749">VN_SERVERS</text>
  <text x="911" y="745" text-anchor="middle" font-size="9" fill="#718096">10.180.0.0/16 · SGT 80-90</text>
  <text x="911" y="758" text-anchor="middle" font-size="9" fill="#718096">DC workloads · Dev servers</text>

  <rect x="1017" y="713" width="73" height="58" rx="7" fill="#e2e8f0" stroke="#a0aec0" stroke-width="1.5"/>
  <text x="1053" y="730" text-anchor="middle" font-size="10" font-weight="700" fill="#4a5568">INFRA</text>
  <text x="1053" y="745" text-anchor="middle" font-size="9" fill="#718096">10.252/16</text>
  <text x="1053" y="758" text-anchor="middle" font-size="9" fill="#718096">Mgmt only</text>

  <!-- ═══════════════════════════════════════════════════════
       LEGEND
  ════════════════════════════════════════════════════════════ -->
  <rect x="10" y="785" width="1080" height="125" rx="8" fill="#f7fafc" stroke="#e2e8f0" stroke-width="1"/>
  <text x="550" y="804" text-anchor="middle" font-size="11" font-weight="700" fill="#2d3748">LEGEND &amp; KEY INVENTORY</text>

  <!-- Legend items -->
  <rect x="30"  y="815" width="12" height="12" rx="2" fill="#c53030"/>
  <text x="48"  y="826" font-size="9.5" fill="#4a5568">Primary Hub (C8500 Border · FPR-4115 · C9800-80 · ISE PSN)</text>
  <rect x="30"  y="835" width="12" height="12" rx="2" fill="#e53e3e"/>
  <text x="48"  y="846" font-size="9.5" fill="#4a5568">Secondary Hub (ISR4451 Edge · FPR-2130 · C9800-40 · ISE PSN)</text>
  <rect x="30"  y="855" width="12" height="12" rx="2" fill="#feb2b2"/>
  <text x="48"  y="866" font-size="9.5" fill="#4a5568">Branch (ISR1100/4351 SD-WAN · C9300 FiaB · C9200 Access · C9120 APs · 5G Backup)</text>

  <rect x="420" y="815" width="12" height="12" rx="2" fill="#276749"/>
  <text x="438" y="826" font-size="9.5" fill="#4a5568">NJ — Global HQ: DNAC Primary (3×XL) · ISE PAN Primary · FMC Primary</text>
  <rect x="420" y="835" width="12" height="12" rx="2" fill="#3182ce"/>
  <text x="438" y="846" font-size="9.5" fill="#4a5568">London — EMEA Hub: DNAC DR (3-node) · ISE PAN Secondary · FMC Secondary</text>
  <rect x="420" y="855" width="12" height="12" rx="2" fill="#f6ad55"/>
  <text x="438" y="866" font-size="9.5" fill="#4a5568">SD-WAN: vManage (cloud HA) · vSmart ×2 · vBond ×2 · 24 cEdge routers</text>

  <text x="30"  y="893" font-size="9.5" font-weight="700" fill="#2d3748">Total: </text>
  <text x="62"  y="893" font-size="9.5" fill="#718096">19 sites · 12,400 users · 238 C9300 access switches · 590 APs · 18 FTD firewalls · 14 ISE nodes · 6 DNAC nodes</text>

  <!-- Arrow defs -->
  <defs>
    <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
      <path d="M0,0 L0,6 L6,3 z" fill="#a0aec0"/>
    </marker>
  </defs>
</svg>
</div>

---

## Component Summary by Site Tier

| Component | Global HQ (NJ) | Primary Hub | Secondary Hub | Branch |
|-----------|---------------|-------------|---------------|--------|
| **SD-WAN Edge** | C8500 | C8500 | ISR 4451 | ISR 1100 / 4351 |
| **Firewall (FTD)** | FPR-4115 HA | FPR-4115 HA | FPR-2130 HA | — |
| **SD-Access** | C9500 Border + CP | C9500 Border + CP | C9500 Border + CP | C9300 FiaB |
| **Wireless** | C9800-80 HA | C9800-80 HA | C9800-40 HA | C9120 APs |
| **Identity (ISE)** | PAN Primary + PSN×2 | PSN × 2 | PSN × 2 | Via hub PSN |
| **DNAC** | 3-node XL (Primary) | — | — | — |
| **DNAC DR** | — | — | London only | — |
| **FMC** | Primary | — | London (DR) | — |
| **vManage** | Cloud HA cluster | — | — | — |
| **WAN Backup** | MPLS + Internet | MPLS + Internet | MPLS + Internet | 5G / LTE |

---

## Virtual Network Segmentation

All sites run the same SD-Access VN model. Inter-VN routing occurs only at Border Nodes. Policy enforcement is via ISE TrustSec SGACL.

| Virtual Network | Subnet | VNI | SGT Range | Access |
|-----------------|--------|-----|-----------|--------|
| VN_CORPORATE | 10.100.0.0/16 | 8001 | 10–19 | Employee workstations |
| VN_VOICE | 10.190.0.0/16 | 8005 | 20 | VoIP · Webex endpoints |
| VN_GUEST | 10.200.0.0/16 | 8002 | 40 | Internet-only |
| VN_IOT | 10.150.0.0/16 | 8003 | 50–70 | Cameras · Sensors · OT |
| VN_SERVERS | 10.180.0.0/16 | 8004 | 80–90 | DC workloads |
| INFRA_VN | 10.252.0.0/16 | — | Mgmt | Network management |

---

!!! tip "Next Step"
    See [2.2 Automation Architecture](architecture.md) for how Terraform, Ansible, and Python manage this infrastructure through the automation control node.
