import { X } from 'lucide-react'
import './Modal.css'

// Reusable modal wrapper
// Props: isOpen, onClose, title, children
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  // Close when clicking the backdrop
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-box">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export default Modal
