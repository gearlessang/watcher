interface MetricCardProps {
  label:    string
  value:    string | number
  sub?:     string
  accent?:  'green' | 'yellow' | 'red' | 'blue'
}

const ACCENT_COLORS = {
  green:  '#00ff88',
  yellow: '#ffcc00',
  red:    '#ff3355',
  blue:   '#4488ff',
}

export default function MetricCard({ label, value, sub, accent = 'green' }: MetricCardProps) {
  const color = ACCENT_COLORS[accent]
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: '#0d0d12',
        border: '1px solid #1c1c28',
        padding: '16px 20px',
        animation: 'fadeIn 0.4s ease both',
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: 3, height: '100%',
          background: color,
        }}
      />
      <div style={{ fontSize: 9, color: '#44445a', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 10, color: '#666680', marginTop: 4 }}>{sub}</div>
      )}
    </div>
  )
}
