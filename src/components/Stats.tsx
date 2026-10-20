import React from 'react';
import { statsData } from '../data/portfolioData';

export const Stats: React.FC = () => {
  return (
    <div className="stats-row reveal">
      {statsData.map((stat, index) => (
        <div key={index} className="stat-item">
          <span className="stat-num">{stat.number}</span>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
