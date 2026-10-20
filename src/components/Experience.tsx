import React from 'react';
import { experienceData } from '../data/portfolioData';

export const Experience: React.FC = () => {
  return (
    <section id="experience">
      <div className="section-header reveal">
        <div className="section-eyebrow">Career</div>
        <h2 className="section-title">Work Experience</h2>
        <p className="section-sub">My professional journey so far</p>
      </div>

      <div className="timeline">
        {experienceData.map((item) => (
          <div key={item.id} className="timeline-item reveal">
            <div className="tl-date">{item.period}</div>
            <div className="tl-role">{item.role}</div>
            <div className="tl-company">{item.company}</div>
            <div className="tl-desc">{item.description}</div>
            {item.technologies && (
              <div className="tl-tags">
                {item.technologies.map((tech, i) => (
                  <span key={i} className="tag">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
