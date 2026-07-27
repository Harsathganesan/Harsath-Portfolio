import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomeSection from './components/HomeSection';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import AwardsSection from './components/AwardsSection';
import ContactSection from './components/ContactSection';
import AdminPanel from './components/AdminPanel';
import { getPortfolioData, fetchPortfolioFromDB } from './data/db';

// Scroll coordinator component for landing section targets
const PortfolioLanding = ({ data, theme, onToggleTheme }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      // Clear location state after scrolling to prevent re-scrolls on refresh
      window.history.replaceState({}, document.title);
      
      const el = document.getElementById(sectionId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <>
      <Navbar isAdmin={false} theme={theme} onToggleTheme={onToggleTheme} />
      <main style={{ paddingBottom: '2rem' }}>
        <HomeSection profile={data.profile} />
        <AboutSection about={data.about} />
        <SkillsSection skills={data.skills} />
        <ProjectsSection projects={data.projects} />
        <AwardsSection awards={data.awards} />
        <ContactSection profile={data.profile} />
      </main>
      <footer style={{
        textAlign: 'center',
        padding: '3rem 2rem',
        borderTop: '1px solid var(--border-glass)',
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
        background: 'var(--bg-secondary)',
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <p>&copy; {new Date().getFullYear()} {data.profile.name}. All Rights Reserved.</p>
        <Link 
          to="/admin" 
          style={{ 
            color: 'var(--accent-primary)', 
            fontSize: '0.82rem', 
            fontWeight: '500', 
            opacity: 0.8,
            transition: 'opacity 0.2s',
            marginTop: '0.25rem'
          }}
        >
          ⚙️ Admin Console
        </Link>
      </footer>
    </>
  );
};

function App() {
  const [data, setData] = useState(() => getPortfolioData());
  
  // Theme is always light
  const theme = 'light';
  const toggleTheme = () => {};

  // Initialize DB from MongoDB / LocalStorage
  useEffect(() => {
    const loadData = async () => {
      const dbData = await fetchPortfolioFromDB();
      setData(dbData);
    };
    loadData();
  }, []);

  // Set HTML data-theme attribute to light
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('portfolio_theme', 'light');
  }, []);

  const handleUpdate = (newData) => {
    setData(newData);
  };

  if (!data) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'var(--font-title)',
        fontSize: '1.5rem',
        color: 'var(--accent-primary)',
        backgroundColor: 'var(--bg-primary)'
      }}>
        Initializing Portfolio...
      </div>
    );
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route 
          path="/" 
          element={
            <PortfolioLanding 
              data={data} 
              theme={theme} 
              onToggleTheme={toggleTheme} 
            />
          } 
        />
        <Route 
          path="/admin/*" 
          element={
            <>
              <Navbar 
                isAdmin={true} 
                theme={theme} 
                onToggleTheme={toggleTheme} 
                onSignOut={() => window.location.href = '/'} 
              />
              <AdminPanel data={data} onUpdate={handleUpdate} />
            </>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <>
              <Navbar 
                isAdmin={true} 
                theme={theme} 
                onToggleTheme={toggleTheme} 
                onSignOut={() => window.location.href = '/'} 
              />
              <AdminPanel data={data} onUpdate={handleUpdate} />
            </>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
