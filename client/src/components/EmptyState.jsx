export default function EmptyState({ icon = '✦', title, subtitle, ctaLabel, onCta }) {
  return (
    <div className="empty-state slide-up">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {subtitle && <p className="empty-state-sub">{subtitle}</p>}
      {ctaLabel && onCta && (
        <button className="btn-gold" style={{ marginTop: '0.75rem' }} onClick={onCta}>
          {ctaLabel}
        </button>
      )}
    </div>
  )
}
