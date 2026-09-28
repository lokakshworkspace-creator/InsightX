import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { routeLabel } from '../utils/routeMeta'

const ROLE_LABEL = { admin: 'Administrator', business: 'Business' }

// The slim header above each page's own content: a breadcrumb + the
// current page's name on the left (derived from the route — no data
// fetch of its own), the signed-in user's email/role on the right.
// Sign out lives once, in the sidebar's account group (see Sidebar.jsx)
// — not duplicated here, so there's exactly one "Sign out" control on
// the page.
export function TopHeader() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const label = routeLabel(pathname) ?? 'Not available'

  return (
    <div className="topheader">
      <div className="topheader__crumb">
        <span className="topheader__crumb-root">Pages</span>
        <span className="topheader__crumb-sep" aria-hidden="true">
          /
        </span>
        <span className="topheader__crumb-current">{label}</span>
      </div>
      <div className="topheader__user">
        <span className="topheader__user-email">{user.email}</span>
        <span className="topheader__user-role">{ROLE_LABEL[user.role] ?? user.role}</span>
      </div>
    </div>
  )
}
