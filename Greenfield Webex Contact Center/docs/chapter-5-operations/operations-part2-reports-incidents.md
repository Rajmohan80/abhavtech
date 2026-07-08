# Part 2: Reports, Proactive Detection & Incident Management

**Document Version:** 1.0  
**Date:** March 2026  
**Project:** KidsWear India - Cisco Webex Contact Center Deployment  
**Document Type:** Low-Level Design - Operations Guide  

---

## 5. Weekly & Monthly Reports

### 5.1 Overview

Automated reporting provides stakeholders with insights into contact center performance, trends, and areas for improvement. Reports are generated automatically and distributed via email.

**Report Types:**

| Report | Frequency | Recipients | Delivery Method |
|--------|-----------|------------|-----------------|
| Daily Snapshot | Daily (9 AM) | Operations Manager | Email |
| Weekly Performance | Monday (8 AM) | Ops Manager, Team Leads | Email + Dashboard |
| Monthly Executive | 1st of month | Leadership Team | Email (PDF) |
| Agent Scorecards | Monthly | Agents (individual) | Email |

---

### 5.2 Daily Snapshot Report

**Purpose:** Quick health check of previous day's operations

**Metrics Included:**

1. **Call Volume:**
   - Total calls received
   - Calls answered vs. abandoned
   - Peak hour call volume
   - Comparison to previous day

2. **Service Levels:**
   - Overall service level (% answered < 30s)
   - By queue breakdown
   - SLA compliance rate

3. **Agent Performance:**
   - Agents logged in
   - Average handle time
   - Average occupancy
   - Attendance rate

4. **Customer Satisfaction:**
   - CSAT score
   - Number of surveys completed
   - Detractor count (ratings 1-2)

**SQL Query - Daily Summary:**
```sql
WITH daily_stats AS (
    SELECT 
        DATE(call_start_time) AS call_date,
        COUNT(*) AS total_calls,
        SUM(CASE WHEN abandoned = false THEN 1 ELSE 0 END) AS answered_calls,
        SUM(CASE WHEN abandoned = true THEN 1 ELSE 0 END) AS abandoned_calls,
        ROUND(AVG(handle_time_seconds)) AS avg_handle_time,
        ROUND(AVG(wait_time_seconds)) AS avg_wait_time,
        SUM(CASE WHEN wait_time_seconds <= 30 AND abandoned = false THEN 1 ELSE 0 END)::FLOAT / 
            NULLIF(SUM(CASE WHEN abandoned = false THEN 1 ELSE 0 END), 0) * 100 AS service_level
    FROM calls
    WHERE call_start_time >= CURRENT_DATE - INTERVAL '1 day'
      AND call_start_time < CURRENT_DATE
    GROUP BY DATE(call_start_time)
),
csat_stats AS (
    SELECT 
        ROUND(AVG(csat_rating), 2) AS avg_csat,
        COUNT(*) AS total_responses,
        SUM(CASE WHEN csat_rating <= 2 THEN 1 ELSE 0 END) AS detractors
    FROM csat_responses
    WHERE timestamp >= CURRENT_DATE - INTERVAL '1 day'
      AND timestamp < CURRENT_DATE
)
SELECT 
    d.call_date,
    d.total_calls,
    d.answered_calls,
    d.abandoned_calls,
    ROUND(d.abandoned_calls::FLOAT / NULLIF(d.total_calls, 0) * 100, 2) AS abandonment_rate,
    d.avg_handle_time,
    d.avg_wait_time,
    d.service_level,
    c.avg_csat,
    c.total_responses AS csat_responses,
    c.detractors
FROM daily_stats d
CROSS JOIN csat_stats c;
```

**Python Report Generator (daily_report.py):**
```python
#!/usr/bin/env python3
import psycopg2
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta

DB_CONFIG = {
    'host': 'localhost',
    'database': 'cc_operations',
    'user': 'cc_admin',
    'password': 'YourSecurePassword123!'
}

SMTP_CONFIG = {
    'server': 'smtp.gmail.com',
    'port': 587,
    'username': 'reports@kidswear.com',
    'password': 'YourEmailPassword'
}

def generate_daily_report():
    """Generate and email daily snapshot report"""
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
# Execute daily summary query
    cur.execute("""
        -- (Same SQL query as above)
        WITH daily_stats AS (
            SELECT 
                DATE(call_start_time) AS call_date,
                COUNT(*) AS total_calls,
                SUM(CASE WHEN abandoned = false THEN 1 ELSE 0 END) AS answered_calls,
                SUM(CASE WHEN abandoned = true THEN 1 ELSE 0 END) AS abandoned_calls,
                ROUND(AVG(handle_time_seconds)) AS avg_handle_time,
                ROUND(AVG(wait_time_seconds)) AS avg_wait_time,
                SUM(CASE WHEN wait_time_seconds <= 30 AND abandoned = false THEN 1 ELSE 0 END)::FLOAT / 
                    NULLIF(SUM(CASE WHEN abandoned = false THEN 1 ELSE 0 END), 0) * 100 AS service_level
            FROM calls
            WHERE call_start_time >= CURRENT_DATE - INTERVAL '1 day'
              AND call_start_time < CURRENT_DATE
            GROUP BY DATE(call_start_time)
        ),
        csat_stats AS (
            SELECT 
                ROUND(AVG(csat_rating), 2) AS avg_csat,
                COUNT(*) AS total_responses,
                SUM(CASE WHEN csat_rating <= 2 THEN 1 ELSE 0 END) AS detractors
            FROM csat_responses
            WHERE timestamp >= CURRENT_DATE - INTERVAL '1 day'
              AND timestamp < CURRENT_DATE
        )
        SELECT 
            d.call_date,
            d.total_calls,
            d.answered_calls,
            d.abandoned_calls,
            ROUND(d.abandoned_calls::FLOAT / NULLIF(d.total_calls, 0) * 100, 2) AS abandonment_rate,
            d.avg_handle_time,
            d.avg_wait_time,
            d.service_level,
            c.avg_csat,
            c.total_responses AS csat_responses,
            c.detractors
        FROM daily_stats d
        CROSS JOIN csat_stats c;
    """)
    
    row = cur.fetchone()
    
    if not row:
        print("No data for yesterday")
        cur.close()
        conn.close()
        return
    
# Parse results
    (call_date, total_calls, answered_calls, abandoned_calls, 
     abandonment_rate, avg_handle_time, avg_wait_time, service_level,
     avg_csat, csat_responses, detractors) = row
    
# Generate HTML email
    html_body = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; }}
            .header {{ background-color: #007bff; color: white; padding: 20px; }}
            .metric {{ padding: 15px; margin: 10px 0; border-left: 4px solid #007bff; background: #f8f9fa; }}
            .metric-title {{ font-weight: bold; color: #555; }}
            .metric-value {{ font-size: 24px; color: #007bff; }}
            .good {{ color: #28a745; }}
            .warning {{ color: #ffc107; }}
            .bad {{ color: #dc3545; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>📊 Daily Snapshot - {call_date}</h1>
            <p>KidsWear Contact Center</p>
        </div>
        
        <div class="metric">
            <div class="metric-title">Total Calls</div>
            <div class="metric-value">{total_calls:,}</div>
            <div>Answered: {answered_calls:,} | Abandoned: {abandoned_calls}</div>
        </div>
        
        <div class="metric">
            <div class="metric-title">Service Level (% answered < 30s)</div>
            <div class="metric-value {'good' if service_level >= 80 else 'warning' if service_level >= 70 else 'bad'}">
                {service_level:.1f}%
            </div>
            <div>Target: 80%</div>
        </div>
        
        <div class="metric">
            <div class="metric-title">Abandonment Rate</div>
            <div class="metric-value {'good' if abandonment_rate <= 5 else 'warning' if abandonment_rate <= 8 else 'bad'}">
                {abandonment_rate:.1f}%
            </div>
            <div>Target: < 5%</div>
        </div>
        
        <div class="metric">
            <div class="metric-title">Average Handle Time</div>
            <div class="metric-value">{avg_handle_time // 60}m {avg_handle_time % 60}s</div>
            <div>Target: 4-6 minutes</div>
        </div>
        
        <div class="metric">
            <div class="metric-title">Average Wait Time</div>
            <div class="metric-value {'good' if avg_wait_time <= 30 else 'warning' if avg_wait_time <= 60 else 'bad'}">
                {avg_wait_time}s
            </div>
            <div>Target: < 30 seconds</div>
        </div>
        
        <div class="metric">
            <div class="metric-title">Customer Satisfaction (CSAT)</div>
            <div class="metric-value {'good' if avg_csat >= 4.0 else 'warning' if avg_csat >= 3.5 else 'bad'}">
                {avg_csat}/5.0
            </div>
            <div>Responses: {csat_responses} | Detractors: {detractors}</div>
        </div>
        
        <hr>
        <p><small>Generated automatically at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</small></p>
    </body>
    </html>
    """
    
# Send email
    send_email(
        to=['ops-manager@kidswear.com'],
        subject=f'Daily Snapshot - {call_date}',
        html_body=html_body
    )
    
    cur.close()
    conn.close()
    print(f'Daily report sent for {call_date}')

def send_email(to, subject, html_body):
    """Send HTML email via SMTP"""
    msg = MIMEMultipart('alternative')
    msg['From'] = SMTP_CONFIG['username']
    msg['To'] = ', '.join(to)
    msg['Subject'] = subject
    
    html_part = MIMEText(html_body, 'html')
    msg.attach(html_part)
    
    try:
        server = smtplib.SMTP(SMTP_CONFIG['server'], SMTP_CONFIG['port'])
        server.starttls()
        server.login(SMTP_CONFIG['username'], SMTP_CONFIG['password'])
        server.send_message(msg)
        server.quit()
        print(f'Email sent to {", ".join(to)}')
    except Exception as e:
        print(f'ERROR sending email: {e}')

if __name__ == '__main__':
    generate_daily_report()
```

**Cron Job (Daily at 9 AM):**
```bash
0 9 * * * /usr/bin/python3 /opt/cc-dashboard/reports/daily_report.py
```

---

### 5.3 Weekly Performance Report

**Purpose:** Comprehensive analysis of weekly trends and team performance

**Sections:**

1. **Executive Summary**
   - Week-over-week comparison
   - Key achievements
   - Areas of concern

2. **Call Center Metrics**
   - Daily call volume trend
   - Service level by queue
   - Abandonment rate analysis
   - Peak hour analysis

3. **Agent Performance**
   - Top 10 performers
   - Bottom 5 (for coaching)
   - Team average metrics
   - Attendance summary

4. **Customer Satisfaction**
   - Weekly CSAT trend
   - Promoters vs. detractors
   - Common feedback themes

5. **IVR Performance**
   - Self-service rate
   - Top intents
   - Fallback analysis

**SQL Query - Weekly Summary:**
```sql
-- Call volume by day of week
WITH weekly_calls AS (
    SELECT 
        TO_CHAR(call_start_time, 'Day') AS day_of_week,
        DATE(call_start_time) AS call_date,
        COUNT(*) AS total_calls,
        SUM(CASE WHEN abandoned = false THEN 1 ELSE 0 END) AS answered,
        ROUND(AVG(handle_time_seconds)) AS avg_aht,
        SUM(CASE WHEN wait_time_seconds <= 30 AND abandoned = false THEN 1 ELSE 0 END)::FLOAT / 
            NULLIF(SUM(CASE WHEN abandoned = false THEN 1 ELSE 0 END), 0) * 100 AS service_level
    FROM calls
    WHERE call_start_time >= DATE_TRUNC('week', CURRENT_DATE - INTERVAL '1 week')
      AND call_start_time < DATE_TRUNC('week', CURRENT_DATE)
    GROUP BY TO_CHAR(call_start_time, 'Day'), DATE(call_start_time)
    ORDER BY call_date
),
-- Agent performance
agent_perf AS (
    SELECT 
        agent_name,
        SUM(total_calls) AS calls_handled,
        ROUND(AVG(avg_handle_time_seconds)) AS avg_aht,
        ROUND(AVG(occupancy_rate), 1) AS occupancy
    FROM agent_performance_daily
    WHERE performance_date >= DATE_TRUNC('week', CURRENT_DATE - INTERVAL '1 week')
      AND performance_date < DATE_TRUNC('week', CURRENT_DATE)
    GROUP BY agent_name
),
-- CSAT
weekly_csat AS (
    SELECT 
        DATE(timestamp) AS response_date,
        ROUND(AVG(csat_rating), 2) AS avg_csat,
        COUNT(*) AS responses
    FROM csat_responses
    WHERE timestamp >= DATE_TRUNC('week', CURRENT_DATE - INTERVAL '1 week')
      AND timestamp < DATE_TRUNC('week', CURRENT_DATE)
    GROUP BY DATE(timestamp)
    ORDER BY response_date
)
SELECT 
    'Weekly Summary' AS report_type,
    (SELECT SUM(total_calls) FROM weekly_calls) AS total_calls_week,
    (SELECT ROUND(AVG(service_level), 2) FROM weekly_calls) AS avg_service_level,
    (SELECT ROUND(AVG(avg_csat), 2) FROM weekly_csat) AS avg_csat_week;
```

**Python Weekly Report Generator:**
```python
#!/usr/bin/env python3
import psycopg2
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime, timedelta
from io import BytesIO
import base64

DB_CONFIG = {
    'host': 'localhost',
    'database': 'cc_operations',
    'user': 'cc_admin',
    'password': 'YourSecurePassword123!'
}

def generate_weekly_report():
    """Generate comprehensive weekly report with charts"""
    conn = psycopg2.connect(**DB_CONFIG)
    
# Date range (last complete week: Monday to Sunday)
    today = datetime.now().date()
    end_date = today - timedelta(days=today.weekday() + 1)  # Last Sunday
    start_date = end_date - timedelta(days=6)  # Previous Monday
    
# Get weekly call volume
    df_calls = pd.read_sql("""
        SELECT 
            DATE(call_start_time) AS call_date,
            COUNT(*) AS total_calls,
            SUM(CASE WHEN abandoned = false THEN 1 ELSE 0 END) AS answered,
            SUM(CASE WHEN abandoned = true THEN 1 ELSE 0 END) AS abandoned,
            ROUND(AVG(handle_time_seconds)) AS avg_aht,
            SUM(CASE WHEN wait_time_seconds <= 30 AND abandoned = false THEN 1 ELSE 0 END)::FLOAT / 
                NULLIF(SUM(CASE WHEN abandoned = false THEN 1 ELSE 0 END), 0) * 100 AS service_level
        FROM calls
        WHERE call_start_time >= %s AND call_start_time < %s
        GROUP BY DATE(call_start_time)
        ORDER BY call_date
    """, conn, params=(start_date, end_date + timedelta(days=1)))
    
# Get agent performance
    df_agents = pd.read_sql("""
        SELECT 
            agent_name,
            SUM(total_calls) AS calls_handled,
            ROUND(AVG(avg_handle_time_seconds)) AS avg_aht,
            ROUND(AVG(occupancy_rate), 1) AS occupancy
        FROM agent_performance_daily
        WHERE performance_date >= %s AND performance_date <= %s
        GROUP BY agent_name
        ORDER BY calls_handled DESC
    """, conn, params=(start_date, end_date))
    
# Get CSAT data
    df_csat = pd.read_sql("""
        SELECT 
            DATE(timestamp) AS response_date,
            ROUND(AVG(csat_rating), 2) AS avg_csat,
            COUNT(*) AS responses
        FROM csat_responses
        WHERE timestamp >= %s AND timestamp < %s
        GROUP BY DATE(timestamp)
        ORDER BY response_date
    """, conn, params=(start_date, end_date + timedelta(days=1)))
    
# Generate charts
    call_volume_chart = create_call_volume_chart(df_calls)
    service_level_chart = create_service_level_chart(df_calls)
    csat_chart = create_csat_chart(df_csat)
    
# Calculate summary statistics
    total_calls = df_calls['total_calls'].sum()
    avg_service_level = df_calls['service_level'].mean()
    avg_csat = df_csat['avg_csat'].mean()
    
# Top 10 agents
    top_agents = df_agents.head(10)
    bottom_agents = df_agents.tail(5)
    
# Generate HTML report
    html_report = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 20px; }}
            .header {{ background: linear-gradient(135deg, #007bff, #0056b3); 
                       color: white; padding: 30px; text-align: center; }}
            .summary {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }}
            .summary-card {{ background: #f8f9fa; padding: 20px; border-left: 4px solid #007bff; }}
            .summary-value {{ font-size: 36px; font-weight: bold; color: #007bff; }}
            table {{ border-collapse: collapse; width: 100%; margin: 20px 0; }}
            th {{ background-color: #007bff; color: white; padding: 12px; text-align: left; }}
            td {{ border: 1px solid #ddd; padding: 10px; }}
            tr:nth-child(even) {{ background-color: #f2f2f2; }}
            .chart {{ margin: 30px 0; text-align: center; }}
            h2 {{ color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>📊 Weekly Performance Report</h1>
            <p>{start_date.strftime('%B %d')} - {end_date.strftime('%B %d, %Y')}</p>
        </div>
        
        <h2>Executive Summary</h2>
        <div class="summary">
            <div class="summary-card">
                <div>Total Calls</div>
                <div class="summary-value">{total_calls:,}</div>
            </div>
            <div class="summary-card">
                <div>Avg Service Level</div>
                <div class="summary-value">{avg_service_level:.1f}%</div>
            </div>
            <div class="summary-card">
                <div>Avg CSAT</div>
                <div class="summary-value">{avg_csat:.2f}/5.0</div>
            </div>
        </div>
        
        <h2>Call Volume Trend</h2>
        <div class="chart">
            <img src="data:image/png;base64,{call_volume_chart}" width="800">
        </div>
        
        <h2>Service Level Performance</h2>
        <div class="chart">
            <img src="data:image/png;base64,{service_level_chart}" width="800">
        </div>
        
        <h2>Customer Satisfaction Trend</h2>
        <div class="chart">
            <img src="data:image/png;base64,{csat_chart}" width="800">
        </div>
        
        <h2>Top 10 Performers</h2>
        {top_agents.to_html(index=False)}
        
        <h2>Needs Coaching (Bottom 5)</h2>
        {bottom_agents.to_html(index=False)}
        
        <hr>
        <p><small>Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</small></p>
    </body>
    </html>
    """
    
# Save report
    report_file = f'/opt/cc-dashboard/reports/weekly_report_{start_date}.html'
    with open(report_file, 'w') as f:
        f.write(html_report)
    
# Send email
    send_email(
        to=['ops-manager@kidswear.com', 'team-lead@kidswear.com'],
        subject=f'Weekly Performance Report - {start_date} to {end_date}',
        html_body=html_report
    )
    
    conn.close()
    print(f'Weekly report generated: {report_file}')

def create_call_volume_chart(df):
    """Create call volume bar chart"""
    fig, ax = plt.subplots(figsize=(10, 5))
    
    ax.bar(df['call_date'], df['answered'], label='Answered', color='#28a745')
    ax.bar(df['call_date'], df['abandoned'], bottom=df['answered'], label='Abandoned', color='#dc3545')
    
    ax.set_xlabel('Date')
    ax.set_ylabel('Number of Calls')
    ax.set_title('Daily Call Volume')
    ax.legend()
    ax.grid(axis='y', alpha=0.3)
    
# Rotate x-axis labels
    plt.xticks(rotation=45)
    plt.tight_layout()
    
# Convert to base64
    buffer = BytesIO()
    plt.savefig(buffer, format='png', dpi=100)
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode()
    plt.close()
    
    return image_base64

def create_service_level_chart(df):
    """Create service level line chart"""
    fig, ax = plt.subplots(figsize=(10, 5))
    
    ax.plot(df['call_date'], df['service_level'], marker='o', linewidth=2, color='#007bff')
    ax.axhline(y=80, color='#28a745', linestyle='--', label='Target (80%)')
    ax.axhline(y=70, color='#ffc107', linestyle='--', label='Warning (70%)')
    
    ax.set_xlabel('Date')
    ax.set_ylabel('Service Level (%)')
    ax.set_title('Service Level Trend')
    ax.legend()
    ax.grid(alpha=0.3)
    ax.set_ylim(0, 100)
    
    plt.xticks(rotation=45)
    plt.tight_layout()
    
    buffer = BytesIO()
    plt.savefig(buffer, format='png', dpi=100)
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode()
    plt.close()
    
    return image_base64

def create_csat_chart(df):
    """Create CSAT line chart"""
    fig, ax = plt.subplots(figsize=(10, 5))
    
    ax.plot(df['response_date'], df['avg_csat'], marker='o', linewidth=2, color='#17a2b8')
    ax.axhline(y=4.0, color='#28a745', linestyle='--', label='Target (4.0)')
    
    ax.set_xlabel('Date')
    ax.set_ylabel('CSAT Rating')
    ax.set_title('Customer Satisfaction Trend')
    ax.legend()
    ax.grid(alpha=0.3)
    ax.set_ylim(0, 5)
    
    plt.xticks(rotation=45)
    plt.tight_layout()
    
    buffer = BytesIO()
    plt.savefig(buffer, format='png', dpi=100)
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode()
    plt.close()
    
    return image_base64

def send_email(to, subject, html_body):
    """Send HTML email (implementation from daily report)"""
# ... (same as daily_report.py)
    pass

if __name__ == '__main__':
    generate_weekly_report()
```

**Cron Job (Every Monday at 8 AM):**
```bash
0 8 * * 1 /usr/bin/python3 /opt/cc-dashboard/reports/weekly_report.py
```

---

### 5.4 Monthly Executive Report

**Purpose:** High-level summary for leadership with business insights

**Sections:**

1. **Executive Dashboard**
   - KPI scorecard (vs. targets)
   - Month-over-month trends
   - Year-to-date comparison

2. **Business Impact Analysis**
   - Customer retention impact
   - Revenue implications
   - Cost per contact

3. **Operational Efficiency**
   - Agent productivity
   - Technology utilization (IVR, AI)
   - Process improvements

4. **Strategic Recommendations**
   - Staffing adjustments
   - Training needs
   - Technology investments

**SQL Query - Monthly KPIs:**
```sql
WITH monthly_stats AS (
    SELECT 
        DATE_TRUNC('month', call_start_time) AS month,
        COUNT(*) AS total_calls,
        SUM(CASE WHEN abandoned = false THEN 1 ELSE 0 END) AS answered_calls,
        ROUND(AVG(handle_time_seconds)) AS avg_aht,
        SUM(CASE WHEN wait_time_seconds <= 30 AND abandoned = false THEN 1 ELSE 0 END)::FLOAT / 
            NULLIF(SUM(CASE WHEN abandoned = false THEN 1 ELSE 0 END), 0) * 100 AS service_level,
        SUM(CASE WHEN abandoned = true THEN 1 ELSE 0 END)::FLOAT / 
            NULLIF(COUNT(*), 0) * 100 AS abandonment_rate
    FROM calls
    WHERE call_start_time >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
      AND call_start_time < DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY DATE_TRUNC('month', call_start_time)
),
monthly_csat AS (
    SELECT 
        DATE_TRUNC('month', timestamp) AS month,
        ROUND(AVG(csat_rating), 2) AS avg_csat,
        COUNT(*) AS total_responses,
        SUM(CASE WHEN csat_rating >= 4 THEN 1 ELSE 0 END)::FLOAT / COUNT(*) * 100 AS promoter_pct,
        SUM(CASE WHEN csat_rating <= 2 THEN 1 ELSE 0 END)::FLOAT / COUNT(*) * 100 AS detractor_pct
    FROM csat_responses
    WHERE timestamp >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
      AND timestamp < DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY DATE_TRUNC('month', timestamp)
),
agent_stats AS (
    SELECT 
        COUNT(DISTINCT agent_id) AS unique_agents,
        SUM(total_calls) AS total_calls_handled,
        ROUND(AVG(avg_handle_time_seconds)) AS team_avg_aht,
        ROUND(AVG(occupancy_rate), 1) AS team_avg_occupancy
    FROM agent_performance_daily
    WHERE performance_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
      AND performance_date < DATE_TRUNC('month', CURRENT_DATE)
)
SELECT 
    m.month,
    m.total_calls,
    m.answered_calls,
    m.service_level,
    m.abandonment_rate,
    m.avg_aht,
    c.avg_csat,
    c.promoter_pct,
    c.detractor_pct,
    a.unique_agents,
    a.team_avg_aht,
    a.team_avg_occupancy
FROM monthly_stats m
CROSS JOIN monthly_csat c
CROSS JOIN agent_stats a;
```

**Monthly Report Generator (simplified - full version similar to weekly):**
```python
def generate_monthly_report():
    """Generate executive monthly report with PDF export"""
    conn = psycopg2.connect(**DB_CONFIG)
    
# Query monthly KPIs
    df = pd.read_sql("""
        -- (Same SQL as above)
    """, conn)
    
# Generate HTML report (similar structure to weekly)
    html_report = f"""
    <html>
    <!-- Executive-focused design with KPI scorecards -->
    </html>
    """
    
# Convert HTML to PDF using wkhtmltopdf
    import pdfkit
    pdf_file = f'/opt/cc-dashboard/reports/monthly_executive_{datetime.now().strftime("%Y-%m")}.pdf'
    pdfkit.from_string(html_report, pdf_file)
    
# Email with PDF attachment
    send_email_with_attachment(
        to=['ceo@kidswear.com', 'cfo@kidswear.com', 'ops-manager@kidswear.com'],
        subject=f'Monthly Executive Report - {datetime.now().strftime("%B %Y")}',
        body='Please find attached the monthly contact center performance report.',
        attachment=pdf_file
    )
    
    conn.close()
```

---

## 6. Proactive Issue Detection

### 6.1 Overview

Proactive issue detection identifies problems before they escalate into customer-impacting incidents. This system uses:

- **Anomaly Detection:** Statistical analysis of metric deviations
- **Trend Analysis:** Early warning of degrading performance
- **Threshold Monitoring:** Real-time breach detection
- **Predictive Alerts:** Forecast-based early warnings

---

### 6.2 Anomaly Detection Engine

**Concept:** Detect unusual patterns in call metrics using statistical methods

**Algorithm: Standard Deviation Method**
```python
#!/usr/bin/env python3
import psycopg2
import numpy as np
from datetime import datetime, timedelta

DB_CONFIG = {
    'host': 'localhost',
    'database': 'cc_operations',
    'user': 'cc_admin',
    'password': 'YourSecurePassword123!'
}

def detect_anomalies():
    """Detect anomalies in call volume and service levels"""
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
# Get last 30 days of hourly call volume
    cur.execute("""
        SELECT 
            DATE_TRUNC('hour', call_start_time) AS hour,
            COUNT(*) AS call_count,
            AVG(wait_time_seconds) AS avg_wait,
            SUM(CASE WHEN abandoned = true THEN 1 ELSE 0 END)::FLOAT / COUNT(*) * 100 AS abandonment_rate
        FROM calls
        WHERE call_start_time >= NOW() - INTERVAL '30 days'
        GROUP BY DATE_TRUNC('hour', call_start_time)
        ORDER BY hour DESC
    """)
    
    data = cur.fetchall()
    
# Extract metrics
    call_counts = [row[1] for row in data]
    avg_waits = [row[2] for row in data]
    abandonment_rates = [row[3] for row in data]
    
# Calculate mean and standard deviation
    call_mean = np.mean(call_counts)
    call_std = np.std(call_counts)
    
    wait_mean = np.mean(avg_waits)
    wait_std = np.std(avg_waits)
    
    abandon_mean = np.mean(abandonment_rates)
    abandon_std = np.std(abandonment_rates)
    
# Check current hour (most recent data point)
    current_hour = data[0]
    current_calls = current_hour[1]
    current_wait = current_hour[2]
    current_abandon = current_hour[3]
    
    anomalies = []
    
# Detect anomalies (> 2 standard deviations)
    if abs(current_calls - call_mean) > 2 * call_std:
        severity = 'HIGH' if current_calls < call_mean else 'INFO'
        anomalies.append({
            'metric': 'Call Volume',
            'severity': severity,
            'current': current_calls,
            'expected': f'{call_mean:.0f} ± {call_std:.0f}',
            'deviation': f'{((current_calls - call_mean) / call_std):.2f}σ'
        })
    
    if abs(current_wait - wait_mean) > 2 * wait_std:
        anomalies.append({
            'metric': 'Wait Time',
            'severity': 'HIGH',
            'current': f'{current_wait:.0f}s',
            'expected': f'{wait_mean:.0f} ± {wait_std:.0f}s',
            'deviation': f'{((current_wait - wait_mean) / wait_std):.2f}σ'
        })
    
    if abs(current_abandon - abandon_mean) > 2 * abandon_std:
        anomalies.append({
            'metric': 'Abandonment Rate',
            'severity': 'HIGH',
            'current': f'{current_abandon:.1f}%',
            'expected': f'{abandon_mean:.1f} ± {abandon_std:.1f}%',
            'deviation': f'{((current_abandon - abandon_mean) / abandon_std):.2f}σ'
        })
    
# Alert if anomalies detected
    if anomalies:
        send_anomaly_alert(anomalies)
    
    cur.close()
    conn.close()

def send_anomaly_alert(anomalies):
    """Send Slack alert for detected anomalies"""
    message = "🔍 **Anomaly Detected**\n\n"
    
    for anomaly in anomalies:
        message += f"**{anomaly['metric']}**\n"
        message += f"- Current: {anomaly['current']}\n"
        message += f"- Expected: {anomaly['expected']}\n"
        message += f"- Deviation: {anomaly['deviation']}\n\n"
    
# Send to Slack (implementation similar to alert_engine.py)
    requests.post(SLACK_WEBHOOK, json={'text': message})

if __name__ == '__main__':
    detect_anomalies()
```

**Run every hour:**
```bash
0 * * * * /usr/bin/python3 /opt/cc-dashboard/anomaly/detect.py
```

---

### 6.3 Trend Analysis

**Early Warning System:** Detect gradual degradation in metrics

**Example: Service Level Trend Alert**
```python
def detect_service_level_trend():
    """Alert if service level has been declining for 3+ consecutive days"""
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
# Get last 7 days of service levels
    cur.execute("""
        SELECT 
            DATE(call_start_time) AS call_date,
            SUM(CASE WHEN wait_time_seconds <= 30 AND abandoned = false THEN 1 ELSE 0 END)::FLOAT / 
                NULLIF(SUM(CASE WHEN abandoned = false THEN 1 ELSE 0 END), 0) * 100 AS service_level
        FROM calls
        WHERE call_start_time >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY DATE(call_start_time)
        ORDER BY call_date DESC
    """)
    
    data = cur.fetchall()
    
# Check if declining for 3+ days
    declining_days = 0
    for i in range(len(data) - 1):
        if data[i][1] < data[i+1][1]:  # Today < Yesterday
            declining_days += 1
        else:
            break
    
    if declining_days >= 3:
        alert_message = f"⚠️ **Service Level Declining Trend**\n\n"
        alert_message += f"Service level has been declining for {declining_days} consecutive days.\n\n"
        for date, sl in data[:declining_days+1]:
            alert_message += f"- {date}: {sl:.1f}%\n"
        alert_message += "\n**Action Required:** Investigate staffing and queue routing."
        
# Send alert
        send_slack_alert('WARNING', 'Service Level Trend', alert_message)
    
    cur.close()
    conn.close()
```

---

### 6.4 Predictive Alerts

**Forecast-Based Alerts:** Predict issues before they happen

**Example: Call Volume Forecast**
```python
def forecast_call_volume():
    """Predict next hour's call volume and alert if staffing insufficient"""
    from sklearn.linear_model import LinearRegression
    
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
# Get last 4 weeks of same weekday/hour data
    cur.execute("""
        SELECT 
            EXTRACT(EPOCH FROM call_start_time) AS timestamp_epoch,
            COUNT(*) AS call_count
        FROM calls
        WHERE EXTRACT(DOW FROM call_start_time) = EXTRACT(DOW FROM NOW())
          AND EXTRACT(HOUR FROM call_start_time) = EXTRACT(HOUR FROM NOW() + INTERVAL '1 hour')
          AND call_start_time >= NOW() - INTERVAL '4 weeks'
        GROUP BY DATE_TRUNC('hour', call_start_time)
        ORDER BY timestamp_epoch
    """)
    
    data = cur.fetchall()
    
    if len(data) < 4:
        return  # Not enough data
    
# Train simple linear regression
    X = np.array([row[0] for row in data]).reshape(-1, 1)
    y = np.array([row[1] for row in data])
    
    model = LinearRegression()
    model.fit(X, y)
    
# Predict next hour
    next_hour_timestamp = datetime.now().timestamp() + 3600
    predicted_calls = model.predict([[next_hour_timestamp]])[0]
    
# Get current available agents
    cur.execute("""
        SELECT COUNT(*) FROM agent_states
        WHERE timestamp > NOW() - INTERVAL '5 minutes'
          AND state = 'Available'
    """)
    
    available_agents = cur.fetchone()[0]
    
# Alert if insufficient capacity (assume 1 agent can handle 6 calls/hour)
    capacity = available_agents * 6
    
    if predicted_calls > capacity * 1.2:  # 20% buffer
        alert_message = f"📈 **Capacity Warning - Next Hour**\n\n"
        alert_message += f"Predicted calls: {predicted_calls:.0f}\n"
        alert_message += f"Current capacity: {capacity} ({available_agents} agents)\n"
        alert_message += f"**Recommendation:** Bring 2-3 additional agents online.\n"
        
        send_slack_alert('WARNING', 'Capacity Forecast', alert_message)
    
    cur.close()
    conn.close()
```

---

## 7. Incident Management Workflow

### 7.1 Overview

Incident management ensures quick resolution of production issues with clear escalation paths and communication protocols.

**Incident Severity Levels:**

| Severity | Definition | Response Time | Escalation |
|----------|------------|---------------|------------|
| **P1 - Critical** | Complete outage, no calls can be processed | < 15 min | Immediate to Manager |
| **P2 - High** | Major degradation, SLA at risk | < 30 min | Escalate if not resolved in 1 hour |
| **P3 - Medium** | Minor impact, no immediate SLA risk | < 2 hours | Daily summary |
| **P4 - Low** | Cosmetic issues, no customer impact | Next business day | Weekly summary |

---

### 7.2 Incident Response Workflow

**Step-by-Step Process:**

**Step 1: Detection & Logging**
```
Trigger: Alert fired OR Agent reports issue OR Customer complaint
Action: 
1. Create incident ticket (Jira/ServiceNow)
2. Assign severity level
3. Notify on-call engineer (Slack + SMS if P1/P2)
```

**Step 2: Initial Assessment (< 5 minutes for P1)**
```
Questions:
- What is the scope? (All queues or specific?)
- How many customers impacted?
- Is there a workaround?

Action:
- Update incident ticket with findings
- Post status update in #cc-operations Slack
```

**Step 3: Troubleshooting (Parallel Tasks)**
```
Webex CC Team:
- Check Webex Control Hub for service status
- Review agent states and queue configurations
- Check call routing flows for errors

Network Team:
- Verify CUBE SIP trunk registration
- Check network connectivity to Webex cloud
- Review firewall logs for blocked traffic

GCP Team:
- Check Dialogflow CX status
- Review GCP Cloud Console for errors
- Verify API quotas not exceeded
```

**Step 4: Communication (Every 15 minutes for P1/P2)**
```
Internal:
- Slack updates in #cc-operations
- Email to stakeholders

External (if P1):
- Status page update (status.kidswear.com)
- Customer notification (if applicable)
```

**Step 5: Resolution & Verification**
```
Actions:
1. Implement fix
2. Test with sample calls
3. Monitor for 30 minutes
4. Declare incident resolved
```

**Step 6: Post-Incident Review (Within 48 hours)**
```
Documentation:
- Root cause analysis
- Timeline of events
- Actions taken
- Lessons learned
- Preventive measures

Meeting:
- Review with all involved teams
- Update runbooks
- Implement improvements
```

---

### 7.3 Incident Ticket Template

**Jira/ServiceNow Incident Fields:**
```yaml
Title: [P1] Webex Contact Center - Complete Call Outage

Description:
- **Detected At:** 2025-11-22 14:35 IST
- **Reported By:** Operations Manager (Slack alert)
- **Severity:** P1 - Critical
- **Impact:** All queues - No calls being processed
- **Affected Components:** Webex Contact Center, CUBE SIP Trunk
- **Customer Impact:** Complete service outage

Initial Assessment:
- CUBE SIP trunk shows "Down" status in Webex Control Hub
- Error: "SIP 503 Service Unavailable"
- Probable cause: Network connectivity issue

Actions Taken:
1. [14:37] Verified CUBE server reachable via ping
2. [14:39] Checked CUBE CLI - SIP trunk registration failed
3. [14:42] Rebooted CUBE router
4. [14:45] SIP trunk registered successfully
5. [14:47] Test call successful - incident resolved

Root Cause:
- CUBE router software bug causing intermittent SIP registration failures
- Cisco bug ID: CSCxxxxxxxxx

Preventive Measures:
1. Upgrade CUBE software to latest version (17.9.5)
2. Implement SIP trunk health checks every 5 minutes
3. Configure automatic failover to secondary CUBE

Resolution Time: 12 minutes
```

---

### 7.4 Common Incidents & Runbooks

#### Incident 1: High Abandonment Rate

**Symptoms:**
- Abandonment rate > 10%
- Calls waiting > 2 minutes
- Service level < 70%

**Troubleshooting Steps:**
```bash
# Step 1: Check agent availability
# Dashboard → Agent Status Grid
# Look for: Idle agents, agents in "Not Ready" state

# Step 2: Check queue routing
# Webex Control Hub → Queues → [Queue Name] → Routing Strategy
# Verify: Agents assigned correctly, skill-based routing working

# Step 3: Review call volume
# Dashboard → Call Volume Chart
# Question: Is this expected peak hour traffic?

# Step 4: Check IVR performance
# Dashboard → IVR Metrics
# Look for: High transfer rate, IVR errors

# Resolution Actions:
# - Move idle agents to Available
# - Reassign agents from low-traffic queues
# - Enable overflow routing to secondary queue
# - If IVR issue: Restart Dialogflow CX integration
```

---

#### Incident 2: Webex CC Agent Desktop Not Loading

**Symptoms:**
- Agents cannot log in to desktop
- Error: "Unable to load workspace"
- Browser console shows network errors

**Troubleshooting Steps:**
```bash
# Step 1: Check Webex service status
# https://status.webex.com
# Look for: Contact Center service incidents

# Step 2: Verify agent license
# Webex Control Hub → Users → [Agent Email]
# Check: "Contact Center - Agent" license assigned

# Step 3: Test from different browser
# Try: Chrome Incognito mode
# Bypasses: Browser cache, extensions

# Step 4: Check network firewall
# Ensure outbound HTTPS to:
# - *.webex.com (ports 443, 5060-5070)
# - *.wxcc-us1.cisco.com

# Step 5: Clear browser cache
# Instructions for agent:
# - Chrome: Settings → Privacy → Clear browsing data
# - Edge: Settings → Privacy → Choose what to clear

# Resolution:
# - Usually resolves with browser cache clear + hard refresh (Ctrl+F5)
# - If persistent: Contact Cisco TAC with agent email and error logs
```

---

#### Incident 3: Dialogflow CX Not Responding

**Symptoms:**
- IVR says "I'm sorry, I didn't understand that"
- All intents failing to match
- GCP Console shows API errors

**Troubleshooting Steps:**
```bash
# Step 1: Check GCP service status
# https://status.cloud.google.com
# Look for: Dialogflow CX outages in asia-south1

# Step 2: Verify API quota
# GCP Console → APIs & Services → Dialogflow CX API → Quotas
# Check: Requests per minute not exceeded

# Step 3: Test intent manually
# Dialogflow CX Console → Test Agent
# Enter: "I want to check my order status"
# Expected: Order Status intent should trigger

# Step 4: Check service account permissions
# GCP Console → IAM & Admin → Service Accounts
# Verify: webex-cc-integration@kidswear.iam.gserviceaccount.com
# has Dialogflow API Client role

# Step 5: Review recent changes
# Dialogflow CX Console → Version History
# Question: Was a new flow version deployed recently?

# Resolution Actions:
# - If quota exceeded: Request quota increase (GCP Support)
# - If permission issue: Re-grant Dialogflow API Client role
# - If bad deployment: Rollback to previous flow version
# - Temporary workaround: Route all calls directly to agent (bypass IVR)
```

---

### 7.5 Escalation Matrix

**Contact List:**

| Role | Name | Email | Mobile | Escalation Level |
|------|------|-------|--------|------------------|
| **L1 Support** | Operations Team | ops@kidswear.com | - | First responder |
| **L2 - Webex Admin** | Cisco Engineer | cisco-admin@kidswear.com | +91-98765-11111 | Webex CC issues |
| **L2 - Network Admin** | Network Engineer | network-admin@kidswear.com | +91-98765-22222 | CUBE, connectivity |
| **L2 - GCP Admin** | Cloud Engineer | gcp-admin@kidswear.com | +91-98765-33333 | Dialogflow, GCP |
| **L3 - Operations Manager** | Manager Name | ops-manager@kidswear.com | +91-98765-44444 | Escalation, decisions |
| **L4 - IT Director** | Director Name | it-director@kidswear.com | +91-98765-55555 | Executive escalation |

**Escalation Triggers:**

| Scenario | Escalate To | Timeframe |
|----------|-------------|-----------|
| P1 incident not resolved | L3 (Ops Manager) | 30 minutes |
| P1 impact > 1 hour | L4 (IT Director) | Immediately |
| P2 incident not progressing | L2 Specialist | 1 hour |
| Multiple P2 incidents | L3 (Ops Manager) | Immediately |

**External Vendor Escalation:**

```
Cisco TAC (Webex CC):
- Phone: +1-800-553-2447 (US) or +91-80-4026-6000 (India)
- Web: https://mycase.cloudapps.cisco.com
- Severity: Match to our severity (P1 = Cisco Severity 1)

Google Cloud Support:
- Phone: +1-877-353-3807 (US) or +91-80-6849-6000 (India)
- Web: https://console.cloud.google.com/support
- Severity: P1 = Critical, P2 = High
```
