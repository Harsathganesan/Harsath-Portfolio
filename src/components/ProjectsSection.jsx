import React, { useState } from 'react';
import { Github, ExternalLink, ChevronRight, X, Layers } from 'lucide-react';

const ProjectsSection = ({ projects = [] }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const displayedProjects = showAll ? projects : projects.slice(0, 3);

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setTimeout(() => {
      const el = document.getElementById('projects');
      if (el) {
        const topPos = el.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: topPos, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <section id="projects" className="section container" style={{ paddingTop: '3rem' }}>
      {/* Centered My Projects Title */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2.5rem', position: 'relative', width: '100%' }}>
        <h2 className="section-title" style={{ margin: 0 }}>My Projects</h2>
        {selectedProject && (
          <button 
            className="btn btn-secondary desktop-back-btn"
            onClick={() => setSelectedProject(null)}
            style={{ position: 'absolute', right: 0, padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.88rem' }}
          >
            <X size={16} /> Cancel
          </button>
        )}
      </div>

      {selectedProject ? (
        /* Focused Single Project View */
        <div className="project-detail-layout glass-card">
          {/* Top: Heading of Project */}
          <div className="project-detail-header">
            <span className="project-feature-badge">
              <Layers size={14} /> FEATURED PROJECT
            </span>
            <h3 className="project-detail-title">{selectedProject.title}</h3>
          </div>

          {/* Middle: 2-Column Layout (Photo Left, Content Right) */}
          <div className="project-detail-body">
            {/* Photo Left Side */}
            <div className="project-detail-img-wrapper">
              <img 
                src={selectedProject.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600"} 
                alt={selectedProject.title} 
                className="project-detail-img" 
              />
            </div>
            
            {/* Content Right Side */}
            <div className="project-detail-text-content">
              <p className="project-detail-desc">{selectedProject.description}</p>
              
              {selectedProject.tags && selectedProject.tags.length > 0 && (
                <div className="project-feature-tags" style={{ marginTop: '0.8rem' }}>
                  {selectedProject.tags.map((tag, i) => (
                    <span key={i} className="project-feature-tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom: Action Links */}
          <div className="project-detail-footer-actions">
            {selectedProject.githubLink && (
              <a 
                href={selectedProject.githubLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary project-pill-btn"
              >
                <Github size={18} /> Code Repository
              </a>
            )}
            {selectedProject.liveLink && (
              <a 
                href={selectedProject.liveLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary project-pill-btn"
              >
                <ExternalLink size={18} /> Live Demo
              </a>
            )}
          </div>

          {/* Cancel Button at bottom */}
          <div style={{ marginTop: '1.8rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)', textAlign: 'center' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedProject(null)}
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem 1.5rem', borderRadius: '12px', fontSize: '0.9rem', gap: '0.4rem' }}
            >
              <X size={18} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        /* 3-Column Projects Grid View */
        <>
          <div className="projects-three-grid">
            {displayedProjects.length > 0 ? (
              displayedProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="project-screenshot-card"
                  onClick={() => handleSelectProject(project)}
                  style={{ cursor: 'pointer' }}
                  title="Click to open this project in detail view"
                >
                  <div className="project-card-img-wrapper">
                    <img 
                      src={project.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600"} 
                      alt={project.title} 
                      className="project-card-img" 
                    />
                  </div>
                  
                  <div className="project-card-body">
                    <h3 className="project-card-title">{project.title}</h3>
                    
                    {project.tags && project.tags.length > 0 && (
                      <div className="project-card-tags">
                        {project.tags.map((tag, i) => (
                          <span key={i} className="project-card-tag">{tag}</span>
                        ))}
                      </div>
                    )}

                    <p className="project-card-desc">{project.description}</p>

                    <div className="project-card-footer-links" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="project-read-more-link primary-link"
                        onClick={() => handleSelectProject(project)}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                      >
                        View Project <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '4rem', gridColumn: 'span 3' }}>
                No projects added yet.
              </p>
            )}
          </div>

          {/* Bottom "All projects" Button */}
          {projects.length > 3 && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button 
                className="btn-all-projects-outline"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Less" : "All projects"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ProjectsSection;
