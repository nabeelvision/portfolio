import React from 'react';
import { X, ExternalLink, CheckCircle2 } from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <span className="project-cat">{project.category}</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: 4 }}>
              {project.title}
            </h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {project.previewImage || project.imageUrl ? (
            <div
              style={{
                width: '100%',
                height: '220px',
                borderRadius: '14px',
                overflow: 'hidden',
                marginBottom: '20px',
                border: '1px solid var(--border)',
                background: '#0D1B2A',
              }}
            >
              <img
                src={project.previewImage || project.imageUrl}
                alt={project.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: project.imageFit || 'cover',
                  objectPosition: project.imagePosition || 'center',
                  transform: project.imageZoom && project.imageZoom > 1 ? `scale(${project.imageZoom})` : undefined,
                  transition: 'transform 0.3s ease',
                }}
              />
            </div>
          ) : (
            <div
              className={`project-thumb ${project.themeClass}`}
              style={{ height: '140px', borderRadius: '14px', marginBottom: '20px' }}
            >
              {project.icon}
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 8 }}>
              Project Overview
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-mid)', lineHeight: 1.7 }}>
              {project.caseStudy?.overview || project.description}
            </p>
          </div>

          {project.caseStudy?.highlights && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 10 }}>
                Key Technical Features
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, padding: 0 }}>
                {project.caseStudy.highlights.map((h, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.86rem', color: 'var(--text-mid)' }}>
                    <CheckCircle2 size={16} color="var(--teal)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.caseStudy?.techStack && (
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                Tech Stack
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {project.caseStudy.techStack.map((tech, i) => (
                  <span key={i} className="tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
            {project.link && project.link !== '#' && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.88rem' }}
              >
                <ExternalLink size={16} />
                Visit Live Project
              </a>
            )}
            {project.caseStudy?.githubUrl && (
              <a
                href={project.caseStudy.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ padding: '10px 20px', fontSize: '0.88rem' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub Repository
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
