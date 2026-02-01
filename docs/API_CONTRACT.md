## SLA Breach Prediction API

### Endpoint
POST /predict/sla

### Request Body
{
  "priority": "3",
  "impact": "2",
  "urgency": "2",
  "category": "Software",
  "subcategory": "Email",
  "opened_at": "2026-02-01T10:15:00"
}

### Response
{
  "breach_probability": 0.72,
  "breach_flag": true
}
