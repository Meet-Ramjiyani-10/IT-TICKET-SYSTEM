# IT Incident SLA Prediction System

## Overview
This project implements an ML-based SLA breach risk prediction system
using incident management data. The system predicts the probability
of SLA breach at ticket creation time to enable proactive intervention.

## ML Scope (v1)
- Incident-level dataset derived from event logs
- SLA breach prediction (Logistic Regression)
- Recall-optimized decision threshold

## API
See `docs/API_CONTRACT.md`

## Notes
This project combines rule-based logic with ML where appropriate,
prioritizing interpretability and operational realism.


## V1 user flow
## How the System Works (User Flow)

1. **User Creates a Support Ticket**
   - A user reports an issue (software, network, hardware, etc.).
   - Ticket details such as category, urgency, and impact are submitted.

2. **Automatic SLA Risk Evaluation**
   - As soon as the ticket is created, the system sends ticket details to the ML service.
   - The ML model predicts:
     - the probability of an SLA breach
     - a risk flag (High Risk / Low Risk)

3. **Risk Visibility for Support Teams**
   - Support agents can immediately see the SLA risk status on the ticket.
   - This helps prioritize tickets that are more likely to breach SLA.

4. **Proactive Ticket Handling**
   - High-risk tickets can be:
     - escalated earlier
     - assigned to experienced agents
     - monitored more closely
   - Low-risk tickets continue through the normal workflow.

5. **Improved SLA Compliance**
   - By identifying risky tickets early, teams can take preventive actions.
   - This reduces missed SLAs and improves overall service quality.

> The system provides decision support, not automatic decisions.  
> Human agents remain in control while benefiting from early risk insights.

User creates a ticket → system predicts SLA breach risk → support teams act early.
