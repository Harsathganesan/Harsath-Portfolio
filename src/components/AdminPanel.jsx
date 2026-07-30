import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, GraduationCap, Briefcase, Code, FolderGit, Lock, Save, Plus, Trash2, 
  Edit3, RotateCcw, AlertCircle, PlusCircle, CheckCircle, ExternalLink, Upload, Trophy,
  Activity, Wifi, RefreshCw, Database, LayoutDashboard, BarChart3, TrendingUp, Zap, Inbox, Mail, MessageSquare, Key
} from 'lucide-react';
import { savePortfolioData, savePortfolioToDB, resetPortfolioData, checkBackendConnection, fetchContactMessages, deleteContactMessage } from '../data/db';

const AdminPanel = ({ data, onUpdate }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [savedSuccess, setSavedSuccess] = useState('');

  // Passcode update state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Database Connection Health state
  const [dbHealth, setDbHealth] = useState(null);
  const [isCheckingDb, setIsCheckingDb] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);

  // Active form state for editing
  const [profileForm, setProfileForm] = useState({ ...data.profile });
  const [skillsForm, setSkillsForm] = useState(data.skills || { frontend: [], backend: [], database: [], tools: [] });
  const [newSkillText, setNewSkillText] = useState({ frontend: '', backend: '', database: '', tools: '' });
  
  // Modal states for CRUD operations
  const [showEduModal, setShowEduModal] = useState(false);
  const [eduEditItem, setEduEditItem] = useState(null);
  const [eduForm, setEduForm] = useState({ degree: '', institution: '', period: '', grade: '' });

  const [showExpModal, setShowExpModal] = useState(false);
  const [expEditItem, setExpEditItem] = useState(null);
  const [expForm, setExpForm] = useState({ role: '', company: '', period: '', description: '' });

  const [showProjModal, setShowProjModal] = useState(false);
  const [projEditItem, setProjEditItem] = useState(null);
  const [projForm, setProjForm] = useState({ title: '', description: '', image: '', tagsInput: '', githubLink: '', liveLink: '' });

  const [showAwardModal, setShowAwardModal] = useState(false);
  const [awardEditItem, setAwardEditItem] = useState(null);
  const [awardForm, setAwardForm] = useState({ title: '', issuer: '', date: '', description: '' });

  // Messages state
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const loadMessages = async () => {
    setIsLoadingMessages(true);
    const msgs = await fetchContactMessages();
    setMessages(msgs || []);
    setIsLoadingMessages(false);
  };

  const handleDeleteMsg = async (msgId) => {
    if (window.confirm('Delete this message?')) {
      await deleteContactMessage(msgId);
      setMessages(prev => prev.filter(m => m._id !== msgId && m.id !== msgId));
      triggerSuccessAlert('Message deleted.');
    }
  };

  const handleCheckConnection = async () => {
    setIsCheckingDb(true);
    const health = await checkBackendConnection();
    setDbHealth(health);
    setIsCheckingDb(false);
    setShowHealthModal(true);
  };

  // Run silent initial health check & fetch messages when console is unlocked
  useEffect(() => {
    if (isAuthenticated) {
      checkBackendConnection().then(res => setDbHealth(res));
      loadMessages();
    }
  }, [isAuthenticated]);

  // Handle Login authentication
  const handleLogin = (e) => {
    e.preventDefault();
    const storedPasscode = localStorage.getItem('admin_passcode') || 'admin123';
    if (passcode === storedPasscode) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid passcode! Please try again.');
    }
  };

  // Handle Changing Admin Passcode
  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    const storedPasscode = localStorage.getItem('admin_passcode') || 'admin123';
    if (passwordForm.currentPassword !== storedPasscode) {
      setPasswordError('Current passcode is incorrect.');
      return;
    }
    if (passwordForm.newPassword.length < 4) {
      setPasswordError('New passcode must be at least 4 characters long.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passcode and confirmation do not match.');
      return;
    }

    localStorage.setItem('admin_passcode', passwordForm.newPassword);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordSuccess('Passcode updated successfully!');
    triggerSuccessAlert('Admin passcode changed successfully!');
  };

  const triggerSuccessAlert = (msg) => {
    setSavedSuccess(msg);
    setTimeout(() => setSavedSuccess(''), 3000);
  };

  // Profile management
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('socials.')) {
      const socialKey = name.split('.')[1];
      setProfileForm(prev => ({
        ...prev,
        socials: { ...prev.socials, [socialKey]: value }
      }));
    } else {
      setProfileForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("Image is too large! Please choose an image smaller than 1MB to avoid LocalStorage limits.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProjectPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("Image is too large! Please choose an image smaller than 1MB to avoid LocalStorage limits.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const updated = { ...data, profile: profileForm };
    await savePortfolioData(updated);
    onUpdate(updated);
    triggerSuccessAlert('Profile details updated successfully!');
  };

  // Education management
  const openEduModal = (item = null) => {
    if (item) {
      setEduEditItem(item);
      setEduForm({ ...item });
    } else {
      setEduEditItem(null);
      setEduForm({ degree: '', institution: '', period: '', grade: '' });
    }
    setShowEduModal(true);
  };

  const handleSaveEdu = async (e) => {
    e.preventDefault();
    const currentEdu = data.about?.education || [];
    let updatedEdu;
    if (eduEditItem) {
      updatedEdu = currentEdu.map(item => item.id === eduEditItem.id ? { ...eduForm } : item);
    } else {
      const newItem = { ...eduForm, id: `edu-${Date.now()}` };
      updatedEdu = [...currentEdu, newItem];
    }

    const updated = {
      ...data,
      about: { ...(data.about || {}), education: updatedEdu }
    };
    onUpdate(updated);
    await savePortfolioToDB(updated);
    setShowEduModal(false);
    triggerSuccessAlert(eduEditItem ? 'Education item updated!' : 'Education item added!');
  };

  const handleDeleteEdu = async (id) => {
    if (window.confirm('Are you sure you want to delete this education record?')) {
      const currentEdu = data.about?.education || [];
      const updatedEdu = currentEdu.filter(item => item.id !== id);
      const updated = {
        ...data,
        about: { ...(data.about || {}), education: updatedEdu }
      };
      onUpdate(updated);
      await savePortfolioToDB(updated);
      triggerSuccessAlert('Education item deleted.');
    }
  };

  // Experience management
  const openExpModal = (item = null) => {
    if (item) {
      setExpEditItem(item);
      setExpForm({ ...item });
    } else {
      setExpEditItem(null);
      setExpForm({ role: '', company: '', period: '', description: '' });
    }
    setShowExpModal(true);
  };

  const handleSaveExp = async (e) => {
    e.preventDefault();
    const currentExp = data.about?.experience || [];
    let updatedExp;
    if (expEditItem) {
      updatedExp = currentExp.map(item => item.id === expEditItem.id ? { ...expForm } : item);
    } else {
      const newItem = { ...expForm, id: `exp-${Date.now()}` };
      updatedExp = [...currentExp, newItem];
    }

    const updated = {
      ...data,
      about: { ...(data.about || {}), experience: updatedExp }
    };
    onUpdate(updated);
    await savePortfolioToDB(updated);
    setShowExpModal(false);
    triggerSuccessAlert(expEditItem ? 'Experience item updated!' : 'Experience item added!');
  };

  const handleDeleteExp = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience record?')) {
      const currentExp = data.about?.experience || [];
      const updatedExp = currentExp.filter(item => item.id !== id);
      const updated = {
        ...data,
        about: { ...(data.about || {}), experience: updatedExp }
      };
      onUpdate(updated);
      await savePortfolioToDB(updated);
      triggerSuccessAlert('Experience item deleted.');
    }
  };

  // Skills management
  const handleAddSkillTag = async (category) => {
    const text = (newSkillText[category] || '').trim();
    if (!text) return;

    const categoryList = skillsForm[category] || [];
    if (categoryList.includes(text)) {
      alert('Skill tag already exists in this category!');
      return;
    }

    const updatedSkills = {
      ...skillsForm,
      [category]: [...categoryList, text]
    };
    setSkillsForm(updatedSkills);
    setNewSkillText(prev => ({ ...prev, [category]: '' }));

    const updated = { ...data, skills: updatedSkills };
    await savePortfolioData(updated);
    onUpdate(updated);
    triggerSuccessAlert(`Added "${text}" tag!`);
  };

  const handleRemoveSkillTag = async (category, tagIndex) => {
    const categoryList = skillsForm[category] || [];
    const updatedSkills = {
      ...skillsForm,
      [category]: categoryList.filter((_, idx) => idx !== tagIndex)
    };
    setSkillsForm(updatedSkills);

    const updated = { ...data, skills: updatedSkills };
    await savePortfolioData(updated);
    onUpdate(updated);
    triggerSuccessAlert('Skill tag removed.');
  };

  // Projects management
  const openProjModal = (item = null) => {
    if (item) {
      setProjEditItem(item);
      setProjForm({
        ...item,
        tagsInput: item.tags ? item.tags.join(', ') : ''
      });
    } else {
      setProjEditItem(null);
      setProjForm({ title: '', description: '', image: '', tagsInput: '', githubLink: '', liveLink: '' });
    }
    setShowProjModal(true);
  };

  const handleSaveProj = async (e) => {
    e.preventDefault();
    let updatedProj = [...data.projects];
    const parsedTags = projForm.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    const finalProjItem = {
      title: projForm.title,
      description: projForm.description,
      image: projForm.image,
      tags: parsedTags,
      githubLink: projForm.githubLink,
      liveLink: projForm.liveLink
    };

    if (projEditItem) {
      updatedProj = updatedProj.map(item => item.id === projEditItem.id ? { ...finalProjItem, id: projEditItem.id } : item);
    } else {
      const newItem = { ...finalProjItem, id: `proj-${Date.now()}` };
      updatedProj.push(newItem);
    }

    const updated = {
      ...data,
      projects: updatedProj
    };
    await savePortfolioData(updated);
    onUpdate(updated);
    setShowProjModal(false);
    triggerSuccessAlert(projEditItem ? 'Project details updated!' : 'New project added successfully!');
  };

  const handleDeleteProj = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updatedProj = data.projects.filter(item => item.id !== id);
      const updated = {
        ...data,
        projects: updatedProj
      };
      await savePortfolioData(updated);
      onUpdate(updated);
      triggerSuccessAlert('Project removed successfully.');
    }
  };

  // Awards management
  const openAwardModal = (item = null) => {
    if (item) {
      setAwardEditItem(item);
      setAwardForm({ ...item });
    } else {
      setAwardEditItem(null);
      setAwardForm({ title: '', issuer: '', date: '', description: '' });
    }
    setShowAwardModal(true);
  };

  const handleSaveAward = async (e) => {
    e.preventDefault();
    let updatedAward = data.awards ? [...data.awards] : [];
    if (awardEditItem) {
      updatedAward = updatedAward.map(item => item.id === awardEditItem.id ? { ...awardForm } : item);
    } else {
      const newItem = { ...awardForm, id: `award-${Date.now()}` };
      updatedAward.push(newItem);
    }

    const updated = {
      ...data,
      awards: updatedAward
    };
    await savePortfolioData(updated);
    onUpdate(updated);
    setShowAwardModal(false);
    triggerSuccessAlert(awardEditItem ? 'Award entry updated!' : 'Award entry added successfully!');
  };

  const handleDeleteAward = async (id) => {
    if (window.confirm('Are you sure you want to delete this award record?')) {
      const updatedAward = data.awards.filter(item => item.id !== id);
      const updated = {
        ...data,
        awards: updatedAward
      };
      await savePortfolioData(updated);
      onUpdate(updated);
      triggerSuccessAlert('Award entry deleted.');
    }
  };

  // Database Reset
  const handleResetDb = async () => {
    if (window.confirm('CAUTION: This will erase all custom edits and reset the portfolio database back to default seed entries. Do you wish to proceed?')) {
      const seeded = await resetPortfolioData();
      setProfileForm({ ...seeded.profile });
      setSkillsForm({ ...seeded.skills });
      onUpdate(seeded);
      triggerSuccessAlert('Portfolio database was reset successfully!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-overlay container">
        <div className="admin-login-card glass-card">
          <div className="admin-login-header">
            <Lock size={44} style={{ margin: '0 auto 1rem auto', display: 'block' }} />
            <h2>Admin Console Access</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Please authenticate to edit your portfolio contents.
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Passcode</label>
              <input 
                type="password" 
                value={passcode} 
                onChange={(e) => setPasscode(e.target.value)} 
                className="form-input" 
                placeholder="Enter admin passcode"
                required
              />
            </div>
            
            {loginError && (
              <div style={{ color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                <AlertCircle size={14} /> {loginError}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>
              Unlock Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-fullscreen-layout">
      {/* EXECUTIVE DASHBOARD SIDEBAR */}
      <aside className="admin-full-sidebar">
        {/* Brand Console Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-glass)', marginBottom: '1.25rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold' }}>
            <LayoutDashboard size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700 }}>Harsath Console</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span> Admin Executive
            </span>
          </div>
        </div>

        {/* Navigation Tab Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexGrow: 1 }}>
          <button className={`admin-sidebar-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <LayoutDashboard size={18} /> Dashboard Overview
          </button>
          <button className={`admin-sidebar-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <User size={18} /> Profile Info
          </button>
          <button className={`admin-sidebar-btn ${activeTab === 'education' ? 'active' : ''}`} onClick={() => setActiveTab('education')}>
            <GraduationCap size={18} /> Education
          </button>
          <button className={`admin-sidebar-btn ${activeTab === 'experience' ? 'active' : ''}`} onClick={() => setActiveTab('experience')}>
            <Briefcase size={18} /> Experience
          </button>
          <button className={`admin-sidebar-btn ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>
            <Code size={18} /> Skills Badge
          </button>
          <button className={`admin-sidebar-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
            <FolderGit size={18} /> Projects
          </button>
          <button className={`admin-sidebar-btn ${activeTab === 'awards' ? 'active' : ''}`} onClick={() => setActiveTab('awards')}>
            <Trophy size={18} /> Awards
          </button>
          <button className={`admin-sidebar-btn ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => { setActiveTab('messages'); loadMessages(); }}>
            <Inbox size={18} /> Messages Inbox {messages.length > 0 && <span style={{ background: 'var(--accent-primary)', color: 'white', fontSize: '0.7rem', padding: '0.1rem 0.45rem', borderRadius: '10px', marginLeft: 'auto' }}>{messages.length}</span>}
          </button>
          <button className={`admin-sidebar-btn ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
            <Key size={18} /> Change Password
          </button>
        </div>

        {/* Sidebar Footer Controls */}
        <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <button 
            type="button" 
            className="admin-sidebar-btn" 
            onClick={handleCheckConnection} 
            disabled={isCheckingDb}
            style={{ color: 'var(--accent-primary)', border: '1px solid rgba(2, 132, 199, 0.15)', background: 'rgba(2, 132, 199, 0.04)' }}
          >
            <Activity size={16} /> {isCheckingDb ? 'Pinging DB...' : 'Test Connection'}
          </button>

          <button 
            type="button" 
            className="admin-sidebar-btn" 
            onClick={handleResetDb} 
            style={{ color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.15)', background: 'rgba(239, 68, 68, 0.02)' }}
          >
            <RotateCcw size={16} /> Reset Database
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN WORKSTATION CANVAS */}
      <main className="admin-full-main">
        {/* Top Navigation & Status Bar */}
        <header className="admin-top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
              {activeTab === 'overview' && 'Executive Overview'}
              {activeTab === 'profile' && 'Personal Identity & Profile'}
              {activeTab === 'education' && 'Education & Qualifications'}
              {activeTab === 'experience' && 'Work Experience Timeline'}
              {activeTab === 'skills' && 'Skills Directory'}
              {activeTab === 'projects' && 'Projects Portfolio'}
              {activeTab === 'awards' && 'Honors & Achievements'}
              {activeTab === 'messages' && 'Contact Form Messages Inbox'}
              {activeTab === 'security' && 'Security & Passcode Settings'}
            </h2>

            {dbHealth && (
              <span 
                className="admin-badge-tag" 
                style={{ 
                  background: dbHealth.status === 'online' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                  borderColor: dbHealth.status === 'online' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                  color: dbHealth.status === 'online' ? '#10b981' : '#ef4444',
                  fontSize: '0.82rem',
                  padding: '0.35rem 0.85rem'
                }}
              >
                {dbHealth.status === 'online' ? '🟢 MongoDB Atlas Live' : '🔴 Offline Cache'} ({dbHealth.responseTime})
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {savedSuccess && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.5rem 1rem', borderRadius: '8px', color: 'var(--accent-emerald)', fontSize: '0.85rem' }}>
                <CheckCircle size={15} /> {savedSuccess}
              </div>
            )}

            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/')}
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.88rem' }}
            >
              Exit Console ✖
            </button>
          </div>
        </header>

        {/* Workstation Content View */}
        <div className="admin-workstation-content">
          {/* DASHBOARD OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="admin-section-header" style={{ marginBottom: '0.5rem' }}>
                <div>
                  <h3>Executive Dashboard Overview</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
                    Welcome back, {data.profile.name}! Here is a real-time overview of your portfolio metrics and database health.
                  </p>
                </div>
              </div>

              {/* Stat Widgets Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                {/* Stat 1: Projects */}
                <div 
                  className="glass-card" 
                  onClick={() => setActiveTab('projects')}
                  style={{ padding: '1.25rem', borderRadius: '14px', cursor: 'pointer', border: '1px solid var(--border-glass)', transition: 'all 0.2s ease' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Live Projects</span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FolderGit size={20} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.8rem', margin: '0.75rem 0 0.25rem 0', color: 'var(--text-primary)' }}>{data.projects ? data.projects.length : 0}</h3>
                  <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 500 }}>Click to manage projects →</span>
                </div>

                {/* Stat 2: Skills Badges */}
                <div 
                  className="glass-card" 
                  onClick={() => setActiveTab('skills')}
                  style={{ padding: '1.25rem', borderRadius: '14px', cursor: 'pointer', border: '1px solid var(--border-glass)', transition: 'all 0.2s ease' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Skill Badges</span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Code size={20} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.8rem', margin: '0.75rem 0 0.25rem 0', color: 'var(--text-primary)' }}>
                    {Object.values(skillsForm).reduce((acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0), 0)}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#6366f1', fontWeight: 500 }}>Click to manage skills →</span>
                </div>

                {/* Stat 3: Education & Career */}
                <div 
                  className="glass-card" 
                  onClick={() => setActiveTab('education')}
                  style={{ padding: '1.25rem', borderRadius: '14px', cursor: 'pointer', border: '1px solid var(--border-glass)', transition: 'all 0.2s ease' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Career Records</span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <GraduationCap size={20} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.8rem', margin: '0.75rem 0 0.25rem 0', color: 'var(--text-primary)' }}>
                    {(data.about?.education?.length || 0) + (data.about?.experience?.length || 0)}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 500 }}>Click to view timeline →</span>
                </div>

                {/* Stat 4: Contact Messages */}
                <div 
                  className="glass-card" 
                  onClick={() => { setActiveTab('messages'); loadMessages(); }}
                  style={{ padding: '1.25rem', borderRadius: '14px', cursor: 'pointer', border: '1px solid var(--border-glass)', transition: 'all 0.2s ease' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Messages Inbox</span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Inbox size={20} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.8rem', margin: '0.75rem 0 0.25rem 0', color: 'var(--text-primary)' }}>{messages.length}</h3>
                  <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 500 }}>Click to read messages →</span>
                </div>

                {/* Stat 5: Database Status */}
                <div 
                  className="glass-card" 
                  onClick={handleCheckConnection}
                  style={{ padding: '1.25rem', borderRadius: '14px', cursor: 'pointer', border: '1px solid var(--border-glass)', transition: 'all 0.2s ease' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Database Health</span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Database size={20} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', margin: '0.75rem 0 0.25rem 0', color: dbHealth?.status === 'online' ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                    {dbHealth?.status === 'online' ? 'MongoDB Atlas' : 'Local Cache'}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#ec4899', fontWeight: 500 }}>Click for health diagnostics →</span>
                </div>
              </div>

              {/* Middle Grid: Featured Projects & Quick Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
                {/* Recent Projects List */}
                <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Featured Projects Overview</h4>
                    <button className="btn btn-secondary" onClick={() => setActiveTab('projects')} style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>View All</button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {data.projects && data.projects.slice(0, 3).map((proj, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'var(--bg-glass)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img src={proj.image} alt={proj.title} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                          <div>
                            <h5 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{proj.title}</h5>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{proj.tags?.slice(0, 2).join(' • ')}</span>
                          </div>
                        </div>
                        <button className="btn-icon-edit" onClick={() => openProjModal(proj)} title="Edit"><Edit3 size={15} /></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Management Shortcuts */}
                <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Quick Control Actions</h4>
                  
                  <button className="btn btn-primary" onClick={() => openProjModal()} style={{ justifyContent: 'center', padding: '0.75rem' }}>
                    <Plus size={16} /> Create New Project
                  </button>

                  <button className="btn btn-secondary" onClick={() => openEduModal()} style={{ justifyContent: 'center', padding: '0.75rem' }}>
                    <Plus size={16} /> Add Education Entry
                  </button>

                  <button className="btn btn-secondary" onClick={() => openExpModal()} style={{ justifyContent: 'center', padding: '0.75rem' }}>
                    <Plus size={16} /> Add Work Position
                  </button>

                  <button className="btn btn-secondary" onClick={() => openAwardModal()} style={{ justifyContent: 'center', padding: '0.75rem' }}>
                    <Plus size={16} /> Add Honor / Award
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="admin-fields-grid">
              <div className="admin-section-header">
                <h3>Personal Identity</h3>
                <button type="submit" className="btn btn-primary btn-signout">
                  <Save size={16} /> Save Changes
                </button>
              </div>

              <div className="admin-fields-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" name="name" value={profileForm.name} onChange={handleProfileChange} className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Professional Role</label>
                  <input type="text" name="role" value={profileForm.role} onChange={handleProfileChange} className="form-input" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tagline Summary</label>
                <input type="text" name="tagline" value={profileForm.tagline} onChange={handleProfileChange} className="form-input" required />
              </div>

              <div className="form-group">
                <label className="form-label">Avatar / Photo URL</label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    name="photo" 
                    value={profileForm.photo} 
                    onChange={handleProfileChange} 
                    className="form-input" 
                    style={{ flexGrow: 1 }}
                    placeholder="Enter image URL or select from PC"
                  />
                  <input 
                    type="file" 
                    accept="image/*" 
                    id="profile-photo-file" 
                    onChange={handleProfilePhotoUpload} 
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="profile-photo-file" className="btn btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap', padding: '0.7rem 1.2rem', borderRadius: '8px' }}>
                    <Upload size={16} /> Choose File
                  </label>
                </div>
              </div>

              <div className="admin-section-header" style={{ marginTop: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)' }}>
                <h4 style={{ color: 'var(--text-secondary)' }}>Social Handles</h4>
              </div>

              <div className="admin-fields-row">
                <div className="form-group">
                  <label className="form-label">GitHub Link</label>
                  <input type="url" name="socials.github" value={profileForm.socials.github} onChange={handleProfileChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">LinkedIn Link</label>
                  <input type="url" name="socials.linkedin" value={profileForm.socials.linkedin} onChange={handleProfileChange} className="form-input" />
                </div>
              </div>

              <div className="admin-fields-row">
                <div className="form-group">
                  <label className="form-label">Primary Contact Email</label>
                  <input type="email" name="socials.email" value={profileForm.socials.email} onChange={handleProfileChange} className="form-input" />
                </div>
              </div>
            </form>
          )}

          {/* EDUCATION TAB */}
          {activeTab === 'education' && (
            <div>
              <div className="admin-section-header">
                <h3>Education Timeline</h3>
                <button className="btn btn-primary btn-signout" onClick={() => openEduModal()}>
                  <Plus size={16} /> Add Record
                </button>
              </div>

              <div className="admin-item-list">
                {data.about.education && data.about.education.map(edu => (
                  <div key={edu.id} className="admin-item-row">
                    <div className="admin-item-info">
                      <span className="admin-item-title">{edu.degree}</span>
                      <span className="admin-item-subtitle">{edu.institution} | {edu.period}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 500 }}>{edu.grade}</span>
                    </div>
                    <div className="admin-item-actions">
                      <button className="btn-icon-edit" onClick={() => openEduModal(edu)} title="Edit"><Edit3 size={16} /></button>
                      <button className="btn-icon-danger" onClick={() => handleDeleteEdu(edu.id)} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXPERIENCE TAB */}
          {activeTab === 'experience' && (
            <div>
              <div className="admin-section-header">
                <h3>Work Experience</h3>
                <button className="btn btn-primary btn-signout" onClick={() => openExpModal()}>
                  <Plus size={16} /> Add Position
                </button>
              </div>

              <div className="admin-item-list">
                {data.about.experience && data.about.experience.map(exp => (
                  <div key={exp.id} className="admin-item-row">
                    <div className="admin-item-info">
                      <span className="admin-item-title">{exp.role}</span>
                      <span className="admin-item-subtitle">{exp.company} | {exp.period}</span>
                    </div>
                    <div className="admin-item-actions">
                      <button className="btn-icon-edit" onClick={() => openExpModal(exp)} title="Edit"><Edit3 size={16} /></button>
                      <button className="btn-icon-danger" onClick={() => handleDeleteExp(exp.id)} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SKILLS TAB */}
          {activeTab === 'skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="admin-section-header" style={{ marginBottom: '0.5rem' }}>
                <h3>Skills Directory</h3>
              </div>

              {[
                { key: 'frontend', label: 'Frontend Skills' },
                { key: 'backend', label: 'Backend Skills' },
                { key: 'database', label: 'Database Skills' },
                { key: 'tools', label: 'Ecosystem & Tools' }
              ].map(({ key, label }) => (
                <div key={key} className="admin-badge-manager" style={{ background: 'var(--bg-glass)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-glass)' }}>
                  <h4 style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>{label}</h4>
                  
                  <div className="admin-badge-input-row" style={{ marginTop: '0.75rem' }}>
                    <input 
                      type="text" 
                      placeholder={`Enter new skill for ${label} (e.g. Next.js)`} 
                      value={newSkillText[key] || ''} 
                      onChange={(e) => setNewSkillText(prev => ({ ...prev, [key]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddSkillTag(key); }}
                      className="form-input" 
                      style={{ flexGrow: 1 }}
                    />
                    <button type="button" className="btn btn-primary" onClick={() => handleAddSkillTag(key)}>
                      <PlusCircle size={16} /> Add Skill
                    </button>
                  </div>

                  <div className="admin-badges-container" style={{ marginTop: '1rem' }}>
                    {skillsForm[key] && skillsForm[key].map((skill, tagIndex) => (
                      <span key={tagIndex} className="admin-badge-tag">
                        {skill}
                        <button type="button" onClick={() => handleRemoveSkillTag(key, tagIndex)}>&times;</button>
                      </span>
                    ))}
                    {(!skillsForm[key] || skillsForm[key].length === 0) && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No skills added yet in this category.</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div>
              <div className="admin-section-header">
                <h3>Projects Directory</h3>
                <button className="btn btn-primary btn-signout" onClick={() => openProjModal()}>
                  <Plus size={16} /> Create Project
                </button>
              </div>

              <div className="admin-item-list">
                {data.projects && data.projects.map(proj => (
                  <div key={proj.id} className="admin-item-row">
                    <div className="admin-item-info">
                      <span className="admin-item-title">{proj.title}</span>
                      <span className="admin-item-subtitle" style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '400px' }}>
                        {proj.description}
                      </span>
                      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                        {proj.tags && proj.tags.map((t, i) => (
                          <span key={i} style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="admin-item-actions">
                      <button className="btn-icon-edit" onClick={() => openProjModal(proj)} title="Edit"><Edit3 size={16} /></button>
                      <button className="btn-icon-danger" onClick={() => handleDeleteProj(proj.id)} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AWARDS TAB */}
          {activeTab === 'awards' && (
            <div>
              <div className="admin-section-header">
                <h3>Awards & Achievements</h3>
                <button className="btn btn-primary btn-signout" onClick={() => openAwardModal()}>
                  <Plus size={16} /> Add Award
                </button>
              </div>

              <div className="admin-item-list">
                {data.awards && data.awards.map(award => (
                  <div key={award.id} className="admin-item-row">
                    <div className="admin-item-info">
                      <span className="admin-item-title">{award.title}</span>
                      <span className="admin-item-subtitle">{award.issuer} | {award.date}</span>
                      {award.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{award.description}</p>}
                    </div>
                    <div className="admin-item-actions">
                      <button className="btn-icon-edit" onClick={() => openAwardModal(award)} title="Edit"><Edit3 size={16} /></button>
                      <button className="btn-icon-danger" onClick={() => handleDeleteAward(award.id)} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
                {(!data.awards || data.awards.length === 0) && (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No awards added yet.</p>
                )}
              </div>
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div>
              <div className="admin-section-header">
                <div>
                  <h3>Contact Messages Inbox</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
                    Messages submitted by visitors through your portfolio contact form (Stored in MongoDB Atlas).
                  </p>
                </div>
                <button className="btn btn-secondary" onClick={loadMessages} disabled={isLoadingMessages}>
                  <RefreshCw size={15} className={isLoadingMessages ? 'spin-animation' : ''} /> Refresh Messages
                </button>
              </div>

              <div className="admin-item-list" style={{ marginTop: '1.25rem' }}>
                {messages && messages.length > 0 ? (
                  messages.map(msg => (
                    <div key={msg._id || msg.id} className="admin-item-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', padding: '1.25rem', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{msg.name}</span>
                          <span style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', background: 'rgba(2, 132, 199, 0.1)', padding: '0.15rem 0.6rem', borderRadius: '12px' }}>{msg.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}
                          </span>
                          <button className="btn-icon-danger" onClick={() => handleDeleteMsg(msg._id || msg.id)} title="Delete Message">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div style={{ width: '100%' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                          Subject: {msg.subject}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', background: 'rgba(0, 0, 0, 0.03)', padding: '0.85rem 1rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-primary)', whiteSpace: 'pre-wrap' }}>
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px dashed var(--border-glass)' }}>
                    <Inbox size={40} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5, display: 'block' }} />
                    <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>No Messages Received Yet</h4>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Messages sent via the Contact section will appear here in real-time.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div style={{ maxWidth: '550px' }}>
              <div className="admin-section-header" style={{ marginBottom: '1.5rem' }}>
                <div>
                  <h3>Change Admin Passcode</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
                    Update the passcode required to access your Admin Executive Console.
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="glass-card" style={{ padding: '1.75rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Current Passcode</label>
                  <input 
                    type="password" 
                    value={passwordForm.currentPassword} 
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))} 
                    className="form-input" 
                    placeholder="Enter current passcode"
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">New Passcode</label>
                  <input 
                    type="password" 
                    value={passwordForm.newPassword} 
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))} 
                    className="form-input" 
                    placeholder="Enter new passcode"
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Passcode</label>
                  <input 
                    type="password" 
                    value={passwordForm.confirmPassword} 
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))} 
                    className="form-input" 
                    placeholder="Re-enter new passcode"
                    required 
                  />
                </div>

                {passwordError && (
                  <div style={{ color: '#ef4444', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.66rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <AlertCircle size={16} /> {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div style={{ color: '#10b981', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.66rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <CheckCircle size={16} /> {passwordSuccess}
                  </div>
                )}

                <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem' }}>
                  <Key size={16} /> Update Passcode
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* EDUCATION MODAL */}
      {showEduModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card glass-card">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>{eduEditItem ? 'Edit Education' : 'Add Education'}</h3>
            <form onSubmit={handleSaveEdu} className="admin-fields-grid">
              <div className="form-group">
                <label className="form-label">Degree Name</label>
                <input type="text" value={eduForm.degree} onChange={(e) => setEduForm(prev => ({ ...prev, degree: e.target.value }))} className="form-input" required placeholder="e.g. B.Tech Computer Science" />
              </div>
              <div className="form-group">
                <label className="form-label">Institution / School</label>
                <input type="text" value={eduForm.institution} onChange={(e) => setEduForm(prev => ({ ...prev, institution: e.target.value }))} className="form-input" required placeholder="e.g. Anna University" />
              </div>
              <div className="admin-fields-row">
                <div className="form-group">
                  <label className="form-label">Academic Period</label>
                  <input type="text" value={eduForm.period} onChange={(e) => setEduForm(prev => ({ ...prev, period: e.target.value }))} className="form-input" required placeholder="e.g. 2022 - 2026" />
                </div>
                <div className="form-group">
                  <label className="form-label">Grade / Score</label>
                  <input type="text" value={eduForm.grade} onChange={(e) => setEduForm(prev => ({ ...prev, grade: e.target.value }))} className="form-input" placeholder="e.g. CGPA: 8.9 / 10" />
                </div>
              </div>

              <div className="admin-footer-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEduModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPERIENCE MODAL */}
      {showExpModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card glass-card">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>{expEditItem ? 'Edit Experience' : 'Add Experience'}</h3>
            <form onSubmit={handleSaveExp} className="admin-fields-grid">
              <div className="form-group">
                <label className="form-label">Job Title / Role</label>
                <input type="text" value={expForm.role} onChange={(e) => setExpForm(prev => ({ ...prev, role: e.target.value }))} className="form-input" required placeholder="e.g. Full-Stack Web Intern" />
              </div>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input type="text" value={expForm.company} onChange={(e) => setExpForm(prev => ({ ...prev, company: e.target.value }))} className="form-input" required placeholder="e.g. TechCorp Solutions" />
              </div>
              <div className="form-group">
                <label className="form-label">Period / Duration</label>
                <input type="text" value={expForm.period} onChange={(e) => setExpForm(prev => ({ ...prev, period: e.target.value }))} className="form-input" required placeholder="e.g. Jun 2025 - Present" />
              </div>
              <div className="form-group">
                <label className="form-label">Job Description</label>
                <textarea value={expForm.description} onChange={(e) => setExpForm(prev => ({ ...prev, description: e.target.value }))} className="form-textarea" required placeholder="Outline key tasks, responsibilities, accomplishments..." rows={4}></textarea>
              </div>

              <div className="admin-footer-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowExpModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Position</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROJECTS MODAL */}
      {showProjModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card glass-card">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>{projEditItem ? 'Edit Project' : 'Create Project'}</h3>
            <form onSubmit={handleSaveProj} className="admin-fields-grid">
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input type="text" value={projForm.title} onChange={(e) => setProjForm(prev => ({ ...prev, title: e.target.value }))} className="form-input" required placeholder="e.g. E-Commerce Portal" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea value={projForm.description} onChange={(e) => setProjForm(prev => ({ ...prev, description: e.target.value }))} className="form-textarea" required placeholder="Describe what the application does..." rows={3}></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Mockup / Banner Image URL</label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    value={projForm.image} 
                    onChange={(e) => setProjForm(prev => ({ ...prev, image: e.target.value }))} 
                    className="form-input" 
                    style={{ flexGrow: 1 }}
                    placeholder="e.g. https://images.unsplash.com/..." 
                  />
                  <input 
                    type="file" 
                    accept="image/*" 
                    id="project-photo-file" 
                    onChange={handleProjectPhotoUpload} 
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="project-photo-file" className="btn btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap', padding: '0.7rem 1.2rem', borderRadius: '8px' }}>
                    <Upload size={16} /> Choose File
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Tech Tags (comma separated)</label>
                <input type="text" value={projForm.tagsInput} onChange={(e) => setProjForm(prev => ({ ...prev, tagsInput: e.target.value }))} className="form-input" placeholder="e.g. React, Node.js, Express, MongoDB" />
              </div>
              <div className="admin-fields-row">
                <div className="form-group">
                  <label className="form-label">GitHub Code Link</label>
                  <input type="url" value={projForm.githubLink} onChange={(e) => setProjForm(prev => ({ ...prev, githubLink: e.target.value }))} className="form-input" placeholder="e.g. https://github.com/..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Live Demo Link</label>
                  <input type="url" value={projForm.liveLink} onChange={(e) => setProjForm(prev => ({ ...prev, liveLink: e.target.value }))} className="form-input" placeholder="e.g. https://example.com" />
                </div>
              </div>

              <div className="admin-footer-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowProjModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AWARDS MODAL */}
      {showAwardModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card glass-card">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>{awardEditItem ? 'Edit Award' : 'Add Award'}</h3>
            <form onSubmit={handleSaveAward} className="admin-fields-grid">
              <div className="form-group">
                <label className="form-label">Award Title</label>
                <input type="text" value={awardForm.title} onChange={(e) => setAwardForm(prev => ({ ...prev, title: e.target.value }))} className="form-input" required placeholder="e.g. 2nd Place - Web Design Competition" />
              </div>
              <div className="form-group">
                <label className="form-label">Issuer / Organization</label>
                <input type="text" value={awardForm.issuer} onChange={(e) => setAwardForm(prev => ({ ...prev, issuer: e.target.value }))} className="form-input" required placeholder="e.g. Hindustan College of Arts and Science" />
              </div>
              <div className="form-group">
                <label className="form-label">Year / Date</label>
                <input type="text" value={awardForm.date} onChange={(e) => setAwardForm(prev => ({ ...prev, date: e.target.value }))} className="form-input" required placeholder="e.g. 2026" />
              </div>
              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea value={awardForm.description} onChange={(e) => setAwardForm(prev => ({ ...prev, description: e.target.value }))} className="form-textarea" placeholder="Describe the award or achievement..." rows={3}></textarea>
              </div>

              <div className="admin-footer-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAwardModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* DATABASE CONNECTION HEALTH DIAGNOSTICS MODAL */}
      {showHealthModal && dbHealth && (
        <div className="admin-modal-backdrop" onClick={() => setShowHealthModal(false)}>
          <div className="admin-modal-card glass-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Database size={22} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Database Connection Status</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowHealthModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ 
                background: dbHealth.status === 'online' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: dbHealth.status === 'online' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
                padding: '1.25rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: dbHealth.status === 'online' ? '#10b981' : '#ef4444',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  <Wifi size={22} />
                </div>

                <div>
                  <h4 style={{ margin: 0, color: dbHealth.status === 'online' ? '#10b981' : '#ef4444', fontSize: '1.1rem' }}>
                    {dbHealth.status === 'online' ? 'MongoDB Atlas Connected' : 'Server Disconnected'}
                  </h4>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    {dbHealth.status === 'online' ? 'Real-time database sync is active and operational.' : 'Using LocalStorage offline cache.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div style={{ background: 'var(--bg-glass)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Response Latency</span>
                  <p style={{ margin: '0.2rem 0 0 0', fontWeight: 600, color: 'var(--accent-primary)' }}>{dbHealth.responseTime}</p>
                </div>
                <div style={{ background: 'var(--bg-glass)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Database State</span>
                  <p style={{ margin: '0.2rem 0 0 0', fontWeight: 600, color: 'var(--accent-secondary)' }}>{dbHealth.dbState}</p>
                </div>
              </div>

              <div style={{ background: 'var(--bg-glass)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Cluster Endpoint</span>
                <p style={{ margin: '0.2rem 0 0 0', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                  {dbHealth.cluster || 'cluster0.hw2qv5l.mongodb.net/portfolio_db'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Checked at: {new Date(dbHealth.timestamp || Date.now()).toLocaleTimeString()}</span>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleCheckConnection}
                  disabled={isCheckingDb}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  <RefreshCw size={14} className={isCheckingDb ? 'spin-animation' : ''} /> Re-check
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
