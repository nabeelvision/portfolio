import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Code2,
  PlusCircle,
  FolderGit2,
  Sparkles,
  Copy,
  Check,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Sliders,
  RotateCcw,
  Maximize2,
  Camera
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { ProjectItem } from '../types';
import { projectService } from '../services/projectService';
import { VerifiedBadge } from './VerifiedBadge';

export const AdminPortal: React.FC = () => {
  const {
    projects,
    profile,
    isAdminOpen,
    setIsAdminOpen,
    addProject,
    deleteProject,
    updateProfilePhoto,
  } = useProjects();

  // Authentication state (Strictly BsAi0035%, NO HINTS)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Portal tabs
  const [activeTab, setActiveTab] = useState<'upload' | 'manage' | 'profilePhoto' | 'code'>('upload');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Project form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Project photo adjustment states
  const [imageZoom, setImageZoom] = useState<number>(1);
  const [imagePosY, setImagePosY] = useState<number>(50);
  const [imagePosX, setImagePosX] = useState<number>(50);
  const [imageFit, setImageFit] = useState<'cover' | 'contain'>('cover');

  const [icon, setIcon] = useState('🚀');
  const [themeClass, setThemeClass] = useState<'p1' | 'p2' | 'p3'>('p1');
  const [selectedTags, setSelectedTags] = useState<string[]>(['React', 'TypeScript', 'Tailwind']);
  const [customTag, setCustomTag] = useState('');
  const [highlightsText, setHighlightsText] = useState(
    'Interactive and user-friendly interface\nHigh-performance client-side rendering\nFully responsive across mobile & desktop'
  );

  // Profile photo studio states
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>(profile.profileImage || '2.png');
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoZoom, setProfilePhotoZoom] = useState<number>(profile.profileImageZoom || 1);
  const [profilePhotoPosY, setProfilePhotoPosY] = useState<number>(10);
  const [profilePhotoPosX, setProfilePhotoPosX] = useState<number>(50);
  const [isSavingProfilePhoto, setIsSavingProfilePhoto] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile.profileImage) {
      setProfilePhotoPreview(profile.profileImage);
    }
    if (profile.profileImageZoom) {
      setProfilePhotoZoom(profile.profileImageZoom);
    }
  }, [profile]);

  useEffect(() => {
    if (!isAdminOpen) {
      setAuthError(null);
      setPasswordInput('');
    }
  }, [isAdminOpen]);

  if (!isAdminOpen) return null;

  // Handle password submission (Strictly BsAi0035%, NO HINTS)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput) {
      setAuthError('Please enter password');
      return;
    }

    setIsVerifying(true);
    setAuthError(null);

    const valid = await projectService.verifyPassword(passwordInput);
    setIsVerifying(false);

    if (valid) {
      setIsAuthenticated(true);
      setPasswordInput('');
      setAuthError(null);
    } else {
      setAuthError('Incorrect password. Access denied.');
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    projectService.clearAuth();
    setIsAuthenticated(false);
    setPasswordInput('');
    setAuthError(null);
  };

  const popularTags = [
    'React',
    'Next.js',
    'TypeScript',
    'Tailwind',
    'Node.js',
    'Python',
    'OpenAI API',
    'PostgreSQL',
    'MongoDB',
    'Docker',
    'TensorFlow',
    'Express'
  ];

  // Project screenshot file handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please upload a valid image file (PNG, JPG, WebP, SVG)');
        return;
      }
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setErrorMessage(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setErrorMessage(null);
    }
  };

  // Profile photo file handler
  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please upload a valid image file for profile photo');
        return;
      }
      setProfilePhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setProfilePhotoPreview(previewUrl);
      setErrorMessage(null);
    }
  };

  const resetPhotoAdjustments = () => {
    setImageZoom(1);
    setImagePosY(50);
    setImagePosX(50);
    setImageFit('cover');
  };

  const resetProfilePhotoAdjustments = () => {
    setProfilePhotoZoom(1);
    setProfilePhotoPosY(10);
    setProfilePhotoPosX(50);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = customTag.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags([...selectedTags, trimmed]);
      setCustomTag('');
    }
  };

  // Save new project
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Project title is required');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const highlights = highlightsText
      .split('\n')
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    const positionString = `${imagePosX}% ${imagePosY}%`;

    const newProjectData: Partial<ProjectItem> = {
      title: title.trim(),
      category: category.trim() || 'Web Application',
      description: description.trim(),
      link: liveLink.trim() || '#',
      previewImage: imageUrl.trim() || '',
      imageUrl: imageUrl.trim() || '',
      imageZoom,
      imagePosition: positionString,
      imageFit,
      icon,
      themeClass,
      caseStudy: {
        overview: description.trim() || `${title} is a modern web application built with ${selectedTags.join(', ')}.`,
        highlights: highlights.length > 0 ? highlights : ['Modern responsive design', 'Fast loading speed'],
        techStack: selectedTags.length > 0 ? selectedTags : ['React', 'TypeScript'],
        liveUrl: liveLink.trim() || '#',
        githubUrl: githubUrl.trim() || 'https://github.com/nabeelvision',
      },
    };

    const result = await addProject(newProjectData, imageFile);

    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage('Project successfully uploaded and code updated in repository!');
      setTitle('');
      setCategory('');
      setDescription('');
      setLiveLink('');
      setGithubUrl('');
      setImageUrl('');
      setImageFile(null);
      setImagePreview(null);
      resetPhotoAdjustments();
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } else {
      setErrorMessage(result.message || 'Failed to save project');
    }
  };

  // Save updated profile photo
  const handleSaveProfilePhoto = async () => {
    setIsSavingProfilePhoto(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const positionString = `${profilePhotoPosX}% ${profilePhotoPosY}%`;
    const res = await updateProfilePhoto(
      profilePhotoPreview,
      profilePhotoZoom,
      positionString,
      profilePhotoFile
    );

    setIsSavingProfilePhoto(false);

    if (res.success) {
      setSuccessMessage('Profile photo updated successfully and saved to code!');
      setProfilePhotoFile(null);
      setTimeout(() => setSuccessMessage(null), 5000);
    } else {
      setErrorMessage(res.message || 'Failed to update profile photo');
    }
  };

  const handleDelete = async (id: string, projectTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${projectTitle}" from your portfolio and code?`)) {
      const ok = await deleteProject(id);
      if (ok) {
        setSuccessMessage(`Project "${projectTitle}" deleted and code updated.`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    }
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(projects, null, 2));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsAdminOpen(false);
      }}
      style={{ zIndex: 300 }}
    >
      <div className="modal-content" style={{ maxWidth: '850px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
        {/* PASSWORD AUTHENTICATION SCREEN (NO HINTS!) */}
        {!isAuthenticated ? (
          <div style={{ padding: '40px 32px', textAlign: 'center', maxWidth: '440px', margin: '0 auto', width: '100%' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(30, 111, 232, 0.1)',
                color: 'var(--blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Lock size={28} />
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 6 }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.5px' }}>
                <span style={{ color: 'var(--blue)' }}>NABEEL</span>&nbsp;
                <span style={{ color: '#000000' }}>AHMAD</span>
              </span>
              <VerifiedBadge size={18} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: 8 }}>
              Admin Portal
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: 24 }}>
              Enter administrator password to continue.
            </p>

            {authError && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#dc2626',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <AlertCircle size={16} />
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ position: 'relative', marginBottom: 16 }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  autoFocus
                  className="form-input"
                  style={{ paddingRight: '42px', fontSize: '0.95rem' }}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-light)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setIsAdminOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {isVerifying ? 'Verifying...' : 'Unlock Portal'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN PORTAL */
          <>
            {/* MODAL HEADER */}
            <div className="modal-header" style={{ padding: '20px 28px', background: 'white' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="project-cat" style={{ fontSize: '0.82rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: 'var(--blue)' }}>NABEEL</span>&nbsp;
                    <span style={{ color: '#000000' }}>AHMAD</span>
                    <VerifiedBadge size={16} />
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      padding: '3px 10px',
                      borderRadius: '100px',
                      background: 'rgba(10, 173, 160, 0.1)',
                      color: 'var(--teal)',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      marginLeft: 6,
                    }}
                  >
                    <Sparkles size={12} /> Live Code Sync
                  </span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: 2 }}>
                  Project Management & Profile Studio
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Lock Admin Portal"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'white',
                    color: 'var(--text-mid)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <LogOut size={13} /> Lock
                </button>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsAdminOpen(false)}
                  aria-label="Close Admin Portal"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* NAVIGATION TABS */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid var(--border)',
                background: 'rgba(240, 244, 248, 0.6)',
                padding: '0 28px',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                style={{
                  padding: '12px 14px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  color: activeTab === 'upload' ? 'var(--blue)' : 'var(--text-mid)',
                  borderBottom: activeTab === 'upload' ? '2.5px solid var(--blue)' : '2.5px solid transparent',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <PlusCircle size={15} />
                Upload Web Project
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('profilePhoto')}
                style={{
                  padding: '12px 14px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  color: activeTab === 'profilePhoto' ? 'var(--blue)' : 'var(--text-mid)',
                  borderBottom: activeTab === 'profilePhoto' ? '2.5px solid var(--blue)' : '2.5px solid transparent',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Camera size={15} />
                Update Profile Photo
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('manage')}
                style={{
                  padding: '12px 14px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  color: activeTab === 'manage' ? 'var(--blue)' : 'var(--text-mid)',
                  borderBottom: activeTab === 'manage' ? '2.5px solid var(--blue)' : '2.5px solid transparent',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <FolderGit2 size={15} />
                Manage Projects ({projects.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('code')}
                style={{
                  padding: '12px 14px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  color: activeTab === 'code' ? 'var(--blue)' : 'var(--text-mid)',
                  borderBottom: activeTab === 'code' ? '2.5px solid var(--blue)' : '2.5px solid transparent',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Code2 size={15} />
                Code Inspector
              </button>
            </div>

            {/* ALERT NOTIFICATIONS */}
            {successMessage && (
              <div
                style={{
                  margin: '16px 28px 0',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(10, 173, 160, 0.1)',
                  border: '1px solid rgba(10, 173, 160, 0.3)',
                  color: 'var(--teal)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <CheckCircle2 size={18} />
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div
                style={{
                  margin: '16px 28px 0',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#dc2626',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <AlertCircle size={18} />
                {errorMessage}
              </div>
            )}

            {/* TAB CONTENTS */}
            <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
              {/* TAB: UPDATE PROFILE PHOTO */}
              {activeTab === 'profilePhoto' && (
                <div>
                  <div style={{ marginBottom: 20 }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: 4 }}>
                      Profile Photo & Avatar Studio
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                      Upload your picture from gallery or files, adjust zoom and vertical positioning, and update the Hero section.
                    </p>
                  </div>

                  <input
                    type="file"
                    ref={profileFileInputRef}
                    accept="image/*"
                    onChange={handleProfileFileChange}
                    style={{ display: 'none' }}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 320px) 1fr', gap: '28px', alignItems: 'center' }}>
                    {/* REAL-TIME GLOW RING PREVIEW */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div
                        style={{
                          position: 'relative',
                          width: '210px',
                          height: '210px',
                          borderRadius: '50%',
                          padding: '6px',
                          background: 'conic-gradient(from 0deg, var(--blue), var(--teal), var(--blue))',
                          boxShadow: '0 8px 32px rgba(30, 111, 232, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 14,
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: '3px solid white',
                            background: '#0D1B2A',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <img
                            src={profilePhotoPreview}
                            alt="Profile Preview"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: `${profilePhotoPosX}% ${profilePhotoPosY}%`,
                              transform: `scale(${profilePhotoZoom})`,
                              transition: 'transform 0.15s ease, object-position 0.15s ease',
                            }}
                          />
                        </div>
                      </div>

                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)' }}>
                        Live Hero Circle Preview
                      </span>
                    </div>

                    {/* PHOTO CONTROLS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {/* UPLOAD BUTTONS */}
                      <div
                        style={{
                          padding: '16px',
                          borderRadius: '12px',
                          background: 'rgba(30, 111, 232, 0.04)',
                          border: '1.5px dashed var(--border-strong)',
                          textAlign: 'center',
                        }}
                      >
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => profileFileInputRef.current?.click()}
                          style={{ padding: '10px 22px', fontSize: '0.88rem', margin: '0 auto' }}
                        >
                          <Upload size={16} /> Choose Photo From Gallery / Files
                        </button>
                        <p style={{ fontSize: '0.74rem', color: 'var(--text-light)', marginTop: 8 }}>
                          Supports PNG, JPG, JPEG, WebP
                        </p>
                      </div>

                      {/* ADJUSTMENT SLIDERS */}
                      <div
                        style={{
                          background: 'white',
                          border: '1px solid var(--border)',
                          borderRadius: '12px',
                          padding: '18px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 14,
                        }}
                      >
                        {/* ZOOM SLIDER */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>
                              Photo Zoom / Scale
                            </label>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--blue)' }}>
                              {Math.round(profilePhotoZoom * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="2.5"
                            step="0.05"
                            value={profilePhotoZoom}
                            onChange={(e) => setProfilePhotoZoom(parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--blue)', cursor: 'pointer' }}
                          />
                        </div>

                        {/* VERTICAL FOCUS (Y) */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>
                              Vertical Alignment (Focus on Face)
                            </label>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--blue)' }}>
                              {profilePhotoPosY === 10 ? 'Head / Top' : profilePhotoPosY === 50 ? 'Center' : `${profilePhotoPosY}%`}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={profilePhotoPosY}
                            onChange={(e) => setProfilePhotoPosY(parseInt(e.target.value, 10))}
                            style={{ width: '100%', accentColor: 'var(--blue)', cursor: 'pointer' }}
                          />
                          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                            <button
                              type="button"
                              onClick={() => setProfilePhotoPosY(5)}
                              style={{
                                flex: 1,
                                fontSize: '0.72rem',
                                padding: '4px',
                                background: profilePhotoPosY <= 10 ? 'var(--blue)' : 'rgba(30,111,232,0.06)',
                                color: profilePhotoPosY <= 10 ? 'white' : 'var(--text-mid)',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                              }}
                            >
                              Top / Face
                            </button>
                            <button
                              type="button"
                              onClick={() => setProfilePhotoPosY(50)}
                              style={{
                                flex: 1,
                                fontSize: '0.72rem',
                                padding: '4px',
                                background: profilePhotoPosY === 50 ? 'var(--blue)' : 'rgba(30,111,232,0.06)',
                                color: profilePhotoPosY === 50 ? 'white' : 'var(--text-mid)',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                              }}
                            >
                              Center
                            </button>
                            <button
                              type="button"
                              onClick={() => setProfilePhotoPosY(90)}
                              style={{
                                flex: 1,
                                fontSize: '0.72rem',
                                padding: '4px',
                                background: profilePhotoPosY >= 85 ? 'var(--blue)' : 'rgba(30,111,232,0.06)',
                                color: profilePhotoPosY >= 85 ? 'white' : 'var(--text-mid)',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                              }}
                            >
                              Lower
                            </button>
                          </div>
                        </div>

                        {/* HORIZONTAL FOCUS (X) */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>
                              Horizontal Alignment (X)
                            </label>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--blue)' }}>
                              {profilePhotoPosX === 50 ? 'Center' : `${profilePhotoPosX}%`}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={profilePhotoPosX}
                            onChange={(e) => setProfilePhotoPosX(parseInt(e.target.value, 10))}
                            style={{ width: '100%', accentColor: 'var(--blue)', cursor: 'pointer' }}
                          />
                        </div>
                      </div>

                      {/* SAVE & RESET BUTTONS */}
                      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={resetProfilePhotoAdjustments}
                          className="btn-secondary"
                          style={{ padding: '9px 16px', fontSize: '0.84rem' }}
                        >
                          <RotateCcw size={14} /> Reset
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setProfilePhotoPreview('2.png');
                            resetProfilePhotoAdjustments();
                          }}
                          className="btn-secondary"
                          style={{ padding: '9px 16px', fontSize: '0.84rem' }}
                          title="Restore initial photo"
                        >
                          Restore Default
                        </button>
                        <button
                          type="button"
                          disabled={isSavingProfilePhoto}
                          onClick={handleSaveProfilePhoto}
                          className="btn-primary"
                          style={{ minWidth: '180px', justifyContent: 'center' }}
                        >
                          {isSavingProfilePhoto ? (
                            'Saving & Updating Code...'
                          ) : (
                            <>
                              <CheckCircle2 size={16} /> Save & Update Photo
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1: UPLOAD NEW PROJECT */}
              {activeTab === 'upload' && (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="proj-title">
                        Project Title *
                      </label>
                      <input
                        id="proj-title"
                        type="text"
                        required
                        placeholder="Project title..."
                        className="form-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="proj-category">
                        Category / Tagline
                      </label>
                      <input
                        id="proj-category"
                        type="text"
                        placeholder="e.g. Full Stack AI, E-Commerce, SaaS"
                        className="form-input"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group full" style={{ marginBottom: '16px' }}>
                    <label className="form-label" htmlFor="proj-desc">
                      Short Description *
                    </label>
                    <textarea
                      id="proj-desc"
                      rows={2}
                      required
                      placeholder="Describe what the application does, its core capabilities, and target audience..."
                      className="form-textarea"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  {/* LINKS */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="proj-live">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <LinkIcon size={13} /> Live Web Project URL *
                        </span>
                      </label>
                      <input
                        id="proj-live"
                        type="url"
                        placeholder="https://my-app.netlify.app"
                        className="form-input"
                        value={liveLink}
                        onChange={(e) => setLiveLink(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="proj-github">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <FolderGit2 size={13} /> GitHub Repository URL
                        </span>
                      </label>
                      <input
                        id="proj-github"
                        type="url"
                        placeholder="https://github.com/..."
                        className="form-input"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* PREVIEW IMAGE UPLOAD & INTERACTIVE ADJUSTER */}
                  <div
                    style={{
                      background: 'rgba(30, 111, 232, 0.03)',
                      border: '1.5px dashed var(--border-strong)',
                      borderRadius: '16px',
                      padding: '22px',
                      marginBottom: '22px',
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />

                    {imagePreview ? (
                      /* PHOTO ADJUSTMENT STUDIO */
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-dark)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <Sliders size={16} color="var(--blue)" />
                            Photo Preview & Adjustment Studio
                          </span>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              type="button"
                              onClick={resetPhotoAdjustments}
                              className="btn-secondary"
                              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                              title="Reset adjustments"
                            >
                              <RotateCcw size={13} /> Reset
                            </button>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="btn-secondary"
                              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                            >
                              <Upload size={13} /> Change Photo
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setImageFile(null);
                                setImagePreview(null);
                                setImageUrl('');
                                if (fileInputRef.current) fileInputRef.current.value = '';
                              }}
                              style={{
                                background: 'rgba(239, 68, 68, 0.08)',
                                color: '#dc2626',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '4px 8px',
                                cursor: 'pointer',
                              }}
                              title="Remove image"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* LIVE PREVIEW CONTAINER */}
                        <div
                          style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '440px',
                            height: '200px',
                            margin: '0 auto 16px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: '2px solid var(--border)',
                            boxShadow: 'var(--card-shadow)',
                            background: '#0D1B2A',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <img
                            src={imagePreview}
                            alt="Adjustable Preview"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: imageFit,
                              objectPosition: `${imagePosX}% ${imagePosY}%`,
                              transform: `scale(${imageZoom})`,
                              transition: 'transform 0.15s ease, object-position 0.15s ease',
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              bottom: 8,
                              right: 8,
                              background: 'rgba(13, 27, 42, 0.75)',
                              backdropFilter: 'blur(4px)',
                              color: 'white',
                              borderRadius: '6px',
                              padding: '2px 8px',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                            }}
                          >
                            Live Card Preview
                          </div>
                        </div>

                        {/* ADJUSTMENT CONTROLS */}
                        <div
                          style={{
                            background: 'white',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            padding: '16px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                            gap: '14px',
                          }}
                        >
                          {/* ZOOM SLIDER */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <label className="form-label" style={{ fontSize: '0.74rem' }}>
                                Zoom / Scale
                              </label>
                              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--blue)' }}>
                                {Math.round(imageZoom * 100)}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="2"
                              step="0.05"
                              value={imageZoom}
                              onChange={(e) => setImageZoom(parseFloat(e.target.value))}
                              style={{ width: '100%', accentColor: 'var(--blue)', cursor: 'pointer' }}
                            />
                          </div>

                          {/* VERTICAL POSITION (FOCUS) */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <label className="form-label" style={{ fontSize: '0.74rem' }}>
                                Vertical Position (Y)
                              </label>
                              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--blue)' }}>
                                {imagePosY === 0 ? 'Top' : imagePosY === 50 ? 'Center' : imagePosY === 100 ? 'Bottom' : `${imagePosY}%`}
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              value={imagePosY}
                              onChange={(e) => setImagePosY(parseInt(e.target.value, 10))}
                              style={{ width: '100%', accentColor: 'var(--blue)', cursor: 'pointer' }}
                            />
                            <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                              <button
                                type="button"
                                onClick={() => setImagePosY(0)}
                                style={{
                                  flex: 1,
                                  fontSize: '0.68rem',
                                  padding: '2px 4px',
                                  background: imagePosY === 0 ? 'var(--blue)' : 'rgba(30,111,232,0.06)',
                                  color: imagePosY === 0 ? 'white' : 'var(--text-mid)',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                }}
                              >
                                Top
                              </button>
                              <button
                                type="button"
                                onClick={() => setImagePosY(50)}
                                style={{
                                  flex: 1,
                                  fontSize: '0.68rem',
                                  padding: '2px 4px',
                                  background: imagePosY === 50 ? 'var(--blue)' : 'rgba(30,111,232,0.06)',
                                  color: imagePosY === 50 ? 'white' : 'var(--text-mid)',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                }}
                              >
                                Center
                              </button>
                              <button
                                type="button"
                                onClick={() => setImagePosY(100)}
                                style={{
                                  flex: 1,
                                  fontSize: '0.68rem',
                                  padding: '2px 4px',
                                  background: imagePosY === 100 ? 'var(--blue)' : 'rgba(30,111,232,0.06)',
                                  color: imagePosY === 100 ? 'white' : 'var(--text-mid)',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                }}
                              >
                                Bottom
                              </button>
                            </div>
                          </div>

                          {/* HORIZONTAL POSITION */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <label className="form-label" style={{ fontSize: '0.74rem' }}>
                                Horizontal Position (X)
                              </label>
                              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--blue)' }}>
                                {imagePosX === 50 ? 'Center' : `${imagePosX}%`}
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              value={imagePosX}
                              onChange={(e) => setImagePosX(parseInt(e.target.value, 10))}
                              style={{ width: '100%', accentColor: 'var(--blue)', cursor: 'pointer' }}
                            />
                            <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                              <button
                                type="button"
                                onClick={() => setImagePosX(0)}
                                style={{
                                  flex: 1,
                                  fontSize: '0.68rem',
                                  padding: '2px 4px',
                                  background: imagePosX === 0 ? 'var(--blue)' : 'rgba(30,111,232,0.06)',
                                  color: imagePosX === 0 ? 'white' : 'var(--text-mid)',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                }}
                              >
                                Left
                              </button>
                              <button
                                type="button"
                                onClick={() => setImagePosX(50)}
                                style={{
                                  flex: 1,
                                  fontSize: '0.68rem',
                                  padding: '2px 4px',
                                  background: imagePosX === 50 ? 'var(--blue)' : 'rgba(30,111,232,0.06)',
                                  color: imagePosX === 50 ? 'white' : 'var(--text-mid)',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                }}
                              >
                                Center
                              </button>
                              <button
                                type="button"
                                onClick={() => setImagePosX(100)}
                                style={{
                                  flex: 1,
                                  fontSize: '0.68rem',
                                  padding: '2px 4px',
                                  background: imagePosX === 100 ? 'var(--blue)' : 'rgba(30,111,232,0.06)',
                                  color: imagePosX === 100 ? 'white' : 'var(--text-mid)',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                }}
                              >
                                Right
                              </button>
                            </div>
                          </div>

                          {/* FIT MODE */}
                          <div>
                            <label className="form-label" style={{ fontSize: '0.74rem', marginBottom: 4, display: 'block' }}>
                              Fit Display Mode
                            </label>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                type="button"
                                onClick={() => setImageFit('cover')}
                                style={{
                                  flex: 1,
                                  padding: '8px',
                                  borderRadius: '8px',
                                  border: imageFit === 'cover' ? '1.5px solid var(--blue)' : '1px solid var(--border)',
                                  background: imageFit === 'cover' ? 'rgba(30, 111, 232, 0.08)' : 'white',
                                  color: imageFit === 'cover' ? 'var(--blue)' : 'var(--text-mid)',
                                  fontWeight: 600,
                                  fontSize: '0.76rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 4,
                                }}
                              >
                                <Maximize2 size={12} /> Fill (Cover)
                              </button>
                              <button
                                type="button"
                                onClick={() => setImageFit('contain')}
                                style={{
                                  flex: 1,
                                  padding: '8px',
                                  borderRadius: '8px',
                                  border: imageFit === 'contain' ? '1.5px solid var(--blue)' : '1px solid var(--border)',
                                  background: imageFit === 'contain' ? 'rgba(30, 111, 232, 0.08)' : 'white',
                                  color: imageFit === 'contain' ? 'var(--blue)' : 'var(--text-mid)',
                                  fontWeight: 600,
                                  fontSize: '0.76rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 4,
                                }}
                              >
                                Fit (Contain)
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* INITIAL UPLOAD DROPZONE */
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'rgba(30, 111, 232, 0.1)',
                            color: 'var(--blue)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 10px',
                          }}
                        >
                          <Upload size={22} />
                        </div>
                        <p style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 4 }}>
                          Upload Project Preview Screenshot / Photo
                        </p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: 14 }}>
                          Drag and drop PNG, JPG, WebP file or browse from device (With real-time photo adjuster)
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                          <button
                            type="button"
                            className="btn-primary"
                            onClick={() => fileInputRef.current?.click()}
                            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                          >
                            <ImageIcon size={14} /> Browse Image File
                          </button>
                        </div>

                        <div style={{ margin: '14px 0 6px', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                          — OR ENTER DIRECT IMAGE URL —
                        </div>
                        <input
                          type="url"
                          placeholder="https://example.com/screenshot.png"
                          className="form-input"
                          style={{ maxWidth: '380px', margin: '0 auto', fontSize: '0.82rem', padding: '8px 12px' }}
                          value={imageUrl}
                          onChange={(e) => {
                            setImageUrl(e.target.value);
                            if (e.target.value) {
                              setImagePreview(e.target.value);
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* TECH STACK TAGS */}
                  <div style={{ marginBottom: '18px' }}>
                    <label className="form-label" style={{ marginBottom: 8, display: 'block' }}>
                      Tech Stack & Technologies
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                      {popularTags.map((tag) => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                          <button
                            type="button"
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`tag ${isSelected ? '' : 'teal'}`}
                            style={{
                              cursor: 'pointer',
                              background: isSelected ? 'var(--blue)' : 'rgba(30, 111, 232, 0.06)',
                              color: isSelected ? 'white' : 'var(--text-mid)',
                              border: isSelected ? '1px solid var(--blue)' : '1px solid var(--border)',
                              padding: '4px 12px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', gap: 8, maxWidth: '340px' }}>
                      <input
                        type="text"
                        placeholder="Add custom tag..."
                        className="form-input"
                        style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        onKeyDown={handleAddCustomTag}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomTag}
                        className="btn-secondary"
                        style={{ padding: '6px 14px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* HIGHLIGHTS */}
                  <div className="form-group full" style={{ marginBottom: '18px' }}>
                    <label className="form-label" htmlFor="proj-highlights">
                      Key Technical Highlights (One per line)
                    </label>
                    <textarea
                      id="proj-highlights"
                      rows={3}
                      placeholder="Enter key technical achievements..."
                      className="form-textarea"
                      value={highlightsText}
                      onChange={(e) => setHighlightsText(e.target.value)}
                    />
                  </div>

                  {/* CARD ACCENT & ICON */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <div className="form-group">
                      <label className="form-label">Gradient Theme Style</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {(['p1', 'p2', 'p3'] as const).map((t) => (
                          <button
                            type="button"
                            key={t}
                            onClick={() => setThemeClass(t)}
                            style={{
                              flex: 1,
                              padding: '8px',
                              borderRadius: '8px',
                              border: themeClass === t ? '2px solid var(--blue)' : '1px solid var(--border)',
                              background: t === 'p1' ? '#dbeafe' : t === 'p2' ? '#ccfbf1' : '#e0f2fe',
                              cursor: 'pointer',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              color: 'var(--text-dark)',
                            }}
                          >
                            {t === 'p1' ? 'Ice Blue' : t === 'p2' ? 'Arctic Teal' : 'Sky Blue'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="proj-icon">
                        Card Emoji Icon
                      </label>
                      <input
                        id="proj-icon"
                        type="text"
                        maxLength={3}
                        className="form-input"
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        style={{ width: '80px', textAlign: 'center', fontSize: '1.2rem' }}
                      />
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setIsAdminOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary"
                      style={{ minWidth: '180px', justifyContent: 'center' }}
                    >
                      {isSubmitting ? (
                        'Saving & Updating Code...'
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          Save & Update Code
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: MANAGE PROJECTS */}
              {activeTab === 'manage' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-light)' }}>
                      Total projects registered: <strong>{projects.length}</strong>
                    </p>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                      onClick={() => setActiveTab('upload')}
                    >
                      <PlusCircle size={14} /> Add Another Project
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16,
                          padding: '14px 18px',
                          background: 'white',
                          border: '1px solid var(--border)',
                          borderRadius: '14px',
                          boxShadow: 'var(--card-shadow)',
                        }}
                      >
                        <div
                          style={{
                            width: '54px',
                            height: '54px',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            background: '#0D1B2A',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.4rem',
                            flexShrink: 0,
                            border: '1px solid var(--border)',
                          }}
                        >
                          {project.previewImage || project.imageUrl ? (
                            <img
                              src={project.previewImage || project.imageUrl}
                              alt={project.title}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: project.imageFit || 'cover',
                                objectPosition: project.imagePosition || 'center',
                              }}
                            />
                          ) : (
                            <span>{project.icon}</span>
                          )}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span className="project-cat" style={{ fontSize: '0.68rem' }}>
                            {project.category}
                          </span>
                          <h4
                            style={{
                              fontSize: '0.98rem',
                              fontWeight: 700,
                              color: 'var(--text-dark)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {project.title}
                          </h4>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                            {project.caseStudy?.techStack?.slice(0, 3).map((t, idx) => (
                              <span key={idx} className="tag" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {project.link && project.link !== '#' && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="project-link-ext"
                              title="Visit live link"
                            >
                              <ExternalLink size={13} />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(project.id, project.title)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.08)',
                              color: '#dc2626',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px',
                              cursor: 'pointer',
                            }}
                            title="Delete project"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CODE INSPECTOR */}
              {activeTab === 'code' && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                        Live Code Representation (<code style={{ color: 'var(--blue)' }}>src/data/projects.json</code> &amp; <code style={{ color: 'var(--teal)' }}>src/data/profile.json</code>)
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                        Every added project and profile photo update is automatically committed to code.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={copyCodeToClipboard}
                      className="btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      {copiedCode ? <Check size={14} color="var(--teal)" /> : <Copy size={14} />}
                      {copiedCode ? 'Copied!' : 'Copy Projects JSON'}
                    </button>
                  </div>

                  <pre
                    style={{
                      background: '#0D1B2A',
                      color: '#93c5fd',
                      padding: '18px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontFamily: 'monospace',
                      overflowX: 'auto',
                      maxHeight: '380px',
                      lineHeight: 1.5,
                    }}
                  >
                    {JSON.stringify(projects, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
