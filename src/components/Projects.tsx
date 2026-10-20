import React, { useState } from 'react';
import { ExternalLink, PlusCircle } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { ProjectItem } from '../types';
import { ProjectModal } from './ProjectModal';

export const Projects: React.FC = () => {
  const { projects, setIsAdminOpen } = useProjects();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <>
      <section
        id="projects"
        style={{
          background: 'rgba(30, 111, 232, 0.02)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="section-header reveal">
          <div className="section-eyebrow">Portfolio</div>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-sub">
            A selection of {projects.length} work items I'm proud of
          </p>

          <div style={{ marginTop: '14px' }}>
            <button
              type="button"
              onClick={() => setIsAdminOpen(true)}
              className="btn-secondary"
              style={{
                padding: '7px 18px',
                fontSize: '0.84rem',
                borderRadius: '8px',
                background: 'white',
              }}
            >
              <PlusCircle size={15} />
              Add Web Project (Admin Portal)
            </button>
          </div>
        </div>

        <div className="projects-grid">
          {projects.map((project) => {
            const hasPreview = !!(project.previewImage || project.imageUrl);
            const previewSrc = project.previewImage || project.imageUrl;

            return (
              <div key={project.id} className="project-card reveal">
                <div
                  className={`project-thumb ${project.themeClass}`}
                  style={{
                    padding: 0,
                    background: hasPreview ? '#0D1B2A' : undefined,
                  }}
                >
                  {hasPreview ? (
                    <img
                      src={previewSrc}
                      alt={project.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: project.imageFit || 'cover',
                        objectPosition: project.imagePosition || 'center',
                        transform: project.imageZoom && project.imageZoom > 1 ? `scale(${project.imageZoom})` : undefined,
                        transition: 'transform 0.4s ease',
                      }}
                      onError={(e) => {
                        // Fallback if image path fails
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span>{project.icon}</span>
                  )}
                </div>

                <div className="project-body">
                  <div className="project-cat">{project.category}</div>
                  <div className="project-title">{project.title}</div>
                  <div className="project-desc">{project.description}</div>

                  <div className="project-action-row">
                    <button
                      type="button"
                      className="project-link"
                      onClick={() => setSelectedProject(project)}
                    >
                      View Case Study →
                    </button>

                    {project.link && project.link !== '#' && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link-ext"
                        title="Open live website"
                      >
                        <span>Live Demo</span>
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
};
