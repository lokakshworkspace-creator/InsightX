import { theme } from '../theme'

// A dark tooltip for Recharts (TrendChart / RegionsChart), replacing
// the library's default white box. `formatter(value, name)` returns
// `[displayValue, displayLabel]` for one payload entry — same contract
// as Recharts' own `<Tooltip formatter>` prop, so callers pass the
// exact function they already had.
export function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__label">{label}</div>
      {payload.map((entry) => {
        const [value, name] = formatter ? formatter(entry.value, entry.name, entry) : [entry.value, entry.name]
        // A Bar's `entry.color` can be a `url(#gradientId)` reference
        // (RegionsChart's gradient fill) rather than a real color, which
        // an inline `background` can't render — fall back to the accent.
        const swatch = entry.color && !entry.color.startsWith('url(') ? entry.color : theme.accentBright
        return (
          <div className="chart-tooltip__row" key={entry.dataKey ?? entry.name}>
            <span className="chart-tooltip__swatch" style={{ background: swatch }} aria-hidden="true" />
            <span className="chart-tooltip__name">{name}</span>
            <span className="chart-tooltip__value">{value}</span>
          </div>
        )
      })}
    </div>
  )
}
