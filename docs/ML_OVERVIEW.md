## ML Scope (v1)

This project currently supports SLA breach risk prediction
using inference-time structured incident features.

### Implemented
- Incident-level dataset derived from event logs
- SLA breach classification (Logistic Regression)
- Threshold tuned for high breach recall (0.4)

### Inputs
- priority
- impact
- urgency
- category
- subcategory
- opened_at (time features derived)

### Output
- breach_probability (0–1)
- breach_flag (threshold = 0.4)

### Notes
- Priority and category are treated as given system fields
- Model avoids post-resolution data to prevent leakage



## In Future 
- Handle-Time Prediction (regression)
- incident clustering (unsupervised)
