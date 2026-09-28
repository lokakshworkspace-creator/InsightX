import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { detectorsFromEvent } from '../utils/detectors'
import { DetectorBadges } from './DetectorBadges'

// One raw-score line. `null` (no batch run has scored this record yet)
// reads differently from a real but unflagged verdict — see
// BusinessAnomalyEvent's docstring in models.py, the same distinction
// this mirrors.
function VerdictLine({ label, verdict, format }) {
  return (
    <div className="tech-details__row">
      <span className="tech-details__label">{label}</span>
      <span className="tech-details__value">
        {verdict ? format(verdict) : 'Not yet scored — needs a batch run (see README)'}
      </span>
    </div>
  )
}

// Collapsed-by-default disclosure of what AnomalyPanel used to show up
// front: the raw detector scores behind an anomaly alert. Kept out of
// the default row on purpose (see AlertsSection.jsx) — this is for
// demoing the detection engine on demand, not routine reading. Only
// ever rendered for type="anomaly" rows; low_stock/decline alerts have
// no detector verdicts to show (see the Alert model in models.py).
export function TechnicalDetails({ alert }) {
  const [open, setOpen] = useState(false)
  const Chevron = open ? ChevronDown : ChevronRight

  return (
    <div className="tech-details">
      <button
        type="button"
        className="tech-details__toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <Chevron size={13} aria-hidden="true" />
        Technical details
      </button>
      {open && (
        <div className="tech-details__body">
          <DetectorBadges detectors={detectorsFromEvent(alert)} />
          <VerdictLine
            label="Z-score"
            verdict={alert.z_score}
            format={(v) => `${v.flagged ? 'Flagged' : 'Not flagged'} — score ${v.score !== null ? v.score.toFixed(2) : '—'}${v.severity ? ` (${v.severity})` : ''}`}
          />
          <VerdictLine
            label="Isolation Forest"
            verdict={alert.isolation_forest}
            format={(v) => `${v.flagged ? 'Flagged' : 'Not flagged'} — score ${v.score.toFixed(3)} (0–1, higher = more anomalous)`}
          />
          <VerdictLine
            label="Forecast deviation"
            verdict={alert.forecast}
            format={(v) => `${v.flagged ? 'Flagged' : 'Not flagged'} — expected ${v.expected.toFixed(2)}, actual ${v.actual}`}
          />
        </div>
      )}
    </div>
  )
}
