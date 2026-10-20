import React, { useState } from 'react';
import { Mail, Copy, Check, Send } from 'lucide-react';
import { contactChannels } from '../data/portfolioData';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleCopyEmail = (e: React.MouseEvent, email: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setFormSubmitted(false);
    }, 4000);
  };

  const renderChannelIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail size={18} />;
      case 'linkedin':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37z" />
          </svg>
        );
      case 'github':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        );
      case 'facebook':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        );
      default:
        return <span>✉️</span>;
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-inner">
        <div className="section-header reveal">
          <div className="section-eyebrow">Get In Touch</div>
          <h2 className="section-title">Let's Work Together</h2>
          <p className="section-sub">Open to freelance projects, full-time roles &amp; collaborations</p>
        </div>

        <div className="contact-grid reveal">
          {contactChannels.map((channel, index) => {
            const isEmail = channel.iconType === 'email';
            return (
              <a
                key={index}
                href={channel.href}
                target={isEmail ? undefined : '_blank'}
                rel={isEmail ? undefined : 'noopener noreferrer'}
                className="contact-card"
              >
                <div className="contact-card-icon">
                  {renderChannelIcon(channel.iconType)}
                </div>
                <div className="contact-card-text">
                  <div className="contact-card-label">{channel.label}</div>
                  <div className="contact-card-value">{channel.value}</div>
                </div>
                {isEmail && (
                  <button
                    type="button"
                    onClick={(e) => handleCopyEmail(e, channel.value)}
                    title="Copy email address"
                    style={{
                      marginLeft: 'auto',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-light)',
                      cursor: 'pointer',
                      padding: 6,
                    }}
                  >
                    {copied ? <Check size={16} color="var(--teal)" /> : <Copy size={16} />}
                  </button>
                )}
              </a>
            );
          })}
        </div>

        {/* Quick Message Form */}
        <div className="contact-form-card reveal">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: 6 }}>
            Send a Quick Inquiry
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', marginBottom: 24 }}>
            Have a project in mind, need a consultation, or just want to say hi? Leave a note below.
          </p>

          {formSubmitted ? (
            <div
              style={{
                padding: '20px',
                borderRadius: '12px',
                background: 'rgba(10, 173, 160, 0.1)',
                border: '1px solid rgba(10, 173, 160, 0.3)',
                color: 'var(--teal)',
                fontWeight: 600,
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Check size={20} />
              Thank you! Your message has been prepared. You can also reach out directly via raonabeelahmad11.11@gmail.com
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">
                    Your Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="sarah@company.com"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group full">
                <label className="form-label" htmlFor="contact-message">
                  Project Details / Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  placeholder="Tell me about your project, timeline, and goals..."
                  className="form-textarea"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ border: 'none' }}>
                <Send size={16} />
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
