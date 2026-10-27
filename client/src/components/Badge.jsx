const MAP = {
  Floral:     'badge-floral',
  Woody:      'badge-woody',
  Fresh:      'badge-fresh',
  Oriental:   'badge-oriental',
  'low-stock':'badge-low-stock',
  'out-stock':'badge-out-stock',
  Unisex:     'badge-unisex',
  'For Her':  'badge-forher',
  'For Him':  'badge-forhim',
  admin:      'badge-admin',
}

export default function Badge({ type, children }) {
  const cls = MAP[type] || 'badge-unisex'
  return (
    <span className={`badge ${cls}`}>
      {children || type}
    </span>
  )
}
