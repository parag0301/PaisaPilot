import { Link } from 'react-router-dom'
import './NotFound.css'

function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <div className="notfound-emoji">🛸</div>
        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-title">Page not found</h2>
        <p className="notfound-subtitle">
          Looks like this page took a trip without telling us. Let's get you back on track.
        </p>
        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary">
            Go to Home
          </Link>
          <Link to="/dashboard" className="btn btn-outline">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
