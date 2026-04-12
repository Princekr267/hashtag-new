import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home',     href: '/#home'     },
  { label: 'About',    href: '/#about'    },
  { label: 'Events',   href: '/#events'   },
  { label: 'Team',     href: '/#team'     },
  { label: 'Blogs',    href: '/#blogs'    },
  { label: 'Alumni',   href: '/#alumni'   },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.split('#')[1];
    const el = id ? document.getElementById(id) : null;
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      style={{
        background:    scrolled ? 'rgba(8,8,8,0.88)' : 'transparent',
        backdropFilter:scrolled ? 'blur(20px)'        : 'none',
        borderBottom:  scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        padding:       scrolled ? '0.6rem 0'          : '1.4rem 0',
      }}
    >
      <div
        className="relative flex items-center justify-between"
        style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem)' }}
      >

        {/* ── LEFT: Hashtag Logo ───────────────────────── */}
        <a
          href="/#home"
          onClick={(e) => scrollTo(e, '/#home')}
          className="flex items-center gap-2.5 group"
        >
          <img
            src="/images/hashtag-logo.png"
            alt="#Hashtag Logo"
            className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              const img = e.currentTarget;
              img.style.display = 'none';
              const fallback = img.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div
            className="w-9 h-9 rounded-xl items-center justify-center font-bold text-sm"
            style={{ background: '#C8FF47', color: '#080808', fontFamily: 'DM Mono, monospace', display: 'none' }}
          >
            #
          </div>
          <span
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: '#F0EDE6',
              letterSpacing: '-0.01em',
            }}
          >
            HashTag
          </span>
        </a>

        {/* ── CENTER: Desktop Nav ─────────────────────── */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => scrollTo(e, link.href)}
              className="group relative text-sm transition-colors duration-300"
              style={{ fontFamily: 'DM Sans, Inter, sans-serif', color: 'var(--color-muted)' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#F0EDE6')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--color-muted)')}
            >
              {link.label}
              <span
                className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                style={{ background: '#C8FF47' }}
              />
            </a>
          ))}
        </nav>

        {/* ── RIGHT: Desktop (Contact + JIMS) ─────────── */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="mailto:hashtag@jims.edu.in"
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
            style={{
              background: 'rgba(200,255,71,0.1)',
              color: '#C8FF47',
              border: '1px solid rgba(200,255,71,0.2)',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Contact Us
          </a>

          <img
            src="/images/jims-logo.png"
            alt="JIMS Logo"
            className="w-9 h-9 object-contain transition-transform duration-300 hover:scale-110"
          />
        </div>

        {/* ── RIGHT: Mobile (JIMS + Hamburger) ───────── */}
        <div className="flex items-center gap-3 md:hidden">
          <img
            src="/images/jims-logo.png"
            alt="JIMS Logo"
            className="w-8 h-8 object-contain"
          />

          <button
            className="p-2 rounded-lg"
            style={{ color: '#F0EDE6', background: 'rgba(255,255,255,0.05)' }}
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ───────────────────────── */}
      {isOpen && (
        <div
          className="md:hidden absolute inset-x-0 top-full py-6 px-6 flex flex-col gap-5"
          style={{
            background: 'rgba(8,8,8,0.97)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => scrollTo(e, link.href)}
              className="text-lg font-medium py-2 border-b"
              style={{ fontFamily: '"Playfair Display", serif', color: '#F0EDE6', borderColor: 'rgba(255,255,255,0.06)' }}
            >
              {link.label}
            </a>
          ))}

          {/* ✅ Contact button inside mobile menu */}
          <a
            href="mailto:hashtag@jims.edu.in"
            className="mt-4 text-center py-3 rounded-full text-sm font-medium"
            style={{
              background: '#C8FF47',
              color: '#080808',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Contact Us
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;