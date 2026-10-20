import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { VerifiedBadge } from './VerifiedBadge';

export const Hero: React.FC = () => {
  const { profile } = useProjects();
  const [imageError, setImageError] = useState(false);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="hero" id="about">
      <div className="hero-text">
        <div className="hero-badge">{profile.badgeText}</div>
        <h1 className="hero-name" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span>
            <span style={{ color: 'var(--blue)' }}>NABEEL</span> <span style={{ color: '#000000' }}>AHMAD</span>
          </span>
          <VerifiedBadge size={28} />
        </h1>
        <p className="hero-tagline">{profile.tagline}</p>
        <p className="hero-desc">{profile.bio}</p>
        <div className="hero-buttons">
          <a
            href="#projects"
            className="btn-primary"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('projects');
            }}
          >
            View My Work →
          </a>
          <a
            href="#contact"
            className="btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('contact');
            }}
          >
            Get In Touch
          </a>
        </div>
      </div>

      {/* PHOTO CIRCLE WITH GLOW */}
      <div className="hero-photo-wrap" style={{ position: 'relative' }}>
        <div className="photo-inner">
          {!imageError ? (
            <img
              src={profile.profileImage || '2.png'}
              alt="Nabeel Ahmad"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: profile.profileImagePosition || 'center 10%',
                transform: profile.profileImageZoom && profile.profileImageZoom > 1 ? `scale(${profile.profileImageZoom})` : undefined,
              }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="photo-placeholder">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span>Nabeel Ahmad</span>
            </div>
          )}
        </div>

        <div className="float-badge b1">
          <div className="dot" style={{ background: 'var(--teal)' }}></div>
          {profile.experienceYears}
        </div>
        <div className="float-badge b2">
          🚀 {profile.projectsCount}
        </div>
      </div>
    </div>
  );
};
