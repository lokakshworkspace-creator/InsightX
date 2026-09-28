import { AlertsSection } from '../components/AlertsSection'

// One merged feed (anomalies + low stock + declines) — see
// AlertsSection.jsx for why this replaced two separate panels
// (AnomalyPanel + the old AlertsCenter).
export function AlertsPage() {
  return (
    <>
      <h1 className="page-title">Alerts</h1>
      <AlertsSection />
    </>
  )
}
