export default function Toast({ id, message, type = 'success', onClose }) {
  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{type === 'success' ? '✓' : '✕'}</span>
      <span className="toast-msg">{message}</span>
      {onClose && (
        <button className="toast-close" onClick={() => onClose(id)}>
          ×
        </button>
      )}
    </div>
  )
}
