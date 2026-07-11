import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import './Auth.css'

function Login() {
  const navigate = useNavigate()

  // Form state
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // Basic client-side validation
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      const res = await api.post('/api/users/login', form)

      // Save token and user data to localStorage
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))

      toast.success(`Welcome back, ${res.data.user.name}! 👋`)
      navigate('/dashboard')
    } catch (err) {
      // Show backend error message if available
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-brand">✈ PaisaPilot</div>
          <h1 className="auth-title">Welcome back!</h1>
          <p className="auth-subtitle">Login to your account and stay on track.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="you@email.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={loading}
            >
              {loading ? 'Logging in…' : 'Login →'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign up free
            </Link>
          </p>
        </div>

        {/* Right side decorative panel */}
        <div className="auth-panel">
          <div className="auth-panel-content">
            <div className="panel-quote">"Your wallet called. It needs a co-pilot."</div>
            <div className="panel-sub">Join PaisaPilot and take control of your finances.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
