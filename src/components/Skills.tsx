import React from 'react';
import { skillsData } from '../data/portfolioData';

export const Skills: React.FC = () => {
  return (
    <section id="skills">
      <div className="section-header reveal">
        <div className="section-eyebrow">What I Do</div>
        <h2 className="section-title">Skills & Expertise</h2>
        <p className="section-sub">Technologies and tools I work with every day</p>
      </div>

      <div className="skills-grid">
        {skillsData.map((skill) => (
          <div key={skill.id} className="skill-card reveal">
            <div className={`skill-icon ${skill.iconColor}`}>{skill.icon}</div>
            <div className="skill-name">{skill.name}</div>
            <div className="skill-desc">{skill.description}</div>
            <div className="skill-tags">
              {skill.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`tag ${skill.iconColor === 'teal' ? 'teal' : ''}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
