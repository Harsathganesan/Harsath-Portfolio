import React from 'react';
import { Calendar, Briefcase, GraduationCap } from 'lucide-react';

const AboutSection = ({ about }) => {
  const { education = [], experience = [] } = about;

  return (
    <section id="about" className="section container">
      <h2 className="section-title">About Me</h2>
      
      <div className="about-sections-wrapper">
        {/* Education Section (First) */}
        <div className="about-section-group">
          <h3 className="about-section-heading education-heading">
            <GraduationCap size={26} />
            Education
          </h3>

          <div className="about-cards-grid">
            {education.length > 0 ? (
              education.map((edu) => (
                <div key={edu.id} className="about-card glass-card">
                  <div className="about-card-header">
                    <div>
                      <h4 className="about-card-title">{edu.degree}</h4>
                      <span className="about-card-org">{edu.institution}</span>
                    </div>
                    <span className="about-card-period">
                      <Calendar size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      {edu.period}
                    </span>
                  </div>
                  <p className="about-card-desc">{edu.grade}</p>
                </div>
              ))
            ) : (
              <p className="about-no-records">No education records added yet.</p>
            )}
          </div>
        </div>

        {/* Experience Section (Second, Below) */}
        <div className="about-section-group">
          <h3 className="about-section-heading experience-heading">
            <Briefcase size={24} />
            Experience
          </h3>

          <div className="about-cards-grid">
            {experience.length > 0 ? (
              experience.map((exp) => (
                <div key={exp.id} className="about-card glass-card">
                  <div className="about-card-header">
                    <div>
                      <h4 className="about-card-title">{exp.role}</h4>
                      <span className="about-card-org">{exp.company}</span>
                    </div>
                    <span className="about-card-period">
                      <Calendar size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      {exp.period}
                    </span>
                  </div>
                  <p className="about-card-desc">{exp.description}</p>
                </div>
              ))
            ) : (
              <p className="about-no-records">No experience records added yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
