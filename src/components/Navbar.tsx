import React, { useState, useEffect } from 'react';
import { Menu, X, PlusCircle } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { VerifiedBadge } from './VerifiedBadge';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { setIsAdminOpen } = useProjects();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="app-nav" style={{ boxShadow: scrolled ? '0 4px 20px rgba(30, 111, 232, 0.08)' : 'none' }}>
      <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }} className="nav-logo">
        <span className="logo-nabeel">NABEEL</span>&nbsp;<span className="logo-ahmad">AHMAD</span>
        <VerifiedBadge size={16} />
      </a>

      <button
        type="button"
        className="nav-mobile-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
        <li>
          <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>
            About
          </a>
        </li>
        <li>
          <a href="#skills" onClick={(e) => { e.preventDefault(); scrollTo('skills'); }}>
            Skills
          </a>
        </li>
        <li>
          <a href="#projects" onClick={(e) => { e.preventDefault(); scrollTo('projects'); }}>
            Projects
          </a>
        </li>
        <li>
          <a href="#experience" onClick={(e) => { e.preventDefault(); scrollTo('experience'); }}>
            Experience
          </a>
        </li>
        <li>
          <a
            href="#contact"
            className="nav-cta"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('contact');
            }}
          >
            Contact →
          </a>
        </li>
        <li>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setIsAdminOpen(true);
            }}
            title="Open Admin Portal to add/edit projects"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1.5px solid var(--border-strong)',
              background: 'rgba(30, 111, 232, 0.06)',
              color: 'var(--blue)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}
          >
            <PlusCircle size={14} />
            Admin Portal
          </button>
        </li>
      </ul>
    </nav>
  );
};
