import Modal from './Modal.jsx'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title = 'Are you sure?', message }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="420px">
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        {message}
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button className="btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn-danger" onClick={() => { onConfirm(); onClose() }}>Confirm</button>
      </div>
    </Modal>
  )
}
