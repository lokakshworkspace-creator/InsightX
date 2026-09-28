import { AlertCircle } from 'lucide-react'

// Shared "this fetch failed" state. Deliberately visible and specific
// (shows the actual error message from api/client.js, e.g. "Could not
// reach the API — is the backend running?") rather than a blank
// section or a silently-empty list, per Phase 6's explicit requirement
// that a broken backend must never look indistinguishable from "no
// data yet". The icon (not just the red color) is what actually marks
// this as an error — see the theme's contrast note in App.css.
export function ErrorState({ error, label = 'Could not load data' }) {
  return (
    <div className="status-state status-state--error" role="alert">
      <strong>
        <AlertCircle size={16} aria-hidden="true" />
        {label}
      </strong>
      <span>{error?.message ?? 'Unknown error'}</span>
    </div>
  )
}
