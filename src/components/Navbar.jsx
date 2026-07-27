import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, ArrowLeft, LogOut } from 'lucide-react';

const Navbar = ({ isAdmin, theme, onToggleTheme, onSignOut }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll spy to highlight active section in navbar
  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'awards', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Track page scroll progress for header progress line indicator
  useEffect(() => {
    const handleScrollProgress = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScrollProgress);
    return () => window.removeEventListener('scroll', handleScrollProgress);
  }, []);

  const handleNavClick = (sectionId) => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Awards', id: 'awards' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <header className="navbar-header" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100 }}>
      <div className="navbar-container">
        {/* Left: Brand name 'HarsathG' without SVG logo */}
        <div 
          className="logo-text" 
          onClick={() => handleNavClick('home')} 
          style={{ 
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.03em' }}>HarsathG</span>
        </div>

        {isAdmin ? (
          <>
            {/* Empty center grid cell to preserve alignment in admin view */}
            <div />
            <div className="admin-nav-right">

              <button className="btn btn-secondary btn-signout" onClick={() => navigate('/')}>
                <ArrowLeft size={16} /> <span className="nav-btn-text">Back to Site</span>
              </button>
              <button className="btn btn-primary btn-signout" onClick={onSignOut}>
                <LogOut size={16} /> <span className="nav-btn-text">Sign Out</span>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Center: Menu links */}
            <nav className="navbar-nav-center">
              <ul className={`nav-menu ${mobileOpen ? 'mobile-open' : ''}`}>
                {navItems.map((item) => (
                  <li key={item.id}>
                    <span
                      className={`nav-link ${activeSection === item.id && location.pathname === '/' ? 'active' : ''}`}
                      onClick={() => handleNavClick(item.id)}
                    >
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="navbar-actions-right">
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/admin')} 
                style={{ 
                  padding: '0.45rem 0.9rem', 
                  fontSize: '0.85rem', 
                  gap: '0.45rem',
                  borderRadius: '10px'
                }}
                title="Admin Console"
              >
                <LayoutDashboard size={15} /> <span className="nav-btn-text">Admin</span>
              </button>
              <button className="nav-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Dynamic Scroll Progress Line Indicator */}
      <div 
        className="scroll-progress-line" 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: `${scrollProgress}%`,
          height: '3px',
          background: 'linear-gradient(90deg, var(--accent-secondary), var(--accent-primary), var(--accent-pink))',
          boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
          transition: 'width 0.05s ease-out'
        }}
      />
    </header>
  );
};

export default Navbar;
