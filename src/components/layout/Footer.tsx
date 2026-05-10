import { useEffect, useRef } from 'react'
import { Mail } from 'lucide-react'

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
              <img src="/hashtag-logo.png" alt="Hashtag Official" className="h-12 w-auto" />
              <div className="h-8 w-px bg-outline-var hidden sm:block" />
              <img src="/jims-logo.png" alt="JIMS Greater Noida" className="h-9 w-auto opacity-70 grayscale hover:grayscale-0 transition-all" />
            </div>
            <p className="text-text-muted font-body leading-relaxed max-w-sm mb-8">
              We are a community of developers, designers, and creators coming together to build the future at JIMS. Join us to learn, innovate, and grow.
            </p>
            <div className="flex gap-4">
              {[
                { label: 'Twitter', path: '#', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg> },
                { label: 'Instagram', path: '#', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> },
                { label: 'LinkedIn', path: '#', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg> },
                { label: 'GitHub', path: '#', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.path}
                  className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-text-muted hover:text-primary hover:border-primary transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
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
              <li><a href="/about"  className="text-text-muted hover:text-white transition-colors text-xs font-label tracking-[0.15em] p-1">ABOUT US</a></li>
              <li><a href="/events" className="text-text-muted hover:text-white transition-colors text-xs font-label tracking-[0.15em] p-1">EVENTS</a></li>
              <li><a href="/team"   className="text-text-muted hover:text-white transition-colors text-xs font-label tracking-[0.15em] p-1">TEAM</a></li>
              <li><a href="/blogs"  className="text-text-muted hover:text-white transition-colors text-xs font-label tracking-[0.15em] p-1">BLOGS</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-text-primary font-display font-bold text-sm uppercase tracking-widest mb-8">Contact</h3>
            <ul className="flex flex-col gap-5 mb-8">
              <li className="text-text-muted text-[13px] flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5 shadow-[0_0_8px_var(--primary-glow)]" />
                <span className="leading-snug opacity-80">JIMS EMTC, 48/4, Knowledge Park III, Greater Noida, UP 201306</span>
              </li>
              <li className="text-text-muted text-[13px] flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 shadow-[0_0_8px_var(--primary-glow)]" />
                <a href="mailto:contact@hashtagofficial.in" className="hover:text-primary transition-colors leading-none font-medium">contact@hashtagofficial.in</a>
              </li>
            </ul>
            <div className="lg:hidden">
              <a 
                href="mailto:contact@hashtagofficial.in" 
                className="btn-ghost inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase p-3"
              >
                <Mail size={14} />
                <span>Contact Us</span>
              </a>
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
