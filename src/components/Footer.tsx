import React from 'react';
import { useData } from '../hooks/useData';
import { Mail } from 'lucide-react';
import { Github, Linkedin, Instagram, Twitter } from './Icons';

const Footer = () => {
  const { data } = useData();
  
  if (!data?.society) return null;
  const { socials } = data.society;

  return (
    <footer className="relative pt-20 pb-10 border-t border-border overflow-hidden">
      {/* Animated top gradient line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-muted">
        
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img src="/images/hashtag-logo.png" alt="HashTag Logo" className="w-10 h-10 object-contain" />
            <span className="font-heading font-bold text-2xl text-text">#HashTag</span>
          </div>
          <p className="text-sm max-w-sm">{data.society.tagline}</p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-text font-heading font-semibold">Quick Links</h4>
          <nav className="flex flex-col gap-2">
            <a href="#about" className="hover:text-primary transition-colors hover:underline">About Us</a>
            <a href="#events" className="hover:text-primary transition-colors hover:underline">Events</a>
            <a href="#projects" className="hover:text-primary transition-colors hover:underline">Projects</a>
          </nav>
        </div>

        {/* Social & Contact CTA */}
        <div className="flex flex-col gap-6">
          <h4 className="text-text font-heading font-semibold">Connect & Join</h4>
          <div className="flex gap-4">
            <a href={socials.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface rounded hover:bg-border transition-colors"><Github className="w-5 h-5 text-white" /></a>
            <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface rounded hover:bg-border transition-colors"><Linkedin className="w-5 h-5 text-[#0077b5]" /></a>
            <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface rounded hover:bg-border transition-colors"><Instagram className="w-5 h-5 text-[#e1306c]" /></a>
            <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface rounded hover:bg-border transition-colors"><Twitter className="w-5 h-5 text-[#1da1f2]" /></a>
          </div>
          <a href="mailto:hello@hashtag.com" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-surface hover:bg-white/5 transition-all w-fit group">
            <Mail className="w-4 h-4 group-hover:text-primary transition-colors" />
            <span className="text-white">Email Us</span>
          </a>
        </div>
      </div>
      
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <p>© {new Date().getFullYear()} {data.society.name}. All rights reserved.</p>
        <p>Built with React & Vite.</p>
      </div>
    </footer>
  );
};

export default Footer;
