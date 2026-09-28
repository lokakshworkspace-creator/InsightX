import { AlertTriangle, PackageX, TrendingDown } from 'lucide-react'
import { useCallback } from 'react'
import { getAlerts } from '../api/client'
import { useBrandFilter } from '../context/BrandFilterContext'
import { POLL_INTERVAL_MS } from '../constants'
import { useApiData } from '../hooks/useApiData'
import { formatRelativeTime, SEVERITY_LABEL } from '../utils/formatters'
import { ErrorState } from './ErrorState'
import { ExplainButton } from './ExplainButton'
import { LoadingState } from './LoadingState'
import { RefreshIndicator } from './RefreshIndicator'
import { TechnicalDetails } from './TechnicalDetails'

const TYPE_LABEL = {
  anomaly: 'Anomaly',
  low_stock: 'Low Stock',
  decline: 'Decline',
}

// A small icon per alert type — the pill itself stays a neutral color
// (severity is carried by the card's left border stripe, not the type
// badge — see App.css's .anomaly-item--* rules), so type and severity
// read as two independent facts instead of one color doing both jobs.
const TYPE_ICON = {
  anomaly: AlertTriangle,
  low_stock: PackageX,
  decline: TrendingDown,
}

// A stable identity per alert, NOT the array index: the feed re-sorts on
// every poll (severity, then detector agreement, then recency), and each
// anomaly row holds its own Explain/technical-details state — with
// index keys, React would hand one alert's state to whichever alert
// lands in its old slot.
function alertKey(alert) {
  return alert.related_entity.anomaly_id ?? `${alert.type}:${alert.message}`
}

// The Anomalies page's whole content: one ranked feed over anomalies,
// low stock, and declining regions/products (GET /api/alerts) — replaces
// what used to be two separate panels (AnomalyPanel + AlertsCenter).
//
// AnomalyPanel previously showed raw detector jargon (z-scores,
// Isolation Forest scores, forecast numbers) in its default view, which
// broke abstraction for a business user reading this page day to day.
// That detail didn't disappear — every row still carries it (the
// backend's Alert model now includes the same z_score/isolation_forest/
// forecast verdicts BusinessAnomalyEvent always had, added specifically
// for this) — it's just behind each row's own collapsed-by-default
// "Technical details" disclosure (see TechnicalDetails.jsx) instead of
// inline, so the plain-English message is what a business user sees
// first, and the detection engine's internals are still there on
// demand for anyone who wants to check them (e.g. demoing why something
// was flagged).
export function AlertsSection() {
  const { selectedBrand } = useBrandFilter()
  const fetchFn = useCallback(() => getAlerts({ brand: selectedBrand || undefined }), [selectedBrand])
  const { data, loading, error, isRefreshing, pollError, lastUpdated } = useApiData(fetchFn, {
    intervalMs: POLL_INTERVAL_MS,
  })

  return (
    <section className="panel">
      <div className="section-header">
        <h2 className="panel__title">Alerts</h2>
        <RefreshIndicator isRefreshing={isRefreshing} pollError={pollError} lastUpdated={lastUpdated} />
      </div>

      {loading && <LoadingState label="Loading alerts…" />}
      {error && <ErrorState error={error} label="Could not load alerts" />}

      {!loading && !error && (data === null || data.length === 0) && (
        <p className="empty-note">No active alerts — anomalies, low stock, and declining performance all clear.</p>
      )}

      {!loading && !error && data && data.length > 0 && (
        <ul className="anomaly-list">
          {data.map((alert) => {
            const TypeIcon = TYPE_ICON[alert.type]
            const isAnomaly = alert.type === 'anomaly'
            return (
              <li key={alertKey(alert)} className={`anomaly-item anomaly-item--${alert.severity}`}>
                <div className="anomaly-item__row">
                  <span className={`severity-badge severity-badge--${alert.severity}`}>
                    {SEVERITY_LABEL[alert.severity]}
                  </span>
                  <span className="alert-type-badge">
                    {TypeIcon && <TypeIcon size={12} aria-hidden="true" />}
                    {TYPE_LABEL[alert.type] ?? alert.type}
                  </span>
                </div>
                <div className="anomaly-item__row">
                  <span>{alert.message}</span>
                </div>
                <div className="anomaly-item__row anomaly-item__row--meta">
                  <span>{formatRelativeTime(alert.timestamp)}</span>
                </div>
                {isAnomaly && <TechnicalDetails alert={alert} />}
                {isAnomaly && <ExplainButton anomalyId={alert.related_entity.anomaly_id} />}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
