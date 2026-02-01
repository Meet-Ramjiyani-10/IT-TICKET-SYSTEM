# UCL

UCL DATA
|
├── EDA (understand distributions & labels)
|
├── Text Processing (shared)
|
├── ──► Classification (category / type)
|
├── ──► Priority Prediction
|
├── ──► Handle Time Prediction (regression)
|
└── ──► Incident Clustering (unsupervised)

project/
│
├── data/
│   ├── raw/
│   │   └── ucl_incidents.csv
│   └── processed/
│       └── ucl_master_df.csv
│
├── notebooks/
│   ├── 01_ucl_eda.ipynb
│   ├── 02_text_features.ipynb
│   ├── 03_classification.ipynb
│   ├── 04_priority_prediction.ipynb
│   ├── 05_handle_time_regression.ipynb
│   └── 06_incident_clustering.ipynb
│
├── docs/
│   ├── [EDA.md](http://eda.md/)
│   └── MODELING_NOTES.md
│
└── [README.md](http://readme.md/)

### 🆔 Identity / Metadata

- `number` → incident ID
- `sys_created_at`, `sys_updated_at` → system metadata (mostly useless)

### 🕒 Time

- `opened_at` → **incident creation time**
- `resolved_at` → when issue was resolved
- `closed_at` → final closure

👉 These allow **time-to-resolution** and **SLA modeling**

---

### 📌 Labels / Business Fields

- `category`, `subcategory` → incident type
- `impact` → business impact
- `urgency` → how fast it must be handled
- `priority` → assigned importance
- `incident_state` → lifecycle state

---

### 📊 Operational Signals

- `reassignment_count` → handoffs (very important)
- `reopen_count` → quality issues
- `assignment_group`, `assigned_to` → workload (high-cardinality)
- `made_sla` → **SLA met or not** (THIS IS GOLD)

---

### 📝 Text

- `u_symptom` → short free text symptom description

This is **limited but usable**.

This dataset is called:

> Incident Management Process – Enriched Event Log
> 

That phrase matters.

### What that means

Each **incident (`number`) appears multiple times**, once per **state change**:

Example you showed:

```
INC0000045 →New
INC0000045 → Resolved
INC0000045 → Resolved
INC0000045 → Closed

```

So this dataset is **NOT**:

- one row = one incident ❌

It **IS**:

- one row = one **event in the lifecycle** of an incident ✅

> event-level data → incident-level data
> 

### Rule (LOCK THIS)

For each `number` (incident):

- `opened_at` → earliest
- `resolved_at` → last resolved
- `closed_at` → last closed
- `made_sla` → final value
- `reassignment_count` → max
- `reopen_count` → max
- `sys_mod_count` → max
- categorical fields → **first or mode**

## WHAT WE DO ABOUT ZERO-TIME INCIDENTS (ENGINEERING DECISION)

### ❌ Wrong approach

- Drop them silently
- Pretend they don’t exist

### ✅ Correct approach

- Keep them for SLA classification
- **Exclude them from handle-time regression**
- Document this decision

We will do this later — just be aware now.

1-02-2006 (information )

## Dataset Selection (UCL / UCI Incident Management Dataset)

We selected the **UCL / UCI Incident Management Process – Enriched Event Log** dataset.

### Why this dataset?

- Real **ITSM-style incident data**
- Contains:
    - impact, urgency, priority
    - SLA outcome (`made_sla`)
    - timestamps (`opened_at`, `resolved_at`, `closed_at`)
- Suitable for **SLA risk, time prediction, and clustering**
- Clean dataset (no missing values)

⚠️ Important detail:

- This dataset is an **event log**, not a simple table
- Each incident appears **multiple times** (one row per lifecycle event)

---

## 2️⃣ Event-Level → Incident-Level Conversion (Very Important)

Before any ML, we **converted the event log into an incident-level dataset**.

### What we did:

- Grouped rows by `incident number`
- Aggregated lifecycle information:
    - `opened_at` → earliest
    - `resolved_at` / `closed_at` → latest
    - `made_sla` → final outcome
    - counts → max values
    - category / priority → first value

### Result:

- **One row = one incident**
- ~25,000 unique incidents
- This prevents **data leakage** and incorrect modeling

This step is critical and often done wrong — we did it correctly.

---

## 3️⃣ Targeted EDA (Not Random Exploration)

We performed **decision-driven EDA**, not exploratory chaos.

### Questions we answered:

- Is SLA breach predictable at ticket creation time?
- Do operational features influence SLA outcomes?

### Findings:

- SLA is moderately imbalanced (~63% met / ~37% breached)
- SLA breach rates vary by:
    - priority
    - impact
    - urgency
    - category

### Conclusion:

- **SLA breach prediction is a valid ML problem**
- No post-resolution features are required

---

## 4️⃣ Text Feature Feasibility Check (`u_symptom`)

We **did NOT jump into NLP immediately**.

### What we checked:

- Text length distribution
- Repeated symptom templates
- Basic token frequency

### Conclusion:

- Text is present but shallow
- Structured features are stronger for SLA
- Text can be added later as an improvement (v2)

This avoided unnecessary complexity.

---

## 5️⃣ SLA Breach Baseline Model (Core ML Output)

### What we built:

- **Binary classification model**
- Target: `SLA breached` (not SLA met)
- Model: Logistic Regression
- Inputs:
    - priority
    - impact
    - urgency
    - category
    - subcategory
    - time features from `opened_at`

### Key points:

- No leakage (no resolution-time data)
- Model is interpretable and deployable

---

## 6️⃣ Threshold Tuning (Business Decision)

Instead of using the default 0.5 threshold, we tuned it.

### Final choice:

- **Threshold = 0.4**

### Why?

- SLA breach recall ≈ **83%**
- Missing breaches is more costly than false alarms
- This aligns with real operational risk systems

### Output:

- Model returns:
    - breach probability
    - risk flag (based on threshold)

---

## 7️⃣ Model Saving & Documentation

We:

- Saved the **full ML pipeline** (preprocessing + model)
- Saved threshold configuration separately
- Documented:
    - what metrics matter (recall > accuracy)
    - why the model behaves this way
    - API input/output contract

This allows backend and frontend teams to work independently.

---

## 8️⃣ What This Enables for the Team

Because of today’s work:

- Backend can expose `/predict/sla`
- Frontend can build SLA risk UI
- DevOps can containerize and deploy
- ML work is **no longer a blocker**

---

## 9️⃣ What’s Next (Planned ML Work)

### v2 ML Features (In Progress / Future):

- **Handle-time prediction (regression)**
- **Incident clustering (unsupervised)**
- Optional: add text features to SLA model

These are **enhancements**, not blockers.

## What We Did Before UCL

- Started with a generic support-ticket dataset
- Designed full system architecture and ML scope
- Built a master ticket schema
- Tried category & priority models
- Discovered **priority/category were deterministic** (rule-based, fake ML accuracy)
- Learned where **ML does NOT add value**

---

## 🔹 Why We Switched to UCL

- Needed data with **real uncertainty**
- UCL dataset is **ITSM event-log based**
- Contains lifecycle timestamps + SLA outcome
- Better suited for **SLA, time prediction, clustering**

---

## 🔹 What We Did With UCL (Today)

- Converted event-log → **incident-level dataset**
- Performed targeted EDA (validated SLA predictability)
- Checked text feasibility (kept for later)
- Built **SLA breach baseline model**
- Tuned threshold (0.4) for high breach recall (~83%)
- Saved model + documented API contract

---

## 🔹 Current Status

- SLA ML baseline **DONE & pushed**
- Backend / Frontend / DevOps **unblocked**

---

## 🔹 What’s Next

- Handle-time prediction (regression)
- Incident clustering (unsupervised)
- Optional text enhancement (v2)