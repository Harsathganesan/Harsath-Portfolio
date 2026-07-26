import React from 'react';
import { Code, Server, Database, Cpu } from 'lucide-react';

const SkillsSection = ({ skills }) => {
  const { frontend = [], backend = [], database = [], tools = [] } = skills;

  return (
    <section id="skills" className="section container">
      <h2 className="section-title">My Skills</h2>

      <div className="skills-container">
        <div className="skills-grid">
          {/* Frontend Category */}
          <div className="skills-category glass-card">
            <h3 className="skill-category-title">
              <Code size={22} />
              Frontend
            </h3>
            <div className="skills-list">
              {frontend.length > 0 ? (
                frontend.map((skill, index) => (
                  <span key={index} className="skill-badge">
                    {skill}
                  </span>
                ))
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>No frontend skills added yet.</span>
              )}
            </div>
          </div>

          {/* Backend Category */}
          <div className="skills-category glass-card">
            <h3 className="skill-category-title">
              <Server size={22} />
              Backend
            </h3>
            <div className="skills-list">
              {backend.length > 0 ? (
                backend.map((skill, index) => (
                  <span key={index} className="skill-badge">
                    {skill}
                  </span>
                ))
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>No backend skills added yet.</span>
              )}
            </div>
          </div>

          {/* Database Category */}
          <div className="skills-category glass-card">
            <h3 className="skill-category-title">
              <Database size={22} />
              Database
            </h3>
            <div className="skills-list">
              {database.length > 0 ? (
                database.map((skill, index) => (
                  <span key={index} className="skill-badge">
                    {skill}
                  </span>
                ))
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>No database skills added yet.</span>
              )}
            </div>
          </div>
        </div>

        {/* Ecosystem & Tools Category */}
        <div className="ecosystem-section">
          <h3 className="ecosystem-title">
            <Cpu size={18} style={{ marginRight: '8px', verticalAlign: 'middle', color: 'var(--accent-pink)' }} />
            Ecosystem & Tools
          </h3>
          <div className="ecosystem-grid">
            {tools.length > 0 ? (
              tools.map((tool, index) => (
                <span key={index} className="tool-badge">
                  {tool}
                </span>
              ))
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>No tools added yet.</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
