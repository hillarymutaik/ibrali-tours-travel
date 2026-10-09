import { useLayoutEffect, useRef, useState } from 'react'
import { ChartColumn, Table2 } from 'lucide-react'
import { Card, CardHeader } from './ui'
import { thCls, tdCls, rowCls } from './styles'

/* Chart tokens — the website's brand orange (#E75A08) as the single series
   colour, validated on the white card surface: lightness band, chroma floor
   and 3:1 contrast all pass. Hover darkens to brand-600 (the lighter #F2843A
   would drop below 3:1). Text never wears the series colour; it uses the ink
   tokens below. Gridlines sit one step lighter than card borders. */
const VIZ = {
  series: '#E75A08',
  seriesHover: '#C2470A',
  grid: '#EFE9DF',
  baseline: '#D9CFBF',
  band: '#F2EDE5',
  muted: '#7A7268',
  ink: '#1C1A17',
  ink2: '#4A4540',
}

/** Rounded ticks (0 / 500 / 1,000 …) and the axis top. */
function niceScale(max, integer) {
  if (max <= 0) {
    const top = integer ? 4 : 1000
    return { top, ticks: [0, top / 4, top / 2, (top * 3) / 4, top] }
  }
  const rough = max / 4
  const pow = 10 ** Math.floor(Math.log10(rough))
  let step = [1, 2, 2.5, 5, 10].map((s) => s * pow).find((s) => s >= rough)
  if (integer) step = Math.max(1, Math.ceil(step))
  const top = Math.ceil(max / step) * step
  const ticks = []
  for (let v = 0; v <= top + step / 1000; v += step) ticks.push(Number(v.toFixed(6)))
  return { top, ticks }
}

/** Column path: 4px rounded data-end, square at the baseline. */
function columnPath(x, y, w, base) {
  const h = base - y
  if (h <= 0) return ''
  const r = Math.min(4, w / 2, h)
  return `M${x},${base} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${base} Z`
}

/**
 * Single-series column chart over time. One axis, hairline grid, the peak
 * labelled on its cap, a tooltip per column on hover and keyboard focus.
 */
export function ColumnChart({ data, format, formatAxis = format, integer = false, height = 240, label, emptyText = 'No data in this period' }) {
  const wrap = useRef(null)
  const [width, setWidth] = useState(0)
  const [active, setActive] = useState(null)

  useLayoutEffect(() => {
    const el = wrap.current
    if (!el) return
    // ResizeObserver reports the initial size as soon as it starts observing
    const ro = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const n = data.length
  const max = Math.max(0, ...data.map((d) => d.value))
  const { top, ticks } = niceScale(max, integer)
  const tickLabels = ticks.map((t) => formatAxis(t))
  const padL = Math.max(32, Math.max(...tickLabels.map((s) => s.length)) * 6.6 + 14)
  const padR = 6
  const padT = 22
  const padB = 28
  const plotW = Math.max(0, width - padL - padR)
  const plotH = height - padT - padB
  const base = padT + plotH
  const band = n ? plotW / n : 0
  const colW = Math.min(24, Math.max(3, band * 0.62))
  const y = (v) => padT + plotH - (top ? (v / top) * plotH : 0)
  const cx = (i) => padL + band * i + band / 2

  const maxLabels = Math.max(2, Math.floor(plotW / 64))
  const step = Math.max(1, Math.ceil(n / maxLabels))
  const peak = max > 0 ? data.findIndex((d) => d.value === max) : -1
  const hovered = active !== null ? data[active] : null

  return (
    <div ref={wrap} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label={label} className="block overflow-visible">
          {/* Hover band behind the active column (the crosshair for columns) */}
          {active !== null && (
            <rect x={padL + band * active} y={padT} width={band} height={plotH} fill={VIZ.band} rx={4} />
          )}

          {/* Gridlines + y ticks */}
          {ticks.map((t, i) => (
            <g key={t}>
              <line x1={padL} x2={width - padR} y1={y(t)} y2={y(t)} stroke={i === 0 ? VIZ.baseline : VIZ.grid} strokeWidth={1} shapeRendering="crispEdges" />
              <text x={padL - 10} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill={VIZ.muted} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {tickLabels[i]}
              </text>
            </g>
          ))}

          {/* Columns */}
          {data.map((d, i) => (
            <path
              key={d.key ?? i}
              d={columnPath(cx(i) - colW / 2, y(d.value), colW, base)}
              fill={active === i ? VIZ.seriesHover : VIZ.series}
            />
          ))}

          {/* Selective direct label: the peak only */}
          {peak >= 0 && active === null && (
            <text x={cx(peak)} y={y(max) - 7} textAnchor="middle" fontSize={11} fontWeight={600} fill={VIZ.ink2}>
              {formatAxis(max)}
            </text>
          )}

          {/* X labels, thinned from the most recent backwards so the latest period is always named */}
          {data.map((d, i) => ((n - 1 - i) % step === 0 ? (
            <text key={`x${i}`} x={cx(i)} y={height - 8} textAnchor="middle" fontSize={11} fill={VIZ.muted}>
              {d.label}
            </text>
          ) : null))}

          {/* Hit targets: the whole slot, not just the painted column */}
          {data.map((d, i) => (
            <rect
              key={`h${i}`}
              x={padL + band * i}
              y={padT}
              width={band}
              height={plotH}
              fill="transparent"
              tabIndex={0}
              aria-label={`${d.longLabel ?? d.label}: ${format(d.value)}`}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="focus:outline-none"
            />
          ))}
        </svg>
      )}

      {max === 0 && width > 0 && (
        <div className="absolute inset-x-0 top-0 flex items-center justify-center pointer-events-none" style={{ height: padT + plotH }}>
          <span className="text-[13px] text-[#7A7268] bg-white/90 px-3 py-1 rounded-md">{emptyText}</span>
        </div>
      )}

      {hovered && (
        <div
          aria-hidden="true"
          className="absolute z-10 pointer-events-none rounded-lg bg-white px-3 py-2 shadow-[0_12px_16px_-4px_rgba(28,26,23,0.08),0_4px_6px_-2px_rgba(28,26,23,0.03)] ring-1 ring-[#E3DCCD] whitespace-nowrap"
          style={{
            left: Math.min(Math.max(cx(active), 70), width - 70),
            top: Math.max(0, y(hovered.value) - 10),
            transform: 'translate(-50%, -100%)',
          }}
        >
          <p className="text-sm font-semibold text-[#1C1A17]" style={{ fontVariantNumeric: 'tabular-nums' }}>{format(hovered.value)}</p>
          <p className="text-xs text-[#6B6560] mt-0.5 flex items-center gap-1.5">
            <span className="inline-block w-3 h-0.5 rounded-full" style={{ background: VIZ.series }} />
            {hovered.longLabel ?? hovered.label}
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * Horizontal bars for comparing magnitudes across named items (one hue —
 * the items are nominal, so bar length alone carries the value).
 * Value sits at the bar tip; the secondary line (e.g. booking count) is visible text.
 */
export function BarList({ items, format }) {
  const max = Math.max(0, ...items.map((i) => i.value))
  return (
    <ul className="space-y-4">
      {items.map((item) => {
        const frac = max ? item.value / max : 0
        return (
          <li key={item.key} className="group">
            <div className="flex items-baseline justify-between gap-3 mb-1.5">
              <span className="text-sm font-medium text-[#4A4540] truncate">{item.label}</span>
              {item.sub && <span className="text-xs text-[#7A7268] whitespace-nowrap">{item.sub}</span>}
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-2.5 rounded-r-[4px] transition-colors bg-[#E75A08] group-hover:bg-[#C2470A]"
                style={{ width: `calc((100% - 88px) * ${frac})`, minWidth: item.value > 0 ? 3 : 0 }}
              />
              <span className="text-[13px] font-semibold text-[#1C1A17] whitespace-nowrap" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {format(item.value)}
              </span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/**
 * Card wrapper with a Chart / Table switch — every chart has a table-view
 * twin so no value is reachable only by hovering.
 */
export function ChartCard({ title, subtitle, table, children, className = '' }) {
  const [view, setView] = useState('chart')
  const toggle = (
    <div className="inline-flex p-0.5 rounded-lg bg-[#F2EDE5] border border-[#E3DCCD]" role="group" aria-label={`${title} view`}>
      {[
        { id: 'chart', icon: ChartColumn, label: 'Chart view' },
        { id: 'table', icon: Table2, label: 'Table view' },
      ].map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => setView(o.id)}
          aria-pressed={view === o.id}
          aria-label={o.label}
          title={o.label}
          className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${view === o.id ? 'bg-white text-[#1C1A17] shadow-[0_1px_2px_rgba(28,26,23,0.1)]' : 'text-[#7A7268] hover:text-[#4A4540]'}`}
        >
          <o.icon size={15} strokeWidth={1.9} />
        </button>
      ))}
    </div>
  )

  return (
    <Card className={className}>
      <CardHeader title={title} subtitle={subtitle} actions={table ? toggle : null} />
      <div className="px-5 pb-5">
        {view === 'chart' || !table ? children : (
          <div className="max-h-[260px] overflow-auto rounded-lg border border-[#E3DCCD]">
            <table className="w-full">
              <thead className="sticky top-0">
                <tr>
                  {table.columns.map((c) => (
                    <th key={c.label} className={`${thCls} ${c.align === 'right' ? 'text-right' : ''}`}>{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((r, i) => (
                  <tr key={i} className={rowCls}>
                    {r.map((cell, j) => (
                      <td key={j} className={`${tdCls} !py-2.5 ${table.columns[j].align === 'right' ? 'text-right tabular-nums text-[#1C1A17] font-medium' : ''}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  )
}
