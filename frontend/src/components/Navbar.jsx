import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'
// import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">✈</span>
          PaisaPilot
        </Link>

        {/* Auth buttons */}
        <div className="navbar-links">
          {/* <ThemeToggle compact /> */}
          <Link
            to="/login"
            className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
          >
            Login
          </Link>
          <Link to="/register" className="btn btn-primary nav-cta">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
