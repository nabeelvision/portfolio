import React from 'react';
import { ArrowUp } from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="app-footer">
      <div className="footer-copy" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
        <span>© 2026</span>&nbsp;
        <span style={{ color: 'var(--blue)', fontWeight: 700 }}>NABEEL</span>&nbsp;
        <span style={{ color: '#000000', fontWeight: 700 }}>AHMAD</span>
        <VerifiedBadge size={15} />
      </div>

      <div className="footer-links">
        <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>
          About
        </a>
        <a href="#skills" onClick={(e) => { e.preventDefault(); scrollTo('skills'); }}>
          Skills
        </a>
        <a href="#projects" onClick={(e) => { e.preventDefault(); scrollTo('projects'); }}>
          Projects
        </a>
        <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>
          Contact
        </a>
        <button
          type="button"
          onClick={scrollToTop}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-light)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.8rem',
            padding: 0,
          }}
          title="Back to top"
        >
          <ArrowUp size={14} />
          Top
        </button>
      </div>
    </footer>
  );
};
