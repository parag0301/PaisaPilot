import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Landing.css'

// Feature cards shown on the landing page
const features = [
  {
    icon: '💸',
    title: 'Track Income',
    desc: 'Log every rupee that comes in — salary, freelance, or side hustle.',
  },
  {
    icon: '🧾',
    title: 'Track Expenses',
    desc: 'Know exactly where your money goes. No more "where did it all go?" moments.',
  },
  {
    icon: '📊',
    title: 'Smart Dashboard',
    desc: 'See your savings rate, monthly overview, and spending trends at a glance.',
  },
  {
    icon: '🍕',
    title: 'Category Insights',
    desc: 'Break down spending by Food, Transport, Shopping and more.',
  },
  {
    icon: '📥',
    title: 'Excel Reports',
    desc: 'Download your income or expense data anytime as a clean Excel file.',
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    desc: 'Your data stays yours. JWT-based authentication, no funny business.',
  },
]

function Landing() {
  return (
    <div className="landing">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">✨ Your money co-pilot</div>
          <h1 className="hero-title">
            Track your money
            <br />
            <span className="hero-highlight">before it ghosts you.</span>
          </h1>
          <p className="hero-subtitle">
            PaisaPilot helps you stay on top of income, expenses, and savings —
            all in one clean dashboard. No spreadsheets. No stress.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary hero-btn">
              Get Started Free
            </Link>
            <Link to="/login" className="btn btn-outline hero-btn">
              Login
            </Link>
          </div>
        </div>

        {/* Decorative blob */}
        <div className="hero-blob" aria-hidden="true" />
      </section>

      {/* Stats strip */}
      <div className="stats-strip">
        <div className="strip-item">
          <strong>₹0</strong>
          <span>Hidden fees</span>
        </div>
        <div className="strip-divider" />
        <div className="strip-item">
          <strong>100%</strong>
          <span>Your data</span>
        </div>
        <div className="strip-divider" />
        <div className="strip-item">
          <strong>Real-time</strong>
          <span>Dashboard</span>
        </div>
        <div className="strip-divider" />
        <div className="strip-item">
          <strong>Excel</strong>
          <span>Export anytime</span>
        </div>
      </div>

      {/* Features Section */}
      <section className="features">
        <div className="features-inner">
          <div className="section-label">Everything you need</div>
          <h2 className="section-title">Built for people who actually want to save</h2>
          <div className="features-grid">
            {features.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-inner">
          <h2>Ready to stop being broke?</h2>
          <p>One quick signup. Better money habits ahead.</p>
          <Link to="/register" className="btn btn-primary cta-btn">
            Start Tracking for Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} PaisaPilot ·  BCA Final Year Project</p>
      </footer>
    </div>
  )
}

export default Landing
