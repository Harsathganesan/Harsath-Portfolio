import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Download, ArrowRight } from 'lucide-react';

const HomeSection = ({ profile }) => {
  const [typedRole, setTypedRole] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mobileIntroDismissed, setMobileIntroDismissed] = useState(false);
  
  const roles = [
    "Software developer",
    "Mernstack Developer",
    "Database Engineer"
  ];

  // Typing effect loop
  useEffect(() => {
    let timer;
    const currentFullRole = roles[roleIndex];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setTypedRole(currentFullRole.substring(0, typedRole.length - 1));
      }, 50);
    } else {
      timer = setTimeout(() => {
        setTypedRole(currentFullRole.substring(0, typedRole.length + 1));
      }, 100);
    }

    if (!isDeleting && typedRole === currentFullRole) {
      timer = setTimeout(() => setIsDeleting(true), 1500); // Wait before delete
    } else if (isDeleting && typedRole === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timer);
  }, [typedRole, isDeleting, roleIndex, profile.role]);

  // Download the resume PDF
  const handleDownloadResume = () => {
    const resumeUrl = profile.resumeUrl && profile.resumeUrl !== '#' ? profile.resumeUrl : '/G.Harsath Resume.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'G.Harsath Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="section container" style={{ position: 'relative' }}>
        <div className="hero-wrapper" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-info">
            <span className="hero-welcome">WELCOME TO MY PORTFOLIO</span>
            <h1 className="hero-name">Hi, I'm {profile.name}</h1>
            
            <div className="hero-role-wrapper">
              <span>A </span>
              <span className="hero-role typing-cursor">{typedRole}</span>
            </div>

            <p className="hero-tagline">
              {profile.tagline}
            </p>

            <div className="hero-actions">
              <button className="btn btn-primary" onClick={handleDownloadResume}>
                Download Resume <Download size={16} />
              </button>
              <button className="btn btn-secondary" onClick={() => scrollToSection('contact')}>
                Let's Talk <ArrowRight size={16} />
              </button>
            </div>

            <div className="hero-socials">
              {profile.socials.github && (
                <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="GitHub">
                  <Github size={20} />
                </a>
              )}
              {profile.socials.linkedin && (
                <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="LinkedIn">
                  <Linkedin size={20} />
                </a>
              )}
              {profile.socials.email && (
                <a href={`mailto:${profile.socials.email}`} className="social-icon-btn" title="Email">
                  <Mail size={20} />
                </a>
              )}
            </div>
          </div>

          <div className="hero-image-container">
            <div className="profile-hero-avatar floating-effect">
              <img 
                src={profile.photo || "/harsath_photo.png"} 
                alt={profile.name} 
                className="profile-hero-img" 
              />
              
              {/* Circular floating tech logos */}
              <div className="orbit-wrapper">
                <div className="tech-orbit-logo orbit-1" title="React"><img src="/react.png" alt="React" /></div>
                <div className="tech-orbit-logo orbit-2" title="Node.js"><img src="/node.png" alt="Node.js" /></div>
                <div className="tech-orbit-logo orbit-3" title="Python"><img src="/python.png" alt="Python" /></div>
                <div className="tech-orbit-logo orbit-4" title="JavaScript"><img src="/javascript.png" alt="JavaScript" /></div>
                <div className="tech-orbit-logo orbit-5" title="MySQL"><img src="/mysql.png" alt="MySQL" /></div>
                <div className="tech-orbit-logo orbit-6" title="Express.js"><img src="/express.png" alt="Express.js" /></div>
                <div className="tech-orbit-logo orbit-7" title="GitHub"><img src="/github.png" alt="GitHub" /></div>
                <div className="tech-orbit-logo orbit-8" title="MongoDB"><img src="/leaf.png" alt="MongoDB" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default HomeSection;
