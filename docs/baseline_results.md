SLA breach prediction was modeled using only inference-time structured
features (priority, impact, urgency, category, temporal signals).
The baseline Logistic Regression prioritizes recall for SLA breaches
over overall accuracy, reflecting operational risk sensitivity.



Threshold tuning was applied to the SLA breach classifier to prioritize
breach recall over precision. A decision threshold of 0.4 was selected,
achieving ~83% recall for SLA breaches while maintaining acceptable
false-positive rates. This reflects operational risk preferences where
missing a breach is costlier than issuing an early warning.


## SLA Breach Model Evaluation

The SLA breach classifier is evaluated with emphasis on recall for the
breach class, as missing a breach is operationally more costly than
raising a false alert.

At a decision threshold of 0.4:
- Breach recall: ~83%
- Breach precision: ~47%
- Overall accuracy: ~60%

This operating point was selected to balance early risk detection with
manageable false positives, aligning with real-world SLA management
priorities.
