import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { Mail, MapPin } from 'lucide-react'

export default function Footer(): JSX.Element {
  const displayRef = useRef<HTMLDivElement>(null)
  const triggered  = useRef(false)

  useEffect(() => {
    const el = displayRef.current
    if (!el || triggered.current) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      el.classList.add('revealed')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || triggered.current) return
          triggered.current = true
          // Small delay so user sees it enter
          setTimeout(() => el.classList.add('revealed'), 100)
          observer.unobserve(el)
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <footer className="relative border-t mt-20" style={{ borderColor: 'var(--outline-var)' }}>
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center">
        <div className="absolute top-0 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" />
        <div className="absolute -top-32 w-[500px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      {/* ── Typographic display text reveal ── */}
      <div
        className="overflow-hidden border-b"
        style={{ borderColor: 'var(--outline-var)' }}
      >
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
          <div
            ref={displayRef}
            className="footer-display-text gpu-accel"
            aria-hidden="true"
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              opacity: 0.15,
            }}
          >
            #HASHTAG
          </div>

          <p className="text-text-faint text-[10px] font-label tracking-[0.4em] uppercase mt-4">
            Hashtag Official — Tech Society at JIMS Greater Noida
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-20">
          
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <NavLink to="/" className="flex items-center group px-1" aria-label="Home">
                <img
                  src="/hashtag-logo.png"
                  alt="Hashtag Official"
                  className="h-12 w-auto object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_12px_var(--primary-glow)]"
                />
              </NavLink>
              <div className="h-8 w-px bg-outline-var hidden sm:block" />
              <a
                href="https://jimsgn.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-1"
                aria-label="JIMS Greater Noida"
              >
                <img
                  src="/jims-logo.png"
                  alt="JIMS Greater Noida"
                  className="h-9 w-auto object-contain opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                />
              </a>
            </div>
            <p className="text-text-muted font-body leading-relaxed max-w-sm mb-8">
              We are a community of developers, designers, and creators coming together to build the future at JIMS. Join us to learn, innovate, and grow.
            </p>
            <div className="flex gap-4">
              {[
                { label: 'X', path: 'https://x.com/Hashtag_Jemtec', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M20 4L4 20"/></svg> },
                { label: 'Instagram', path: 'https://www.instagram.com/hashtag.jemtec', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> },
                { label: 'LinkedIn', path: 'https://www.linkedin.com/company/hashtag-jemtec-official/', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg> },
                { label: 'YouTube', path: 'https://www.youtube.com/@hashtagjemtec', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><polygon points="10 9 15 12 10 15"/></svg> },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-text-muted hover:text-primary hover:border-primary transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-text-primary font-display font-bold text-sm uppercase tracking-widest mb-8">Navigation</h3>
            <ul className="flex flex-col gap-4">
              <li><a href="/"       className="text-text-muted hover:text-white transition-colors text-xs font-label tracking-[0.15em] p-1">HOME</a></li>
              <li><a href="/about"  className="text-text-muted hover:text-white transition-colors text-xs font-label tracking-[0.15em] p-1">ABOUT US</a></li>
              <li><a href="/events" className="text-text-muted hover:text-white transition-colors text-xs font-label tracking-[0.15em] p-1">EVENTS</a></li>
              <li><a href="/team"   className="text-text-muted hover:text-white transition-colors text-xs font-label tracking-[0.15em] p-1">TEAM</a></li>
              <li><a href="/blogs"  className="text-text-muted hover:text-white transition-colors text-xs font-label tracking-[0.15em] p-1">BLOGS</a></li>
              <li><a href="/alumni" className="text-text-muted hover:text-white transition-colors text-xs font-label tracking-[0.15em] p-1">ALUMNI</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-text-primary font-display font-bold text-sm uppercase tracking-widest mb-8">Contact</h3>
            <ul className="flex flex-col gap-5 mb-8">
              <li className="text-text-muted text-[13px] flex items-start gap-3">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-primary" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=48%2F4%2C%20Knowledge%20Park%20III%2C%20Greater%20Noida%2C%20Noida%2C%20Uttar%20Pradesh%20201310"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leading-snug opacity-80 hover:text-primary transition-colors"
                  aria-label="Open location in Google Maps"
                  title="Open location in Google Maps"
                >
                  48/4, Knowledge Park III, Greater Noida, Noida, Uttar Pradesh 201310
                </a>
              </li>
              <li className="text-text-muted text-[13px] flex items-center gap-3">
                <Mail size={14} className="flex-shrink-0 text-primary" />
                <a href="mailto:hashtag.gn@jagannath.org" className="leading-snug opacity-80 hover:text-primary transition-colors" aria-label="Email hashtag">
                  hashtag.gn@jagannath.org
                </a>
              </li>
            </ul>
            <div className="lg:hidden">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal'))}
                className="btn-ghost inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase p-3 cursor-pointer"
              >
                <Mail size={14} />
                <span>Contact Us</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 flex border-t justify-between items-center flex-wrap gap-6" style={{ borderColor: 'var(--outline-var)' }}>
          <p className="text-text-faint text-[10px] font-label tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} HASHTAG OFFICIAL. ALL RIGHTS RESERVED.
          </p>
          <div className="text-text-faint text-xs font-body opacity-60">
            Crafted with passion by the Hashtag Team
          </div>
        </div>
      </div>
    </footer>
  )
}
