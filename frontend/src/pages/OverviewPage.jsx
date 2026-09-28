import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { KpiCardsRow } from '../components/KpiCardsRow'
import { RecentOrdersTable } from '../components/RecentOrdersTable'
import { RegionsChart } from '../components/RegionsChart'
import { TrendChart } from '../components/TrendChart'
import { useAuth } from '../context/AuthContext'

// Landing page: how the business is doing right now. Each component
// fetches and polls its own data — and only while this page is mounted.
// The welcome card below is the one exception worth calling out: it's
// built entirely from AuthContext's already-loaded profile (no new
// fetch, no polling of its own).
export function OverviewPage() {
  const { user } = useAuth()
  const name = user.role === 'business' ? (user.business_name ?? user.owned_brands[0]) : 'Admin'

  return (
    <>
      <h1 className="page-title">Overview</h1>
      <div className="welcome-card">
        <div>
          <p className="welcome-card__title">Welcome back, {name}</p>
          <p className="welcome-card__subtitle">Here&apos;s how things look right now.</p>
        </div>
        <Link to="/anomalies" className="welcome-card__link">
          Check Alerts
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
      <KpiCardsRow />
      <div className="dashboard__lower dashboard__lower--even">
        <TrendChart />
        <RegionsChart />
      </div>
      <RecentOrdersTable />
    </>
  )
}
