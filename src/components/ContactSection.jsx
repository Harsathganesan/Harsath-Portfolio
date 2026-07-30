import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, Phone, Loader2 } from 'lucide-react';
import { sendContactMessage } from '../data/db';

const ContactSection = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Save contact message to MongoDB Atlas Backend API
      await sendContactMessage(formData);

      // Build WhatsApp pre-filled message URL
      const whatsappNumber = "916382245266";
      const messageText = `Hi Harsath,\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Subject:* ${formData.subject}\n*Message:* ${formData.message}`;
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');

      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <section id="contact" className="section container" style={{ borderBottom: '1px solid var(--border-glass)' }}>
      <h2 className="section-title">Contact Me</h2>

      <div className="contact-grid">
        <div className="contact-info-panel glass-card">
          <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Let's Build Something</h3>
          <p className="contact-text">
            Have an exciting project in mind or want to collaborate? Fill out the form below to message me directly on WhatsApp or reach out via email.
          </p>

          <div className="contact-details">
            <div className="contact-item">
              <div className="contact-icon">
                <Mail size={20} />
              </div>
              <div>
                <div className="contact-label">Email</div>
                <div className="contact-value">
                  <a href={`mailto:${(profile.socials?.email && profile.socials.email !== "harsath@example.com") ? profile.socials.email : "harsath137@gmail.com"}`}>
                    {(profile.socials?.email && profile.socials.email !== "harsath@example.com") ? profile.socials.email : "harsath137@gmail.com"}
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <Phone size={20} />
              </div>
              <div>
                <div className="contact-label">Phone / WhatsApp</div>
                <div className="contact-value">
                  <a href="https://wa.me/916382245266" target="_blank" rel="noopener noreferrer">
                    +91 6382245266
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <MapPin size={20} />
              </div>
              <div>
                <div className="contact-label">Location</div>
                <div className="contact-value">
                  {profile.socials.location || "Pudukkottai, Tamil Nadu, India"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-panel glass-card">
          {submitted ? (
            <div className="submit-success">
              <CheckCircle2 size={40} style={{ margin: '0 auto 1rem auto', display: 'block' }} />
              <h3>Message Sent Successfully!</h3>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                Thank you for reaching out. I'll get back to you as soon as possible.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="contact-name" className="form-label">Name</label>
                  <input 
                    type="text" 
                    id="contact-name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange}
                    className="form-input" 
                    placeholder="Enter your name" 
                    style={{ borderColor: errors.name ? '#ef4444' : '' }}
                  />
                  {errors.name && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem' }}>{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email" className="form-label">Email</label>
                  <input 
                    type="email" 
                    id="contact-email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    className="form-input" 
                    placeholder="Enter your email" 
                    style={{ borderColor: errors.email ? '#ef4444' : '' }}
                  />
                  {errors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem' }}>{errors.email}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contact-subject" className="form-label">Subject</label>
                <input 
                  type="text" 
                  id="contact-subject" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange}
                  className="form-input" 
                  placeholder="What is this regarding?" 
                  style={{ borderColor: errors.subject ? '#ef4444' : '' }}
                />
                {errors.subject && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem' }}>{errors.subject}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="contact-message" className="form-label">Message</label>
                <textarea 
                  id="contact-message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange}
                  className="form-textarea" 
                  placeholder="Write your message here..." 
                  style={{ borderColor: errors.message ? '#ef4444' : '' }}
                ></textarea>
                {errors.message && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem' }}>{errors.message}</span>}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isSubmitting}
                style={{ alignSelf: 'flex-start', marginTop: '0.5rem', opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? (
                  <>Sending Message... <Loader2 size={16} className="animate-spin" /></>
                ) : (
                  <>Send Message <Send size={16} /></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
