import React from 'react';
import { useData } from '../../hooks/useData';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Blogs: React.FC = () => {
  const { data } = useData();

  if (!data?.blogs || !Array.isArray(data.blogs) || data.blogs.length === 0) return null;

  return (
    <section
      id="blogs"
      className="py-32 relative overflow-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/3 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: '#7B61FF', opacity: 0.04, filter: 'blur(100px)' }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">

        {/* Header */}
        <p
          className="mb-4"
          style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '0.78rem',
            color: 'var(--color-muted)',
            letterSpacing: '0.15em',
          }}
        >
          05 — Blogs
        </p>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <h2
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 700,
              color: '#F0EDE6',
              lineHeight: 1.1,
            }}
          >
            Words from our{' '}
            <em style={{ color: '#7B61FF', fontStyle: 'italic' }}>writers.</em>
          </h2>
          <p style={{ color: 'var(--color-muted)', maxWidth: '36ch', fontSize: '0.95rem' }}>
            Tutorials, opinions, and deep dives from the HashTag community.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {data.blogs.map((blog: any, i: number) => (
            <motion.a
              key={blog.id}
              href={blog.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group flex flex-col rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(123,97,255,0.3)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(123,97,255,0.08)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {/* Thumbnail */}
              <div className="relative overflow-hidden" style={{ height: '180px' }}>
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      `https://api.dicebear.com/7.x/shapes/svg?seed=${blog.id}&backgroundColor=0f0f0f`;
                  }}
                />
                {/* Tag badge */}
                <span
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                  style={{
                    background: 'rgba(123,97,255,0.15)',
                    color: '#7B61FF',
                    border: '1px solid rgba(123,97,255,0.25)',
                    fontFamily: 'DM Mono, monospace',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {blog.tag}
                </span>
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 p-4 sm:p-6 gap-2 sm:gap-3">
                <h3
                  className="group-hover:text-[#7B61FF] transition-colors duration-300 line-clamp-2"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 700,
                    fontSize: 'clamp(1rem, 3vw, 1.15rem)',
                    color: '#F0EDE6',
                    lineHeight: 1.3,
                  }}
                >
                  {blog.title}
                </h3>

                <p
                  className="flex-1 line-clamp-3"
                  style={{
                    color: 'var(--color-muted)',
                    fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
                    lineHeight: 1.65,
                  }}
                >
                  {blog.excerpt}
                </p>

                {/* Footer row */}
                <div className="flex items-center justify-between pt-2 sm:pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <p style={{ color: '#F0EDE6', fontSize: 'clamp(0.75rem, 2.5vw, 0.8rem)', fontWeight: 600 }}>{blog.author}</p>
                    <p style={{ color: 'var(--color-muted)', fontSize: 'clamp(0.65rem, 2vw, 0.72rem)', fontFamily: 'DM Mono, monospace' }}>{blog.date}</p>
                  </div>
                  <span
                    className="flex items-center gap-1 text-xs font-medium group-hover:gap-2 transition-all duration-300"
                    style={{ color: '#7B61FF' }}
                  >
                    Read
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;