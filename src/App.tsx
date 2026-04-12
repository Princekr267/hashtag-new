import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load pages for code splitting
const HomePage = React.lazy(() => import('./pages/Home'));

function App() {
  // NOTE: Lenis removed — it was causing the ~2s scroll delay.
  // Native scroll with CSS scroll-behavior: smooth is used instead,
  // which gives instant response while still being smooth.

  return (
    <Router>
      <div className="relative min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
        {/* Noise grain overlay */}
        <div className="noise-overlay" aria-hidden="true" />

        <Navbar />

        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--color-bg)' }}>
              <div
                className="w-10 h-10 rounded-full border-2 animate-spin"
                style={{ borderColor: 'transparent', borderTopColor: '#C8FF47' }}
              />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Suspense>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
