import './EmptyState.css'

// Shows a friendly empty state when there's no data yet
// Props: title, subtitle, icon (emoji string)
function EmptyState({ title = 'Nothing here yet', subtitle = 'Add some data to get started.', icon = '📭' }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-subtitle">{subtitle}</p>
    </div>
  )
}

export default EmptyState
