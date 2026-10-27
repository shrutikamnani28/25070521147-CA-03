import { useEffect, useRef } from 'react'

export default function Modal({ isOpen, onClose, title, children, maxWidth = '520px' }) {
  const boxRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    // Focus first focusable element
    const el = boxRef.current?.querySelector('button, input, select, textarea, a[href]')
    el?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="overlay fade-in" onClick={onClose}>
      <div
        ref={boxRef}
        className="modal-box"
        style={{ maxWidth }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}
