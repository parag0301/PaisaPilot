import { NavLink, useNavigate } from 'react-router-dom'
import ThemeToggle from "./ThemeToggle.jsx";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  User,
  LogOut,
  RefreshCw,
} from 'lucide-react'
import './Sidebar.css'

// Navigation items for the sidebar
const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/income', label: 'Income', icon: TrendingUp },
  { to: '/expense', label: 'Expense', icon: TrendingDown },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: "/recurring", label: "Recurring", icon: RefreshCw },
  { to: '/profile', label: 'Profile', icon: User },
]

function Sidebar() {
  const navigate = useNavigate()

  // Get user name from localStorage (saved on login)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      {/* Brand logo */}
      <div className="sidebar-brand">
        <span className="brand-icon-sidebar">✈</span>
        <span>PaisaPilot</span>
      </div>

      {/* User greeting */}
      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="user-info">
          <p className="user-name">{user?.name || 'User'}</p>
          <p className="user-email">{user?.email || ''}</p>
        </div>
      </div>

      <div className="sidebar-divider" />

      {/* Navigation links */}
      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout button at bottom */}
      <button className="sidebar-logout" onClick={handleLogout}>
        <LogOut size={18} />
        <span>Logout</span>
      </button>

      {/* Theme toggle */}
      <ThemeToggle />
    </aside>
  )
}

export default Sidebar
