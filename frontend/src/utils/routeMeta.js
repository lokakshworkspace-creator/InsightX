import { BarChart3, LayoutDashboard, Package, ShieldAlert, UserCircle } from 'lucide-react'

// One list driving three things that used to duplicate this data: the
// sidebar's nav links, the top header's breadcrumb, and (implicitly)
// which routes exist. `adminOnly` items are hidden from business
// accounts in the sidebar — cosmetic only; the route itself is guarded
// separately (see RequireAdmin), since a hidden link protects nothing.
export const ROUTES = [
  { to: '/overview', label: 'Overview', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  // The URL path stays /anomalies (unchanged — no routing/redirect
  // churn) even though the displayed label is now "Alerts": the two
  // panels that used to live here (AnomalyPanel + AlertsCenter) merged
  // into one feed, see AlertsSection.jsx / AlertsPage.jsx.
  { to: '/anomalies', label: 'Alerts', icon: ShieldAlert },
  { to: '/benchmark', label: 'Benchmark', icon: BarChart3, adminOnly: true },
  { to: '/profile', label: 'Profile', icon: UserCircle },
]

export function routeLabel(pathname) {
  return ROUTES.find((r) => r.to === pathname)?.label ?? null
}
