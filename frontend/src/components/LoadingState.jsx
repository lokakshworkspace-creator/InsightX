// Shared "still loading" placeholder — used by every fetching
// component so a loading dashboard always looks like one thing, not
// three different ad-hoc spinners. The label text stays real and
// visible (not just decorative): this app's own browser-verification
// scripts wait for the word "Loading" to disappear from the page as
// their signal that data has arrived.
export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="status-state status-state--loading" role="status">
      <div className="status-state__row">
        <span className="spinner" aria-hidden="true" />
        <span>{label}</span>
      </div>
      <span className="skeleton" aria-hidden="true">
        <span className="skeleton__bar" />
        <span className="skeleton__bar" />
        <span className="skeleton__bar" />
      </span>
    </div>
  )
}
