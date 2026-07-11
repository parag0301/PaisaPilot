import './StatCard.css'

// Reusable stat card — used on dashboard and overview sections
// Props: title, value, subtitle, icon, color ('primary' | 'income' | 'expense' | 'savings')
function StatCard({ title, value, subtitle, icon, color = 'primary' }) {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-top">
        <p className="stat-title">{title}</p>
        {icon && <div className="stat-icon">{icon}</div>}
      </div>
      <p className="stat-value">{value}</p>
      {subtitle && <p className="stat-subtitle">{subtitle}</p>}
    </div>
  )
}

export default StatCard
