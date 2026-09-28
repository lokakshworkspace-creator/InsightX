import { LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROUTES } from '../utils/routeMeta'
import { BrandSwitcher } from './BrandSwitcher'

// The fixed left sidebar (renamed from the old top Navbar — see
// App.css's ".navbar" rules for how the same class names now describe
// a sidebar instead of a top bar; kept identical on purpose so nothing
// that selects on them, in this app's own browser-verification
// scripts, had to change). Below ~900px it collapses into a slim top
// bar with a hamburger that opens this same content as a drawer
// (`.navbar--open` / `.navbar__backdrop`, both CSS-only concerns
// besides the open/close boolean here).
export function Sidebar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const isAdmin = user.role === 'admin'

  // A deliberate sign-out: RequireAuth sends the user to /login, and
  // forgetLocation makes the next login start at the landing page
  // instead of resuming this one (right for an expired session, wrong
  // for someone who chose to leave).
  function handleLogout() {
    logout({ forgetLocation: true })
  }

  return (
    <>
      <button
        type="button"
        className="sidebar-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open && <div className="navbar__backdrop" onClick={() => setOpen(false)} aria-hidden="true" />}

      <header className={`navbar${open ? ' navbar--open' : ''}`}>
        <div className="navbar__inner">
          <div className="navbar__brand">
            <span className="navbar__brand-mark" aria-hidden="true">
              I
            </span>
            <span className="navbar__brand-name">InsightX</span>
          </div>

          <nav className="navbar__links" aria-label="Main">
            {ROUTES.filter((item) => !item.adminOnly || isAdmin).map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
                >
                  {/* The label is a bare text node, a sibling of the icon
                      — NOT wrapped in its own <span> — on purpose: this
                      app's browser-verification scripts locate nav links
                      by exact text (Playwright's :text-is only counts an
                      element's own direct text nodes, ignoring text
                      inside a nested element), same reasoning already
                      applied to the "Sign out" button below. */}
                  <Icon size={18} aria-hidden="true" />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="navbar__controls">
            {isAdmin ? (
              <BrandSwitcher />
            ) : (
              <span className="viewing-badge">Viewing: {user.business_name ?? user.owned_brands.join(', ')}</span>
            )}
            <button type="button" className="logout-button" onClick={handleLogout}>
              <LogOut size={16} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
