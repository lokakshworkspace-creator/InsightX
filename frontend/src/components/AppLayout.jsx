import { Outlet } from 'react-router-dom'
import { BrandFilterProvider } from '../context/BrandFilterContext'
import { Sidebar } from './Sidebar'
import { TopHeader } from './TopHeader'

// The shell every signed-in page renders inside: a fixed left Sidebar
// plus, in the remaining space, a slim TopHeader (breadcrumb + user)
// above the current page (<Outlet />). BrandFilterProvider lives HERE,
// above both, so the admin's brand selection survives navigating
// between pages (the sidebar's BrandSwitcher sets it, whichever page is
// showing reads it) instead of resetting on every route change.
//
// Each page fetches and polls only its own components' data — a page
// that isn't mounted isn't fetching (useApiData clears its interval on
// unmount), so leaving a page stops its polling and coming back resumes
// it from a fresh load.
export function AppLayout() {
  return (
    <BrandFilterProvider>
      <Sidebar />
      <div className="app-main">
        <TopHeader />
        <main className="dashboard">
          <Outlet />
          <p className="dashboard__footnote">
            Synthetic order stream — see the simulator, not live production data.
          </p>
        </main>
      </div>
    </BrandFilterProvider>
  )
}
