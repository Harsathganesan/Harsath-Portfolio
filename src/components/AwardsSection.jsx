import React from 'react';
import { Trophy, Calendar } from 'lucide-react';

const AwardsSection = ({ awards = [] }) => {
  return (
    <section id="awards" className="section container">
      <h2 className="section-title">Awards & Achievements</h2>
      
      <div className="awards-grid">
        {awards.length > 0 ? (
          awards.map((award) => (
            <div key={award.id} className="glass-card" style={{
              display: 'flex',
              gap: '1.25rem',
              alignItems: 'flex-start',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative background glow for trophy */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />
              
              <div style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                border: '1px solid var(--border-glass-active)',
                borderRadius: '12px',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
                boxShadow: 'var(--shadow-sm)',
                flexShrink: 0
              }}>
                <Trophy size={28} />
              </div>
              
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0, fontFamily: 'var(--font-title)' }}>
                    {award.title}
                  </h3>
                  <span style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    background: 'var(--timeline-period-bg)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap'
                  }}>
                    <Calendar size={12} />
                    {award.date}
                  </span>
                </div>
                
                <span style={{ fontSize: '0.95rem', color: 'var(--accent-secondary)', fontWeight: 500 }}>
                  {award.issuer}
                </span>
                
                {award.description && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '0.25rem' }}>
                    {award.description}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', gridColumn: '1 / -1', padding: '3rem' }}>
            No awards added yet. Add awards using the Admin Panel!
          </p>
        )}
      </div>
    </section>
  );
};

export default AwardsSection;
