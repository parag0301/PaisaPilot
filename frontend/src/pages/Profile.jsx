import { useState, useEffect } from 'react'
import { LogOut, User, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import Loader from '../components/Loader'
import api from '../api/axios'
import './Profile.css'

function Profile() {
  const navigate = useNavigate()

  // Get initial user data from localStorage (populated on login)
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}')

  const [user, setUser] = useState(storedUser)
  const [loading, setLoading] = useState(true)

  // Profile update form
  const [profileForm, setProfileForm] = useState({ name: '', email: '' })
  const [profileLoading, setProfileLoading] = useState(false)

  // Password change form
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passLoading, setPassLoading] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [])

  // Fetch current user info from backend
  async function fetchUser() {
    try {
      const res = await api.get('/api/users/me')
      const userData = res.data.user || res.data
      setUser(userData)
      setProfileForm({ name: userData.name || '', email: userData.email || '' })
    } catch (err) {
      // If fetch fails, fall back to stored user
      setProfileForm({ name: storedUser.name || '', email: storedUser.email || '' })
    } finally {
      setLoading(false)
    }
  }

  // Update profile (name and email)
  async function handleProfileUpdate(e) {
    e.preventDefault()
    if (!profileForm.name || !profileForm.email) {
      toast.error('Name and email are required')
      return
    }

    setProfileLoading(true)
    try {
      await api.put('/api/users/profile', profileForm)
      // Update localStorage so sidebar shows updated name
      const updated = { ...user, ...profileForm }
      localStorage.setItem('user', JSON.stringify(updated))
      setUser(updated)
      toast.success('Profile updated! ✅')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile'
      toast.error(msg)
    } finally {
      setProfileLoading(false)
    }
  }

  // Change password
  async function handlePasswordChange(e) {
    e.preventDefault()
    if (!passForm.currentPassword || !passForm.newPassword) {
      toast.error('Please fill in all password fields')
      return
    }
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (passForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }

    setPassLoading(true)
    try {
      await api.put('/api/users/password', {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      })
      toast.success('Password changed successfully! 🔐')
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password'
      toast.error(msg)
    } finally {
      setPassLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Loader />
        </main>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-header">
          <h1>Profile</h1>
          <p>Manage your account settings.</p>
        </div>

        {/* Profile header card */}
        <div className="card profile-hero">
          <div className="profile-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{user?.name}</h2>
            <p className="profile-email">{user?.email}</p>
          </div>
          <button className="btn btn-danger logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <div className="profile-grid">
          {/* Update Profile Form */}
          <div className="card">
            <h2 className="card-section-title">
              <User size={18} /> Update Profile
            </h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  placeholder="you@email.com"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={profileLoading}
              >
                {profileLoading ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="card">
            <h2 className="card-section-title">
              <Lock size={18} /> Change Password
            </h2>
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={passForm.currentPassword}
                  onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
                  placeholder="Your current password"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={passForm.newPassword}
                  onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                  placeholder="New password (min 6 chars)"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={passForm.confirmPassword}
                  onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                  placeholder="Repeat new password"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={passLoading}
              >
                {passLoading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile
