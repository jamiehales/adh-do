function App() {
  return (
    <div className="app">
      <header className="hero">
        <div className="logo">
          <span className="logo-adh">ADH</span>
          <span className="logo-dash">-</span>
          <span className="logo-do">Do</span>
          <span className="logo-check"> ✓</span>
        </div>
        <p className="tagline">
          A to-do app designed for brains that work differently.
          <br />
          <strong>Together, one task at a time.</strong>
        </p>
      </header>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">🧠</div>
          <h3>ADHD-Friendly</h3>
          <p>Simple, clear, and free from distractions</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💑</div>
          <h3>Built for Two</h3>
          <p>Share tasks and stay in sync as a couple</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Focus Mode</h3>
          <p>Zero in on what matters most right now</p>
        </div>
      </section>

      <button className="cta-button">
        Let's Get Started →
      </button>
    </div>
  )
}

export default App
